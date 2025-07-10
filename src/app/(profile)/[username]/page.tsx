import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "@/components/projects/project-card";
import { Mail, Link as LinkIcon, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data - in a real app, this would come from a database
const users = [
    {
      name: 'Alex Doe',
      username: 'alexdoe',
      avatarUrl: 'https://placehold.co/128x128.png',
      bio: 'Senior Software Engineer, passionate about open source, clean code, and building communities. Currently working on Project Phoenix.',
      website: 'https://example.com',
      followers: 482,
      following: 120,
      isCurrentUser: false,
    },
    {
      name: 'Developer',
      username: 'developer',
      avatarUrl: 'https://placehold.co/128x128.png',
      bio: 'This is your profile! Share your story, showcase your projects, and connect with other developers.',
      website: 'https://example.com',
      followers: 10,
      following: 25,
      isCurrentUser: true,
    }
];

const allProjects = [
  {
    id: '1',
    title: 'Project Phoenix',
    description: 'A journey of rebuilding a legacy system from scratch. Full of unexpected turns and valuable lessons in team collaboration.',
    author: { name: 'Alex Doe', avatarUrl: 'https://placehold.co/40x40.png', username: 'alexdoe' },
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'abstract tech',
    tags: ['React', 'Node.js', 'Refactoring'],
    upvotes: 128,
    comments: 23,
  },
   {
    id: '5',
    title: 'Component Library',
    description: 'The story behind building our internal component library. A deep dive into design systems and developer experience.',
    author: { name: 'Alex Doe', avatarUrl: 'https://placehold.co/40x40.png', username: 'alexdoe' },
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'design system',
    tags: ['React', 'DesignSystem', 'DX'],
    upvotes: 98,
    comments: 15,
  },
];


export default function ProfilePage({ params }: { params: { username: string } }) {
  const user = users.find(u => u.username === params.username);
  const userProjects = allProjects.filter(p => p.author.username === params.username);

  if (!user) {
    notFound();
  }

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
                  {user.isCurrentUser ? (
                      <Button asChild><Link href="/settings"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Link></Button>
                  ) : (
                    <>
                      <Button>Follow</Button>
                      <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Message</Button>
                    </>
                  )}
                  <Button variant="ghost" size="icon" asChild>
                    <a href={user.website} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-5 w-5" />
                    </a>
                  </Button>
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
                {user.isCurrentUser ? "You haven't shared any stories. Why not share your first?" : `${user.name} hasn't shared any stories yet.`}
              </p>
              {user.isCurrentUser && (
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
