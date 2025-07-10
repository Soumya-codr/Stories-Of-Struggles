import Image from 'next/image'
import Link from 'next/link'
import { ArrowUp, MessageCircle } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type Project = {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatarUrl: string;
    username: string;
  };
  imageUrl: string;
  tags: string[];
  upvotes: number;
  comments: number;
  dataAiHint?: string;
};

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/projects/${project.id}`} className="block">
        <div className="relative h-48 w-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            data-ai-hint={project.dataAiHint}
          />
        </div>
      </Link>
      <CardHeader>
        <Link href={`/projects/${project.id}`} className="block">
          <CardTitle className="hover:text-primary transition-colors">{project.title}</CardTitle>
        </Link>
        <CardDescription className="line-clamp-2 h-10">{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center bg-muted/50 py-3 px-6">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.author.avatarUrl} alt={project.author.name} />
            <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <Link href={`/${project.author.username}`} className="text-sm font-medium hover:underline">
            {project.author.name}
          </Link>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ArrowUp className="h-4 w-4" />
            {project.upvotes}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            {project.comments}
          </span>
        </div>
      </CardFooter>
    </Card>
  )
}
