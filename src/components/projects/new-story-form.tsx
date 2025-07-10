
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Separator } from "../ui/separator"
import { Upload } from "lucide-react"
import { createStory } from "@/services/stories"
import { useState } from "react"
import { useRouter } from "next/navigation"

const newStoryFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(300, { message: "Description must be less than 300 characters."}),
  story: z.string().min(100, {
    message: "Your story must be at least 100 characters long.",
  }),
  tags: z.string().optional(),
  projectUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  sourceCodeUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  imageUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
  videoUrl: z.string().url({ message: "Please enter a valid video URL." }).optional().or(z.literal('')),
  behindTheScenes: z.any().optional(),
})

type NewStoryFormValues = z.infer<typeof newStoryFormSchema>

export function NewStoryForm() {
  const { toast } = useToast()
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<NewStoryFormValues>({
    resolver: zodResolver(newStoryFormSchema),
    defaultValues: {
        title: "",
        description: "",
        story: "",
        tags: "",
        projectUrl: "",
        sourceCodeUrl: "",
        imageUrl: "",
        videoUrl: "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: NewStoryFormValues) {
    setIsSubmitting(true);
    try {
        // TODO: Handle image uploads properly. For now, we are ignoring them.
        const result = await createStory(data);

        if (result.success) {
            toast({
                title: "Story Published!",
                description: "Your project story is now live for the community to see.",
            });
            form.reset();
            // Redirect to the new story page
            router.push(`/projects/${result.id}`);
        } else {
            throw new Error(result.error || "An unknown error occurred.");
        }
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to publish your story. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <Separator className="my-8" />
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Rebuilding a Legacy System" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                A catchy title for your project story.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief one or two-sentence summary of your story."
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
               <FormDescription>
                This will be shown on the story card.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="story"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Full Story</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us everything... the highs, the lows, the 'aha!' moments."
                  className="min-h-64"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                You can use Markdown for formatting. HTML is also supported.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid md:grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="projectUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://my-project.com" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Link to the live project (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceCodeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source Code URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/user/repo" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormDescription>
                    Link to the source code repository (optional).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </div>
         <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Image URL</FormLabel>
              <FormControl>
                <Input placeholder="https://placehold.co/600x400.png" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                A URL for the story's cover image (optional).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={form.control}
            name="videoUrl"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Video URL</FormLabel>
                    <FormControl>
                        <Input placeholder="https://youtube.com/watch?v=..." {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormDescription>
                        A link to a video about your project (YouTube, Vimeo, etc.).
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="behindTheScenes"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Behind-the-Scenes Images</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type="file"
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => field.onChange(e.target.files)}
                                disabled={isSubmitting}
                            />
                            <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg border-muted hover:bg-muted/50 transition-colors">
                                <div className="text-center">
                                    <Upload className="w-8 h-8 mx-auto text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">Click or drag to upload images</p>
                                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                    </FormControl>
                    <FormDescription>
                        Share some screenshots, mockups, or photos from your journey.
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, Node.js, Burnout" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                Comma-separated tags to help people find your story.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Publishing...' : 'Publish Story'}
        </Button>
      </form>
    </Form>
  )
}
