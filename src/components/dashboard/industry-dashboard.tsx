import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { FileText, Target, Activity, Plus } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ComingSoon } from "@/components/coming-soon";
import { approveApplication } from "@/app/actions/applications";

export async function IndustryDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const problems = await prisma.problem.findMany({
    where: { submitterId: userId },
    orderBy: { createdAt: "desc" },
    include: { assignee: true },
  });

  const projects = await prisma.project.findMany({
    where: { partnerId: userId },
    include: {
      applications: {
        where: { status: "PENDING" },
        include: { user: true },
      },
    },
  });

  const pendingApplications = projects.flatMap((p) =>
    p.applications.map((a) => ({ ...a, projectTitle: p.title }))
  );
  const ongoingProjectsCount = projects.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partner Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor your submitted problems and research outcomes.
          </p>
        </div>
        <Link href="/problems" className={buttonVariants()}>
          <Plus className="mr-2 h-4 w-4" /> Submit New Problem
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted Problems</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{problems.length}</div>
            <p className="text-xs text-muted-foreground">Registered in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingProjectsCount}</div>
            <p className="text-xs text-muted-foreground">Active development</p>
          </CardContent>
        </Card>
        <ComingSoon feature="Research reports">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Research Reports</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Ready to download</p>
            </CardContent>
          </Card>
        </ComingSoon>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Problem Status Tracking</CardTitle>
            <CardDescription>Track the lifecycle of your submitted challenges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {problems.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  You have not submitted any problems yet.
                </p>
              ) : (
                problems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{item.title}</span>
                      <Badge
                        variant={
                          item.status === "RESOLVED"
                            ? "default"
                            : item.status === "OPEN"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Level: {item.level}</span>
                      <span>Assignee: {item.assignee?.name || "Unassigned"}</span>
                    </div>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width:
                            item.status === "RESOLVED"
                              ? "100%"
                              : item.status === "IN_PROGRESS"
                                ? "50%"
                                : "10%",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Node Applications</CardTitle>
            <CardDescription>
              Review students applying to work on your industry challenges
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending applications for your projects.
                </p>
              ) : (
                pendingApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4"
                  >
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-bold leading-tight">{app.projectTitle}</p>
                      <p className="text-xs text-muted-foreground">
                        By {app.user.name || app.user.email}
                      </p>
                      <p className="text-xs italic text-muted-foreground line-clamp-1">
                        Skills: {app.user.skills || "N/A"}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={app.industryApproved ? "default" : "secondary"}
                        className="text-[10px] uppercase"
                      >
                        {app.industryApproved ? "Partner OK" : "Pending"}
                      </Badge>
                      {!app.industryApproved && (
                        <form
                          action={async () => {
                            "use server";
                            await approveApplication(app.id, "INDUSTRY", true);
                          }}
                        >
                          <Button size="sm" className="h-7 text-xs px-3">
                            Authorize
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
