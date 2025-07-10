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
})

type NewStoryFormValues = z.infer<typeof newStoryFormSchema>

export function NewStoryForm() {
  const { toast } = useToast()
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
    },
    mode: "onChange",
  })

  function onSubmit(data: NewStoryFormValues) {
    toast({
      title: "Story Submitted!",
      description: "Your project story has been submitted for review.",
    })
    console.log(data);
    form.reset();
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
                <Input placeholder="e.g., Rebuilding a Legacy System" {...field} />
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
                />
              </FormControl>
              <FormDescription>
                You can use Markdown for formatting.
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
                    <Input placeholder="https://my-project.com" {...field} />
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
                    <Input placeholder="https://github.com/user/repo" {...field} />
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
                <Input placeholder="https://placehold.co/600x400.png" {...field} />
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
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <Input placeholder="e.g., React, Node.js, Burnout" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated tags to help people find your story.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Publish Story</Button>
      </form>
    </Form>
  )
}
