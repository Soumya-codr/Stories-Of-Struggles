
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { MessageSquare, PlusCircle, Send } from "lucide-react"
import { useEffect, useState, useRef } from "react";
import type { User } from "@/services/stories";
import { getCurrentUser } from "@/services/stories";
import type { ChatWithParticipants, Message } from "@/services/chat";
import { sendMessage } from "@/services/chat";
import { streamChatsForUser, streamMessagesForChat } from "@/lib/chat-listeners";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [chats, setChats] = useState<ChatWithParticipants[]>([]);
  const [activeChat, setActiveChat] = useState<ChatWithParticipants | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // 1. Fetch current user
  useEffect(() => {
    getCurrentUser().then(setCurrentUser);
  }, []);

  // 2. Set up real-time listener for user's chats
  useEffect(() => {
    if (currentUser?.id) {
      // The stream function returns an unsubscribe function
      const unsubscribe = streamChatsForUser(currentUser.id, setChats);
      // Cleanup on component unmount
      return () => unsubscribe();
    }
  }, [currentUser]);

  // 3. Set up real-time listener for messages in the active chat
  useEffect(() => {
    if (activeChat?.id) {
      // The stream function returns an unsubscribe function
      const unsubscribe = streamMessagesForChat(activeChat.id, setMessages);
      // Cleanup on component unmount or when activeChat changes
      return () => unsubscribe();
    } else {
      setMessages([]); // Clear messages when no chat is active
    }
  }, [activeChat]);

  // 4. Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !currentUser || !activeChat || isSending) return;

    setIsSending(true);
    try {
        await sendMessage(activeChat.id, currentUser.id, newMessage);
        setNewMessage("");
    } catch (error) {
        console.error("Failed to send message:", error);
        toast({
            title: "Error",
            description: "Failed to send message. Please try again.",
            variant: "destructive"
        });
    } finally {
        setIsSending(false);
    }
  };
  
  const getOtherParticipant = (chat: ChatWithParticipants) => {
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
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {chats.length > 0 ? (
                chats.map((chat) => {
                  const otherUser = getOtherParticipant(chat);
                  if (!otherUser) return null; // Don't render chat if other user is not found

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
                          <AvatarImage src={otherUser.avatarUrl} alt={otherUser.name} />
                          <AvatarFallback>{otherUser.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                          <p className="font-semibold truncate">{otherUser.name}</p>
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
              <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                      {messages.map((msg) => {
                          const isOwn = msg.senderId === currentUser.id;
                          const sender = isOwn ? currentUser : getOtherParticipant(activeChat);
                          return (
                            <div key={msg.id} className={cn("flex gap-2 items-end", isOwn && "justify-end")}>
                              {!isOwn && sender && <Avatar className="h-8 w-8"><AvatarImage src={sender.avatarUrl} /><AvatarFallback>{sender.name.charAt(0)}</AvatarFallback></Avatar>}
                                <div className={cn("max-w-xs rounded-lg p-3 text-sm", isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                  <p>{msg.text}</p>
                                  <p className="text-xs text-right mt-1 opacity-70">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                              {isOwn && <Avatar className="h-8 w-8"><AvatarImage src={sender?.avatarUrl} /><AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback></Avatar>}
                            </div>
                          )
                      })}
                      <div ref={messagesEndRef} />
                  </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/50">
                  <form onSubmit={handleSendMessage} className="relative">
                      <Input 
                        placeholder="Type a message..." 
                        className="pr-12" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        disabled={isSending}
                      />
                      <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8" disabled={isSending}>
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
                <p className="text-muted-foreground mt-2">Select a conversation from the list or start a new one.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
