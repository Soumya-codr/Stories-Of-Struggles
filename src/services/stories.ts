
'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, query, where, writeBatch, updateDoc, Timestamp } from "firebase/firestore";
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

// This defines the shape of a Story object.
export type Story = {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string;
    username: string;
  };
  imageUrl: string;
  tags: string[];
  upvotes: number;
  comments: number;
  createdAt: string; // ISO string
  dataAiHint?: string;
  story: string;
  projectUrl?: string;
  sourceCodeUrl?: string;
  videoUrl?: string;
};

export async function createStory(data: any, userId: string) {
    const user = await getUserById(userId);

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
            tags: data.tags.split(',').map((tag: string) => tag.trim().toLowerCase()).filter(Boolean),
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

export async function createTeam(data: { name: string, description: string }, userId: string) {
    const user = await getUserById(userId);
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


export async function getStories(): Promise<Story[]> {
    const storiesCol = collection(db, 'stories');
    const storySnapshot = await getDocs(storiesCol);
    const storyList = storySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as Story;
    });
    return storyList;
}

export async function getStoryById(id: string): Promise<Story | null> {
    const storyDoc = doc(db, 'stories', id);
    const storySnapshot = await getDoc(storyDoc);

    if (storySnapshot.exists()) {
        const data = storySnapshot.data();
        return {
            id: storySnapshot.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as Story;
    } else {
        return null;
    }
}


// This function is intended for server-side use or where broad access is needed.
// For client-side chat, a more specific function is used.
export async function getAllUsers(): Promise<User[]> {
    const usersCol = collection(db, 'users');
    const userSnapshot = await getDocs(usersCol);
    return userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
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

export async function getStoriesByUsername(username: string): Promise<Story[]> {
    const q = query(collection(db, "stories"), where("author.username", "==", username));
    const querySnapshot = await getDocs(q);
    const storyList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        } as Story;
    });
    return storyList;
}


export async function updateUserProfile(userId: string, data: Partial<Pick<User, 'name' | 'bio' | 'website'>>) {
    const user = await getAuthenticatedUser();
    if (!user || user.id !== userId) {
        throw new Error("Not authorized");
    }

    const userDocRef = doc(db, 'users', userId);
    
    // We should also update the author details in all of their stories
    const storiesRef = collection(db, "stories");
    const q = query(storiesRef, where("author.id", "==", userId));
    const storiesSnapshot = await getDocs(q);

    const batch = writeBatch(db);

    // Update user document
    batch.update(userDocRef, data);

    // Update author info in all stories
    storiesSnapshot.forEach(storyDoc => {
        const storyRef = doc(db, 'stories', storyDoc.id);
        const updatedAuthor = {
            'author.name': data.name,
        }
        batch.update(storyRef, updatedAuthor);
    });

    await batch.commit();
}
