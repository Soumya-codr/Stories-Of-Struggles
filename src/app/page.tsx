import ProjectCard from '@/components/projects/project-card'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { getStories } from '@/services/stories';
import { Card, CardContent } from '@/components/ui/card';

export default async function Home() {
  const projects = await getStories();

  return (
    <div className="container mx-auto">
       <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Project Stories</h1>
        <Button asChild>
          <Link href="/new-story">Share Your Story</Link>
        </Button>
      </div>
      {projects.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
         <Card className="text-center py-12">
            <CardContent>
              <h3 className="text-xl font-semibold">No Stories Yet</h3>
              <p className="text-muted-foreground mt-2">
                Be the first to share your story!
              </p>
              <Button asChild className="mt-4">
                  <Link href="/new-story">Share a Story</Link>
              </Button>
            </CardContent>
          </Card>
      )}
    </div>
  )
}
