import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import StoryPromptGenerator from "@/components/ai/story-prompt-generator";
import { NewStoryForm } from "@/components/projects/new-story-form";

export default function NewStoryPage() {
  return (
    <div className="container mx-auto max-w-3xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Share Your Struggle</CardTitle>
          <CardDescription>
            Every great project has a story of overcoming challenges. Share yours with the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="mb-8 p-6 rounded-lg bg-muted/50">
              <h3 className="text-lg font-semibold mb-2">Need inspiration?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Use our AI prompt generator to get some ideas for your story.
              </p>
              <StoryPromptGenerator />
            </div>
            <NewStoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
