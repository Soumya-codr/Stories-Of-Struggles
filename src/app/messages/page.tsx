'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, Send, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Messaging functionality is not implemented in this version.
// The UI is a placeholder.
const contacts: any[] = [];
const messages: any[] = [];
const activeContact = null;

export default function MessagesPage() {
  return (
    <div className="h-[calc(100vh-8rem)] bg-background rounded-lg border">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] h-full">
        <div className="flex flex-col border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Chats</h2>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search messages..." className="pl-8" />
            </div>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <button
                    key={index}
                    className={cn(
                      "w-full flex items-start gap-3 rounded-lg p-2 text-left text-sm transition-all hover:bg-accent",
                      contact.active && "bg-accent"
                    )}
                  >
                      <Avatar className="h-10 w-10">
                          <AvatarImage src={contact.avatar} alt={contact.name} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 overflow-hidden">
                          <div className="flex items-center justify-between">
                              <p className="font-semibold truncate">{contact.name}</p>
                              <p className="text-xs text-muted-foreground flex-shrink-0">{contact.time}</p>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{contact.lastMessage}</p>
                      </div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No conversations yet.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col">
          {activeContact ? (
            <>
              <div className="p-4 border-b flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                      <AvatarImage src={activeContact.avatar} />
                      <AvatarFallback>{activeContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold">{activeContact.name}</h3>
              </div>
              <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                      {messages.map((msg, index) => (
                          <div key={index} className={cn("flex gap-2 items-end", msg.isOwn && "justify-end")}>
                            {!msg.isOwn && <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback></Avatar>}
                              <div className={cn("max-w-xs rounded-lg p-3 text-sm", msg.isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                                <p>{msg.text}</p>
                                <p className="text-xs text-right mt-1 opacity-70">{msg.time}</p>
                              </div>
                            {msg.isOwn && <Avatar className="h-8 w-8"><AvatarImage src={msg.avatar} /><AvatarFallback>U</AvatarFallback></Avatar>}
                          </div>
                      ))}
                  </div>
              </ScrollArea>
              <div className="p-4 border-t bg-muted/50">
                  <div className="relative">
                      <Input placeholder="Type a message..." className="pr-12" />
                      <Button type="submit" size="icon" className="absolute right-1 top-1 h-8 w-8">
                          <Send className="h-4 w-4" />
                          <span className="sr-only">Send</span>
                      </Button>
                  </div>
              </div>
            </>
          ) : (
             <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                <MessageSquare className="h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">No Chat Selected</h3>
                <p className="text-muted-foreground mt-2">Select a conversation from the list to start chatting.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  )
}
