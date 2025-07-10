import Image from "next/image";
import Link from "next/link";
import { ArrowUp, MessageCircle, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CommentSection from "@/components/projects/comment-section";

const project = {
  id: '1',
  title: 'Project Phoenix',
  description: 'A journey of rebuilding a legacy system from scratch. Full of unexpected turns and valuable lessons in team collaboration.',
  author: {
    name: 'Alex Doe',
    avatarUrl: 'https://placehold.co/40x40.png',
    username: 'alexdoe',
  },
  imageUrl: 'https://placehold.co/1200x600.png',
  dataAiHint: 'abstract tech',
  tags: ['React', 'Node.js', 'Refactoring', 'TypeScript', 'GraphQL'],
  upvotes: 128,
  comments: 23,
  createdAt: '2023-10-26',
  story: `
<p>The decision to rebuild our legacy system, codenamed 'Phoenix', was not one we took lightly. The old system, a monolith of tangled PHP, had served us for nearly a decade. It was the heart of our business, but it was also a source of constant pain. Deployments were a nightmare, onboarding new developers took months, and every new feature felt like performing open-heart surgery.</p>

<p>Our journey began with a small, dedicated team. We chose a modern stack: React with TypeScript for the frontend, and a Node.js backend with a GraphQL API. The initial excitement was palpable. We were building something new, something clean. We were architects, not archaeologists.</p>

<h3 class="text-xl font-semibold my-4">The First Major Hurdle</h3>

<p>The first major challenge came when we tried to migrate the user data. The old database schema was a labyrinth of inconsistencies. We spent weeks writing and rewriting migration scripts, each time uncovering a new edge case. It was a grueling process that tested our patience and our resolve. There were moments we considered giving up, but the thought of returning to the old ways pushed us forward.</p>

<h3 class="text-xl font-semibold my-4">A Pivotal Moment</h3>

<p>A pivotal moment was our first internal demo. We showcased a single, complete user flow working on the new system. The feedback was overwhelmingly positive. For the first time, the wider company could see the tangible benefits of our work. That demo was a huge morale booster and secured the buy-in we needed to see the project through to completion.</p>

<h3 class="text-xl font-semibold my-4">Lessons Learned</h3>

<p>Looking back, the biggest lesson was the importance of incremental progress and constant communication. We learned to break down massive tasks into manageable chunks and to celebrate the small wins. We also learned that a 'perfect' system is a myth; the goal is to build something that is resilient, maintainable, and can evolve with the business.</p>

<p>Project Phoenix was more than a technical project; it was a cultural one. It changed how we think about software, collaboration, and the courage to start over.</p>
`
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  // In a real app, you'd fetch the project data based on the slug
  // const project = await fetchProjectBySlug(params.slug)

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <article>
        <header className="mb-8">
          <div className="relative mb-6 h-64 md:h-96 w-full overflow-hidden rounded-lg shadow-lg">
            <Image src={project.imageUrl} alt={project.title} fill className="object-cover" data-ai-hint={project.dataAiHint} />
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
        
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12" dangerouslySetInnerHTML={{ __html: project.story }} />
        
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
