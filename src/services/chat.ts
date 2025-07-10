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
    
    // Check if a chat between these two users already exists
    const q = query(chatCollection, where('participantIds', 'array-contains', user1Id));
    const querySnapshot = await getDocs(q);
    const existingChat = querySnapshot.docs.find(d => d.data().participantIds.includes(user2Id));

    if (existingChat) {
        return existingChat.id;
    }

    // If no chat exists, create a new one
    const newChatRef = await addDoc(chatCollection, {
        participantIds: [user1Id, user2Id],
        lastMessage: "Chat created",
        lastMessageTimestamp: serverTimestamp(),
    });

    return newChatRef.id;
}


// Function to get all chats for a specific user
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
        const participants: User[] = data.participantIds
            .map((pId: string) => userMap.get(pId))
            .filter((user: User | undefined): user is User => user !== undefined);

        chats.push({
            id: doc.id,
            participantIds: data.participantIds,
            participants: participants,
            lastMessage: data.lastMessage,
            lastMessageTimestamp: (data.lastMessageTimestamp as Timestamp)?.toDate().toISOString(),
        });
    }

    return chats;
}

// Function to send a message to a chat
export async function sendMessage(chatId: string, senderId: string, text: string) {
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
        lastMessageTimestamp: serverTimestamp(),
    });
}
