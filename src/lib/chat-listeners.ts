
'use client';

import { db } from "@/lib/firebase";
import { 
    collection, 
    query, 
    where,
    orderBy,
    onSnapshot,
    Timestamp,
} from "firebase/firestore";
import { getAllUsers, type User } from "@/services/stories";
import type { ChatWithParticipants, Message } from "@/services/chat";

/**
 * Sets up a real-time listener for all chats for a given user.
 * Populates participant details for each chat.
 */
export function streamChatsForUser(userId: string, callback: (chats: ChatWithParticipants[]) => void): () => void {
    const chatCollection = collection(db, 'chats');
    // NOTE: This query requires a composite index in Firestore.
    // The error message in the browser console will provide a direct link to create it.
    // The index should be: `participantIds` (array-contains) and `lastMessageTimestamp` (descending).
    const q = query(
        chatCollection, 
        where('participantIds', 'array-contains', userId), 
        orderBy('lastMessageTimestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        // Fetch all users once to avoid multiple reads inside the loop
        const allUsers = await getAllUsers();
        const userMap = new Map(allUsers.map(u => [u.id, u]));

        const chatsData: ChatWithParticipants[] = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const participantIds = data.participantIds || [];

            const participants = participantIds
                .map((pId: string) => userMap.get(pId))
                .filter((user: User | undefined): user is User => !!user);
            
            return {
                id: doc.id,
                participantIds,
                participants,
                lastMessage: data.lastMessage,
                lastMessageTimestamp: data.lastMessageTimestamp,
            } as ChatWithParticipants;
        });

        callback(chatsData);
    }, (error) => {
        console.error("Error listening to chats:", error);
        // If there's an error (e.g., missing index), you can handle it here.
        // The most common error is a "failed-precondition" which means the index is missing.
    });

    return unsubscribe; // Return the unsubscribe function
}


/**
 * Sets up a real-time listener for messages within a specific chat.
 */
export function streamMessagesForChat(chatId: string, callback: (messages: Message[]) => void): () => void {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                text: data.text,
                senderId: data.senderId,
                // Safely convert timestamp to ISO string for client-side use
                createdAt: (data.createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
            };
        });
        callback(messages);
    }, (error) => {
        console.error(`Error listening to messages for chat ${chatId}:`, error);
    });

    return unsubscribe; // Return the unsubscribe function
}
