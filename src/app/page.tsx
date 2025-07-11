
'use client';

import { useState, useEffect, useMemo } from 'react';
import ProjectCard from '@/components/projects/project-card'
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import { getStories } from '@/services/stories';
import { Card, CardContent } from '@/components/ui/card';
import type { Story } from '@/services/stories';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function Home() {
  const [projects, setProjects] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    async function loadStories() {
      setLoading(true);
      const fetchedProjects = await getStories();
      setProjects(fetchedProjects);
      setLoading(false);
    }
    loadStories();
  }, []);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    projects.forEach(project => {
      project.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!selectedTag) {
      return projects;
    }
    return projects.filter(project => project.tags.includes(selectedTag));
  }, [projects, selectedTag]);

  return (
    <div className="container mx-auto">
       <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Project Stories</h1>
        <Button asChild>
          <Link href="/new-story">Share Your Story</Link>
        </Button>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-2">
        <Button
          variant={selectedTag === null ? 'default' : 'outline'}
          onClick={() => setSelectedTag(null)}
          size="sm"
        >
          All Stories
        </Button>
        {uniqueTags.map(tag => (
          <Button
            key={tag}
            variant={selectedTag === tag ? 'default' : 'outline'}
            onClick={() => setSelectedTag(tag)}
            size="sm"
          >
            {tag}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
         <Card className="text-center py-12 md:col-span-3">
            <CardContent>
              <h3 className="text-xl font-semibold">No Stories Found</h3>
              <p className="text-muted-foreground mt-2">
                {selectedTag ? `There are no stories with the tag "${selectedTag}".` : "Be the first to share your story!"}
              </p>
              {!selectedTag && (
                <Button asChild className="mt-4">
                    <Link href="/new-story">Share a Story</Link>
                </Button>
              )}
            </CardContent>
          </Card>
      )}
    </div>
  )
}
