import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, PlusCircle } from "lucide-react";

// This page remains with dummy data for now, as team functionality is complex to implement.
const teams = [
  { id: 1, name: "Phoenix Core", members: 5, avatar: "https://placehold.co/40x40.png" },
  { id: 2, name: "Indie Gamers", members: 2, avatar: "https://placehold.co/40x40.png" },
];

export default function TeamsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Teams</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Team
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <Card key={team.id}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={team.avatar} alt={team.name} />
                  <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{team.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                <span>{team.members} members</span>
              </div>
            </CardContent>
          </Card>
        ))}
        
        <Card className="border-dashed flex items-center justify-center">
            <CardHeader className="text-center">
                <CardTitle>Join a Team</CardTitle>
                <CardDescription>
                    Looking for a team? Browse public teams or create your own.
                </CardDescription>
                <Button variant="outline" className="mt-4">Browse Teams</Button>
            </CardHeader>
        </Card>

      </div>
    </div>
  )
}
