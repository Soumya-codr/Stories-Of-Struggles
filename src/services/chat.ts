'use server';

import { db } from "@/lib/firebase";
import { 
    collection, 
    addDoc, 
    serverTimestamp, 
    getDocs, 
    doc, 
    getDoc, 
    query, 
    where,
    orderBy,
    onSnapshot,
    updateDoc,
    limit,
    Timestamp,
} from "firebase/firestore";
import { User, getUserByUsername } from "./stories";

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

    for (const doc of querySnapshot.docs) {
        const data = doc.data();
        
        // Fetch participant details
        const participants: User[] = [];
        for (const pId of data.participantIds) {
            // NOTE: In a real app with a 'users' collection, you'd fetch by ID.
            // Here, we find them in our dummy user list.
            const allUsers = await require('./stories').getAllUsers();
            const user = allUsers.find((u: User) => u.id === pId);
            if (user) {
                participants.push(user);
            }
        }

        chats.push({
            id: doc.id,
            participantIds: data.participantIds,
            participants: participants,
            lastMessage: data.lastMessage,
            lastMessageTimestamp: data.lastMessageTimestamp?.toDate().toISOString(),
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

// Function to get messages for a chat with a real-time listener
export function getMessagesForChat(chatId: string, callback: (messages: Message[]) => void) {
    const messagesCollection = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesCollection, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const messages = querySnapshot.docs.map(doc => ({
            id: doc.id,
            text: doc.data().text,
            senderId: doc.data().senderId,
            createdAt: (doc.data().createdAt as Timestamp)?.toDate().toISOString() || new Date().toISOString(),
        }));
        callback(messages);
    });

    return unsubscribe; // Return the unsubscribe function to be called on cleanup
}
