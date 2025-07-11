
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
import { getUsersForChats, type Chat } from "@/services/chat";
import type { User } from "@/services/stories";
import type { ChatWithParticipants, Message } from "@/services/chat";

/**
 * Sets up a real-time listener for all chats for a given user.
 * Populates participant details for each chat.
 */
export function streamChatsForUser(userId: string, callback: (chats: ChatWithParticipants[]) => void): () => void {
    const chatCollection = collection(db, 'chats');
    // Simplify the query to remove the orderBy clause that requires a composite index.
    // We will sort manually after fetching.
    const q = query(
        chatCollection, 
        where('participantIds', 'array-contains', userId)
    );

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
        const chats = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
        
        // Fetch all necessary user profiles in a single, client-safe batch
        const userMap = await getUsersForChats(chats);

        const chatsWithParticipants: ChatWithParticipants[] = chats.map(chat => {
            const participants = chat.participantIds
                .map(id => userMap.get(id))
                .filter((user): user is User => !!user);
            
            return {
                ...chat,
                participants,
            } as ChatWithParticipants;
        });

        // Manually sort the chats by timestamp, newest first.
        chatsWithParticipants.sort((a, b) => {
            const timeA = a.lastMessageTimestamp?.toMillis() || 0;
            const timeB = b.lastMessageTimestamp?.toMillis() || 0;
            return timeB - timeA;
        });

        callback(chatsWithParticipants);

    }, (error) => {
        console.error("Error listening to chats:", error);
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
