
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "@/components/projects/project-card";
import { Mail, Link as LinkIcon, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getStoriesByUsername, getUserByUsername, User, Story } from "@/services/stories";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage({ params }: { params: { username: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProjects, setUserProjects] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const { username } = params;

  useEffect(() => {
    async function fetchData() {
      if (!username) return;
      try {
        setLoading(true);
        const [fetchedUser, fetchedProjects] = await Promise.all([
          getUserByUsername(username),
          getStoriesByUsername(username),
        ]);

        if (!fetchedUser) {
          notFound();
          return;
        }
        setUser(fetchedUser);
        setUserProjects(fetchedProjects);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        // Optionally handle error state here
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [username]);


  if (loading) {
     return (
        <div className="container mx-auto py-8">
          <Card className="mb-8 overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 -mt-24">
              <Skeleton className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-background" />
              <div className="text-center md:text-left flex-1 mt-16 md:mt-20">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-4" />
                <Skeleton className="h-4 w-full max-w-lg" />
              </div>
            </CardContent>
          </Card>
          <div>
            <Skeleton className="h-8 w-64 mb-4" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
        </div>
      );
  }

  if (!user) {
    // This will be caught by notFound() in useEffect, but as a fallback
    return notFound();
  }

  const isCurrentUser = user.username === currentUser?.username;

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-48 bg-muted bg-cover bg-center" style={{backgroundImage: 'url(https://placehold.co/1200x300.png)'}} data-ai-hint="abstract background"></div>
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 -mt-24">
          <Avatar className="w-28 h-28 md:w-36 md:h-36 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1 mt-16 md:mt-20">
            <div className="md:flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="mt-2 max-w-prose">{user.bio}</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 flex-shrink-0">
                  {isCurrentUser ? (
                      <Button asChild><Link href="/settings"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Link></Button>
                  ) : (
                    <>
                      <Button>Follow</Button>
                      <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Message</Button>
                    </>
                  )}
                  {user.website && (
                    <Button variant="ghost" size="icon" asChild>
                      <a href={user.website} target="_blank" rel="noopener noreferrer">
                          <LinkIcon className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
              <div className="flex items-center gap-1">
                <span className="font-bold">{user.followers}</span>
                <span className="text-muted-foreground">Followers</span>
              </div>
               <div className="flex items-center gap-1">
                <span className="font-bold">{user.following}</span>
                <span className="text-muted-foreground">Following</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="text-2xl font-bold mb-4">Stories by {user.name}</h2>
        {userProjects.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {userProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold">No Stories Yet</h3>
              <p className="text-muted-foreground mt-2">
                {isCurrentUser ? "You haven't shared any stories. Why not share your first?" : `${user.name} hasn't shared any stories yet.`}
              </p>
              {isCurrentUser && (
                <Button asChild className="mt-4">
                  <Link href="/new-story">Share a Story</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
