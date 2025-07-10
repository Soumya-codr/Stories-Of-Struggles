import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Search, Send } from "lucide-react"

// This page remains with dummy data for now, as messaging functionality is complex to implement.
const contacts = [
  { name: "Alex Doe", lastMessage: "Let's sync up tomorrow.", time: "10:42 AM", avatar: "https://placehold.co/40x40.png", active: true },
  { name: "Jane Smith", lastMessage: "Can you review my PR?", time: "9:15 AM", avatar: "https://placehold.co/40x40.png" },
];

const messages = [
    { sender: "Alex Doe", text: "Hey! Just read your new story on Project Phoenix. Really inspiring stuff.", time: "10:30 AM", isOwn: false, avatar: "https://placehold.co/40x40.png" },
    { sender: "You", text: "Thanks, Alex! Appreciate you reading it.", time: "10:31 AM", isOwn: true, avatar: "https://placehold.co/40x40.png" },
];

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
              {contacts.map((contact, index) => (
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
              ))}
            </div>
          </ScrollArea>
        </div>
        <div className="flex flex-col">
            <div className="p-4 border-b flex items-center gap-4">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://placehold.co/40x40.png" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-semibold">Alex Doe</h3>
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
        </div>
      </div>
    </div>
  )
}
