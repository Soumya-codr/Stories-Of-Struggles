'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, Send, MessageSquare, PlusCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState, useRef } from "react";
import { getCurrentUser } from "@/services/stories";
import { getChatsForUser, getMessagesForChat, sendMessage, Chat, Message } from "@/services/chat";
import Link from "next/link";
import { User } from "@/services/stories";

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      const user = await getCurrentUser();
      setCurrentUser(user);
      if (user) {
        const userChats = await getChatsForUser(user.id);
        setChats(userChats);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (activeChat) {
      const unsubscribe = getMessagesForChat(activeChat.id, setMessages);
      return () => unsubscribe();
    }
  }, [activeChat]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser || !activeChat) return;

    await sendMessage(activeChat.id, currentUser.id, newMessage);
    setNewMessage("");
  };
  
  const getOtherParticipant = (chat: Chat) => {
    return chat.participants.find(p => p.id !== currentUser?.id);
  }

  return (
    <div className="h-[calc(100vh-8rem)] bg-background rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
        <div className="flex flex-col border-r">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-bold">Chats</h2>
            <Button asChild variant="ghost" size="icon">
              <Link href="/messages/new">
                <PlusCircle className="h-5 w-5" />
              </Link>
            </Button>
          </div>
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const otherUser = getOtherParticipant(chat);
                  return (
                  <button
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={cn(
                      "w-full flex items-start gap-3 rounded-lg p-2 text-left text-sm transition-all hover:bg-accent",
                      activeChat?.id === chat.id && "bg-accent"
                    )}
                  >
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={otherUser?.avatarUrl} alt={otherUser?.name} />
                          <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                              <p className="font-semibold truncate">{otherUser?.name}</p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            {chat.lastMessage ? chat.lastMessage : 'No messages yet.'}
                          </p>
                      </div>
                  </button>
                )})
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No conversations yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col">
          {activeChat && currentUser ? (
            <>
              <div className="p-4 border-b flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                      <AvatarImage src={getOtherParticipant(activeChat)?.avatarUrl} />
                      <AvatarFallback>{getOtherParticipant(activeChat)?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{getOtherParticipant(activeChat)?.name}</h3>
              </div>
              <ScrollArea className="flex-1 p-4" ref={scrollAreaRef as any}>
                  <div className="space-y-4">
                      {messages.map((msg, index) => {
                          const isOwn = msg.senderId === currentUser.id;
                          const sender = isOwn ? currentUser : getOtherParticipant(activeChat);
                          return (
                            <div key={index} className={cn("flex gap-2 items-end", isOwn && "justify-end")}>
                              {!isOwn && <Avatar className="h-8 w-8"><AvatarImage src={sender?.avatarUrl} /><AvatarFallback>{sender?.name.charAt(0)}</AvatarFallback></Avatar>}
                                <div className={cn("max-w-xs rounded-lg p-3 text-sm", isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                  <p>{msg.text}</p>
                                  <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                                </div>
                              {isOwn && <Avatar className="h-8 w-8"><AvatarImage src={sender?.avatarUrl} /><AvatarFallback>U</AvatarFallback></Avatar>}
                            </div>
                          )
                      })}
                  </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/50">
                  <form onSubmit={handleSendMessage} className="relative">
                      <Input 
                        placeholder="Type a message..." 
                        className="pr-12" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                      />
                      <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                      </Button>
                  </form>
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No Chat Selected</h3>
                <p className="text-muted-foreground mt-2">Select a conversation from the list to start chatting or start a new one.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
