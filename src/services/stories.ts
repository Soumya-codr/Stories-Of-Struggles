'use server';

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// NOTE: This is a placeholder for the real user data
// In a real app, you would get this from your authentication system
const getCurrentUser = async () => {
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
            commentsCount: 0,
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
