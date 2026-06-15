import { getStartups, getIncubationPrograms, getInnovationChallenges } from "@/lib/actions/innovation.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Rocket, Lightbulb, Users, Trophy } from "lucide-react";

export default async function InnovationHubDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const startups = await getStartups();
  const programs = await getIncubationPrograms();
  const challenges = await getInnovationChallenges();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Innovation Hub</h2>
        <div className="flex space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/innovation/challenges/new">Create Challenge</Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/innovation/startups/new">Register Startup</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Startups</CardTitle>
            <Rocket className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{startups.length}</div>
            <p className="text-xs text-muted-foreground">Active in the ecosystem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incubation Programs</CardTitle>
            <Lightbulb className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-muted-foreground">Total cohorts run</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Challenges</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{challenges.filter(c => c.status === "OPEN").length}</div>
            <p className="text-xs text-muted-foreground">Seeking solutions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Startup Registry</CardTitle>
            <CardDescription>Directory of ventures incubated or registered.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {startups.map(startup => (
                <div key={startup.id} className="flex justify-between items-start border p-4 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-lg">{startup.name}</h4>
                    <p className="text-sm text-muted-foreground">{startup.industry || "Unspecified Industry"}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{startup.stage}</Badge>
                      <span className="text-xs text-muted-foreground py-1">{startup.founders.length} Founders</span>
                    </div>
                  </div>
                  <Button variant="ghost" asChild>
                    <Link href={`/dashboard/innovation/startups/${startup.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              {startups.length === 0 && <p className="text-muted-foreground">No startups registered yet.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Innovation Challenges</CardTitle>
              <CardDescription>Participate and submit pitches.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {challenges.map(challenge => (
                  <div key={challenge.id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <h5 className="font-medium">{challenge.title}</h5>
                      <Badge variant={challenge.status === "OPEN" ? "default" : "secondary"}>{challenge.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{challenge.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs font-semibold text-green-600">Prize: {challenge.prize || "TBA"}</span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/dashboard/innovation/challenges/${challenge.id}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                ))}
                {challenges.length === 0 && <p className="text-muted-foreground text-sm">No challenges available.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
