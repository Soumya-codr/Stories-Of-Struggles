'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, getDocs, doc, getDoc, query, where } from "firebase/firestore";

// NOTE: This is a placeholder for the real user data
// In a real app, you would get this from your authentication system
export const getCurrentUser = async () => {
    return {
        id: 'user123',
        name: 'Developer',
        username: 'developer',
        avatar: 'https://placehold.co/40x40.png'
    };
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
                avatarUrl: user.avatar,
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

export async function getStories() {
    const storiesCol = collection(db, 'stories');
    const storySnapshot = await getDocs(storiesCol);
    const storyList = storySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            // Convert Firestore Timestamp to a serializable format
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

// NOTE: This is a placeholder user lookup.
// In a real app, you would have a 'users' collection.
const users = [
    {
      id: 'user123',
      name: 'Developer',
      username: 'developer',
      avatarUrl: 'https://placehold.co/128x128.png',
      bio: 'This is your profile! Share your story, showcase your projects, and connect with other developers.',
      website: 'https://example.com',
      followers: 10,
      following: 25,
    },
     {
      id: 'alexdoe456',
      name: 'Alex Doe',
      username: 'alexdoe',
      avatarUrl: 'https://placehold.co/128x128.png',
      bio: 'Senior Software Engineer, passionate about open source, clean code, and building communities. Currently working on Project Phoenix.',
      website: 'https://example.com',
      followers: 482,
      following: 120,
    }
];

export async function getUserByUsername(username: string) {
    // In a real app, this would query a 'users' collection in Firestore
    // const q = query(collection(db, "users"), where("username", "==", username));
    // const querySnapshot = await getDocs(q);
    // if (!querySnapshot.empty) {
    //    const doc = querySnapshot.docs[0];
    //    return { id: doc.id, ...doc.data() };
    // }
    return users.find(u => u.username === username) || null;
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
