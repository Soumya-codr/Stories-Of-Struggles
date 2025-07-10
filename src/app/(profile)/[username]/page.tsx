import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProjectCard from "@/components/projects/project-card";
import { Mail, Link as LinkIcon } from "lucide-react";

const user = {
  name: 'Alex Doe',
  username: 'alexdoe',
  avatarUrl: 'https://placehold.co/128x128.png',
  bio: 'Senior Software Engineer, passionate about open source, clean code, and building communities. Currently working on Project Phoenix.',
  website: 'https://example.com',
  followers: 482,
  following: 120,
};

const userProjects = [
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
  // const user = await fetchUser(params.username)
  // const userProjects = await fetchUserProjects(params.username)

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8 overflow-hidden">
        <div className="h-32 bg-muted" data-ai-hint="abstract background"></div>
        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 -mt-16">
          <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background ring-2 ring-primary">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center md:text-left flex-1 mt-12 md:mt-16">
            <div className="md:flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">@{user.username}</p>
                <p className="mt-2 max-w-prose">{user.bio}</p>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4 flex-shrink-0">
                  <Button>Follow</Button>
                  <Button variant="outline"><Mail className="mr-2 h-4 w-4" /> Message</Button>
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {userProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  )
}
