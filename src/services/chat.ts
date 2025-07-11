
'use server';

import { db } from "@/lib/firebase";
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    getDocs, 
    doc,
    query, 
    where,
    orderBy,
    updateDoc,
    Timestamp,
    getDoc,
    setDoc,
    onSnapshot,
    limit
} from "firebase/firestore";
import type { User } from "./stories";

// Base Chat document structure in Firestore
export interface Chat {
    id: string;
    participantIds: string[];
    lastMessage?: string;
    lastMessageTimestamp: Timestamp;
}

// Chat object enriched with participant user data
export interface ChatWithParticipants extends Chat {
    participants: User[];
}

// Message document structure in Firestore
export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string; // ISO string format for client-side use
}

/**
 * Creates a new chat between two users if one doesn't already exist.
 * Uses a deterministic ID to prevent duplicate chats.
 */
export async function createChat(user1Id: string, user2Id: string): Promise<string> {
    const sortedIds = [user1Id, user2Id].sort();
    const chatId = sortedIds.join('_'); // Deterministic ID
    const chatDocRef = doc(db, 'chats', chatId);

    try {
        const chatDoc = await getDoc(chatDocRef);

        if (chatDoc.exists()) {
            // Chat already exists, return its ID
            return chatId;
        }

        // Chat doesn't exist, create it
        await setDoc(chatDocRef, {
            participantIds: sortedIds,
            lastMessage: "Chat created.",
            lastMessageTimestamp: Timestamp.now(), // Ensure field exists on creation
        });

        return chatId;
    } catch (error) {
        console.error("Error creating chat:", error);
        throw new Error("Could not create or find chat.");
    }
}


/**
 * Sends a message to a chat and updates the chat's last message details.
 */
export async function sendMessage(chatId: string, senderId: string, text: string): Promise<void> {
    if (!chatId || !senderId || !text.trim()) {
        throw new Error("Missing required parameters for sending a message.");
    }

    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const chatDocRef = doc(db, 'chats', chatId);

    try {
        // Add the new message to the messages subcollection
        await addDoc(messagesCollection, {
            senderId,
            text,
            createdAt: serverTimestamp(),
        });

        // Update the last message on the parent chat document
        await updateDoc(chatDocRef, {
            lastMessage: text,
            lastMessageTimestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw new Error("Failed to send message.");
    }
}
