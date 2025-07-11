
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
import { createTeam } from "@/services/stories"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

const newTeamFormSchema = z.object({
  name: z.string().min(3, {
    message: "Team name must be at least 3 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(300, { message: "Description must be less than 300 characters."}),
})

type NewTeamFormValues = z.infer<typeof newTeamFormSchema>

export function NewTeamForm() {
  const { toast } = useToast()
  const router = useRouter();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<NewTeamFormValues>({
    resolver: zodResolver(newTeamFormSchema),
    defaultValues: {
        name: "",
        description: "",
    },
    mode: "onChange",
  })

  async function onSubmit(data: NewTeamFormValues) {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to create a team.",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
        const result = await createTeam(data, user.id);

        if (result.success) {
            toast({
                title: "Team Created!",
                description: "Your new team is ready for collaboration.",
            });
            form.reset();
            // Redirect to the teams page for now
            router.push(`/teams`);
        } else {
            throw new Error(result.error || "An unknown error occurred.");
        }
    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Failed to create your team. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., The Code Crusaders" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormDescription>
                This will be the public name of your team.
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
              <FormLabel>Team Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief one or two-sentence summary of your team's mission."
                  className="resize-none"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting || !user}>
          {isSubmitting ? 'Creating Team...' : 'Create Team'}
        </Button>
      </form>
    </Form>
  )
}
