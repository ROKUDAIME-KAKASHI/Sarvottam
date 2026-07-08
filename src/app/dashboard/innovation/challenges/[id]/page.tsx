import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Clock, Award } from "lucide-react";
import SubmitPitchModal from "./SubmitPitchModal";

export default async function ChallengeDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const challenge = await prisma.innovationChallenge.findUnique({
    where: { id: params.id },
    include: {
      pitches: { include: { submitter: true, startup: true } },
    },
  });

  if (!challenge) return <div className="p-8">Challenge not found.</div>;

  // Find user's startups to link pitch
  const myStartups = await prisma.startup.findMany({
    where: { founders: { some: { userId: session.user.id } } },
  });

  const hasSubmitted = challenge.pitches.some((p) => p.submitterId === session.user.id);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/innovation">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{challenge.title}</h2>
          <div className="flex gap-2 mt-1">
            <Badge variant={challenge.status === "OPEN" ? "default" : "secondary"}>
              {challenge.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{challenge.description}</p>
            </CardContent>
          </Card>

          {session.user.role === "SUPERADMIN" && (
            <Card>
              <CardHeader>
                <CardTitle>Submitted Pitches</CardTitle>
                <CardDescription>Review submissions for this challenge.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {challenge.pitches.map((pitch) => (
                  <div key={pitch.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between font-medium mb-1">
                      <span>{pitch.title}</span>
                      <Badge variant="outline">{pitch.status}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Submitted by: {pitch.submitter.name || pitch.submitter.email}
                    </p>
                    <p className="text-sm">{pitch.description}</p>
                    {pitch.deckUrl && (
                      <a
                        href={pitch.deckUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-blue-500 hover:underline mt-2 block"
                      >
                        View Pitch Deck
                      </a>
                    )}
                  </div>
                ))}
                {challenge.pitches.length === 0 && (
                  <p className="text-sm text-muted-foreground">No pitches submitted yet.</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline & Rewards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.deadline.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Award className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium">Prize / Grant</p>
                  <p className="text-sm text-muted-foreground">
                    {challenge.prize || "Not specified"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Participation</CardTitle>
            </CardHeader>
            <CardContent>
              {hasSubmitted ? (
                <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-md border border-green-200 dark:border-green-800 text-sm font-medium text-center">
                  You have already submitted a pitch.
                </div>
              ) : challenge.status === "OPEN" ? (
                <SubmitPitchModal challengeId={challenge.id} myStartups={myStartups} />
              ) : (
                <div className="bg-secondary p-4 rounded-md text-sm text-center text-muted-foreground">
                  Submissions are closed.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
