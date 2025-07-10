import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Users } from "lucide-react";
import Link from "next/link";

export default function TeamsPage() {
  const teams: any[] = []; // No dummy data

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Teams</h1>
        <Button asChild>
          <Link href="/teams/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Team
          </Link>
        </Button>
      </div>

      {teams.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* This part will be empty until team functionality is implemented */}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="text-xl font-semibold mt-4">No Teams Yet</h3>
            <p className="text-muted-foreground mt-2">
              Create a team to collaborate on your projects or join an existing one.
            </p>
            <div className="mt-6 flex justify-center gap-4">
               <Button asChild>
                  <Link href="/teams/new">
                    <PlusCircle className="mr-2 h-4 w-4" /> Create Team
                  </Link>
              </Button>
              <Button variant="outline">Browse Teams</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
