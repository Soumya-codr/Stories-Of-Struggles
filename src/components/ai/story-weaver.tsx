'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { generateProjectStory } from '@/ai/flows/generate-project-story'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  projectName: z.string().min(2, 'Project name is required.'),
  projectType: z.string().min(1, 'Please select a project type.'),
  userRole: z.string().min(1, 'Please select your role.'),
  keyChallenge: z.string().min(10, 'Please describe the challenge in at least 10 characters.'),
  keySolution: z.string().min(10, 'Please describe the solution in at least 10 characters.'),
  targetAudience: z.string().min(1, 'Please select a target audience.'),
})

export default function StoryWeaver() {
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectName: '',
      projectType: '',
      userRole: '',
      keyChallenge: '',
      keySolution: '',
      targetAudience: 'other-developers',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setStory('')
    try {
      const result = await generateProjectStory(values)
      setStory(result.story)
    } catch (error) {
      console.error('Error generating story:', error)
      toast({
        title: 'Error',
        description: 'Failed to generate a story. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="projectName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Phoenix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Type</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="web-app">Web App</SelectItem>
                      <SelectItem value="mobile-app">Mobile App</SelectItem>
                      <SelectItem value="library-or-tool">Library/Tool</SelectItem>
                      <SelectItem value="game">Game</SelectItem>
                      <SelectItem value="open-source-project">Open Source Project</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
           <FormField
              control={form.control}
              name="keyChallenge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Biggest Challenge</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What was the toughest problem you solved? e.g., 'Migrating a massive, tangled database without any downtime.'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keySolution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breakthrough Solution</FormLabel>
                  <FormControl>
                    <Textarea placeholder="What was the 'aha!' moment or the clever fix? e.g., 'We built a custom proxy to reroute traffic on-the-fly while syncing data in the background.'" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <div className="grid md:grid-cols-2 gap-4">
               <FormField
                  control={form.control}
                  name="userRole"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Role</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="the-solo-developer">Solo Developer</SelectItem>
                          <SelectItem value="a-member-of-the-team">Team Member</SelectItem>
                          <SelectItem value="the-team-lead">Team Lead</SelectItem>
                           <SelectItem value="the-founder">Founder</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Audience</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an audience" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="other-developers">Other Developers</SelectItem>
                          <SelectItem value="potential-users">Potential Users</SelectItem>
                          <SelectItem value="investors-or-stakeholders">Investors / Stakeholders</SelectItem>
                           <SelectItem value="a-hiring-manager">A Hiring Manager</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
           </div>
          <Button type="submit" disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? 'Weaving your story...' : 'Weave Story'}
          </Button>
        </form>
      </Form>
      
      {isLoading && (
         <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
         </div>
      )}

      {story && !isLoading && (
        <Card className="mt-4 bg-background border-primary/20">
          <CardContent className="pt-6">
            <div
                className="prose prose-sm dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: story.replace(/\n/g, '<br />') }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
