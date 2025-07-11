
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
    Timestamp
} from "firebase/firestore";
import { User, getAllUsers } from "./stories";

// Define TypeScript interfaces for our chat data
export interface Chat {
    id: string;
    participantIds: string[];
    participants: User[]; // We'll populate this with user data
    lastMessage?: string;
    lastMessageTimestamp?: any;
}

export interface Message {
    id: string;
    text: string;
    senderId: string;
    createdAt: string;
}

// Function to create a new chat between two users
export async function createChat(user1Id: string, user2Id: string): Promise<string> {
    const chatCollection = collection(db, 'chats');
    
    // To prevent duplicate chats, create a consistent ID from the two user IDs
    const sortedIds = [user1Id, user2Id].sort();
    const existingChatQuery = query(
      chatCollection, 
      where('participantIds', '==', sortedIds)
    );

    const querySnapshot = await getDocs(existingChatQuery);

    if (!querySnapshot.empty) {
        // Chat already exists
        return querySnapshot.docs[0].id;
    }

    // If no chat exists, create a new one
    const newChatRef = await addDoc(chatCollection, {
        participantIds: sortedIds,
        lastMessage: "Chat created",
        lastMessageTimestamp: Timestamp.now(), // Use Timestamp.now() for consistency
    });

    return newChatRef.id;
}


// Function to get all chats for a specific user (Not used on the main messages page, but good for reference)
export async function getChatsForUser(userId: string): Promise<Chat[]> {
    const chatCollection = collection(db, 'chats');
    const q = query(chatCollection, where('participantIds', 'array-contains', userId), orderBy('lastMessageTimestamp', 'desc'));

    const querySnapshot = await getDocs(q);
    const chats: Chat[] = [];

    // Fetch all users once to avoid multiple lookups in the loop
    const allUsers = await getAllUsers();
    const userMap = new Map(allUsers.map(u => [u.id, u]));

    for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Populate participant details from the user map
        const participants: User[] = (data.participantIds || [])
            .map((pId: string) => userMap.get(pId))
            .filter((user: User | undefined): user is User => user !== undefined);

        chats.push({
            id: doc.id,
            participantIds: data.participantIds || [],
            participants: participants,
            lastMessage: data.lastMessage,
            lastMessageTimestamp: (data.lastMessageTimestamp as Timestamp)?.toDate().toISOString(),
        });
    }

    return chats;
}

// Function to send a message to a chat
export async function sendMessage(chatId: string, senderId: string, text: string) {
    if (!chatId || !senderId || !text) {
        throw new Error("Missing required parameters for sending a message.");
    }
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    await addDoc(messagesCollection, {
        senderId,
        text,
        createdAt: serverTimestamp(),
    });

    // Update the last message on the chat document
    const chatDocRef = doc(db, 'chats', chatId);
    await updateDoc(chatDocRef, {
        lastMessage: text,
        lastMessageTimestamp: Timestamp.now(), // Use Timestamp.now() for consistency
    });
}
