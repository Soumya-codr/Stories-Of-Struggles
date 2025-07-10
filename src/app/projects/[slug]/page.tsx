import Image from "next/image";
import Link from "next/link";
import { ArrowUp, MessageCircle, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/projects/comment-section";
import { getStoryById } from "@/services/stories";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getStoryById(params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <article>
        <header className="mb-8">
          <div className="relative mb-6 h-64 md:h-96 w-full overflow-hidden rounded-lg shadow-lg">
            <Image src={project.imageUrl || 'https://placehold.co/1200x600.png'} alt={project.title} fill className="object-cover" data-ai-hint={project.dataAiHint || 'abstract tech'} />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">{project.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
             <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={project.author.avatarUrl} alt={project.author.name} />
                  <AvatarFallback>{project.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <Link href={`/${project.author.username}`} className="font-medium text-foreground hover:underline">{project.author.name}</Link>
             </div>
             <Separator orientation="vertical" className="h-4" />
             <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
             </div>
          </div>
        </header>
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: project.story.replace(/\n/g, '<br />') }} />
        
        <div className="flex items-center gap-4 border-t border-b py-4">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowUp className="h-5 w-5" />
            <span>Upvote ({project.upvotes})</span>
          </Button>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageCircle className="h-5 w-5" />
            <span>{project.comments} Comments</span>
          </div>
        </div>
      </article>

      <Separator className="my-12" />

      <CommentSection />
    </div>
  )
}
