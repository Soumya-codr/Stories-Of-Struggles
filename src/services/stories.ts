
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, query, where, writeBatch } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import { getAuthenticatedUser } from "@/lib/firebase-helpers";


// This defines the shape of a user object.
// We export it so it can be used in other parts of the app.
export type User = {
    id: string; // This will be the Firebase Auth UID
    name: string;
    username: string;
    email: string;
    avatarUrl: string;
    bio?: string;
    website?: string;
    followers?: number;
    following?: number;
};

// NOTE: This is a placeholder for the real user data
// In a real app, you would get this from your authentication system
export const getCurrentUser = async (): Promise<User | null> => {
    // This now gets the real authenticated user
    return getAuthenticatedUser();
};

export async function createStory(data: any) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("You must be logged in to create a story.");
    }

    try {
        const docRef = await addDoc(collection(db, "stories"), {
            author: {
                id: user.id,
                name: user.name,
                username: user.username,
                avatarUrl: user.avatarUrl,
            },
            title: data.title,
            description: data.description,
            story: data.story,
            tags: data.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean),
            projectUrl: data.projectUrl || '',
            sourceCodeUrl: data.sourceCodeUrl || '',
            imageUrl: data.imageUrl || '',
            videoUrl: data.videoUrl || '',
            upvotes: 0,
            comments: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        console.log("Document written with ID: ", docRef.id);
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error adding document: ", e);
        return { success: false, error: "Failed to create story." };
    }
}

export async function createTeam(data: { name: string, description: string }) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in to create a team.");
    }
    
    try {
        const docRef = await addDoc(collection(db, "teams"), {
            name: data.name,
            description: data.description,
            ownerId: user.id,
            members: [user.id],
            createdAt: serverTimestamp(),
        });
        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error creating team: ", e);
        return { success: false, error: "Failed to create team." };
    }
}


export async function getStories() {
    const storiesCol = collection(db, 'stories');
    const storySnapshot = await getDocs(storiesCol);
    const storyList = storySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        }
    });
    return storyList as any[];
}

export async function getStoryById(id: string) {
    const storyDoc = doc(db, 'stories', id);
    const storySnapshot = await getDoc(storyDoc);

    if (storySnapshot.exists()) {
        const data = storySnapshot.data();
        return {
            id: storySnapshot.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        } as any;
    } else {
        return null;
    }
}

let usersCache: User[] | null = null;

export async function getAllUsers(): Promise<User[]> {
    if (usersCache) {
        return usersCache;
    }
    
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    
    usersCache = userList;
    return userList;
}

export async function getUserByUsername(username: string): Promise<User | null> {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function getUserById(id: string): Promise<User | null> {
    const userDocRef = doc(db, 'users', id);
    const userSnapshot = await getDoc(userDocRef);

    if (userSnapshot.exists()) {
        return { id: userSnapshot.id, ...userSnapshot.data() } as User;
    } else {
        return null;
    }
}

export async function getStoriesByUsername(username: string) {
    const q = query(collection(db, "stories"), where("author.username", "==", username));
    const querySnapshot = await getDocs(q);
    const storyList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        }
    });
    return storyList as any[];
}
