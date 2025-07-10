import ProjectCard from '@/components/projects/project-card'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const projects = [
  {
    id: '1',
    title: 'Project Phoenix',
    description: 'A journey of rebuilding a legacy system from scratch. Full of unexpected turns and valuable lessons in team collaboration.',
    author: {
      name: 'Alex Doe',
      avatarUrl: 'https://placehold.co/40x40.png',
      username: 'alexdoe',
    },
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['React', 'Node.js', 'Refactoring'],
    upvotes: 128,
    comments: 23,
    dataAiHint: 'abstract tech'
  },
  {
    id: '2',
    title: 'Indie Game Dev Saga',
    description: 'The story of a solo developer trying to launch their first indie game. A tale of passion, burnout, and eventual success.',
    author: {
      name: 'Jane Smith',
      avatarUrl: 'https://placehold.co/40x40.png',
      username: 'janesmith',
    },
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['GameDev', 'Unity', 'SoloDev'],
    upvotes: 450,
    comments: 89,
    dataAiHint: 'gaming setup'
  },
  {
    id: '3',
    title: 'Open Source Struggle',
    description: 'Maintaining a popular open-source library is not as glamorous as it seems. Here\'s what it really takes.',
    author: {
      name: 'OSS Collective',
      avatarUrl: 'https://placehold.co/40x40.png',
      username: 'osscollective',
    },
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['OpenSource', 'Community', 'JavaScript'],
    upvotes: 1024,
    comments: 156,
    dataAiHint: 'code screen'
  },
  {
    id: '4',
    title: 'AI for Good',
    description: 'How our team built an AI to help non-profits. The technical challenges were immense, but the impact was worth it.',
    author: {
      name: 'Maria Garcia',
      avatarUrl: 'https://placehold.co/40x40.png',
      username: 'mariagarcia',
    },
    imageUrl: 'https://placehold.co/600x400.png',
    tags: ['AI', 'Python', 'SocialImpact'],
    upvotes: 732,
    comments: 99,
    dataAiHint: 'futuristic AI'
  },
];

export default function Home() {
  return (
    <div className="container mx-auto">
       <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Project Stories</h1>
        <Button asChild>
          <Link href="/new-story">Share Your Story</Link>
        </Button>
      </div>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  )
}
