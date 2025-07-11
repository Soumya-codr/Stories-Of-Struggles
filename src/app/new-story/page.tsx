import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import StoryPromptGenerator from "@/components/ai/story-prompt-generator";
import { NewStoryForm } from "@/components/projects/new-story-form";
import { Separator } from "@/components/ui/separator";
import StoryWeaver from "@/components/ai/story-weaver";

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
            <div className="mb-8 p-6 rounded-lg bg-muted/50 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Need inspiration?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use our AI prompt generator to get some ideas for your story.
                </p>
                <StoryPromptGenerator />
              </div>
              <Separator />
               <div>
                <h3 className="text-lg font-semibold mb-2">Want a head start?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Let our AI Story Weaver draft a beautiful narrative for you based on a few key points.
                </p>
                <StoryWeaver />
              </div>
            </div>
            <NewStoryForm />
        </CardContent>
      </Card>
    </div>
  )
}
