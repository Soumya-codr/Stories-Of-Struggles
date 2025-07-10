import { NewTeamForm } from "@/components/teams/new-team-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function NewTeamPage() {
  return (
    <div className="container mx-auto max-w-2xl py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Create a New Team</CardTitle>
          <CardDescription>
            Build a team to collaborate on your project stories and share your journey together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewTeamForm />
        </CardContent>
      </Card>
    </div>
  )
}
