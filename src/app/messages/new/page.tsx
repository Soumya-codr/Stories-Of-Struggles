
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getAllUsers, User, getCurrentUser } from '@/services/stories';
import { createChat } from '@/services/chat';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function NewMessagePage() {
    const [users, setUsers] = useState<User[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        async function loadData() {
            const [allUsers, cUser] = await Promise.all([
                getAllUsers(),
                getCurrentUser()
            ]);
            setCurrentUser(cUser);
            // Filter out the current user from the list
            if (cUser) {
              setUsers(allUsers.filter(user => user.id !== cUser.id));
            }
        }
        loadData();
    }, []);

    const handleCreateChat = async (userId: string) => {
        if (!currentUser || isCreating) return;
        setIsCreating(true);
        try {
            await createChat(currentUser.id, userId);
            toast({
                title: "Chat created!",
                description: "You can now start your conversation.",
            });
            router.push('/messages');
        } catch (error) {
            console.error("Error creating chat:", error);
            toast({
                title: 'Error',
                description: 'Could not create chat. Please try again.',
                variant: 'destructive',
            });
            setIsCreating(false);
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto max-w-2xl py-8">
            <Card>
                <CardHeader>
                    <CardTitle>Start a New Conversation</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative mb-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search for a user..."
                            className="pl-8"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <ScrollArea className="h-[60vh]">
                        <div className="space-y-4">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted">
                                    <div className="flex items-center gap-4">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleCreateChat(user.id)} disabled={isCreating}>
                                      {isCreating ? 'Starting...' : 'Message'}
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );
}
