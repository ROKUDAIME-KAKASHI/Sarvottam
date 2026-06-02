import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FileText, CheckCircle, Activity } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { approveProblem } from "@/app/actions/problems";

export async function FacultyDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const mentoredProjects = await prisma.project.findMany({
    where: { mentorId: userId },
    include: {
      applications: {
        include: { user: true }
      }
    }
  });

  const pendingApprovalsCount = mentoredProjects.reduce(
    (count, project) => count + project.applications.filter(a => a.status === "PENDING").length,
    0
  );

  const studentTeamsCount = new Set(
    mentoredProjects.flatMap(p => p.applications.filter(a => a.status === "ACCEPTED").map(a => a.userId))
  ).size;

  // Gather all applications for the "recent submissions" list
  const recentApplications = mentoredProjects
    .flatMap(p => p.applications.map(a => ({ ...a, projectTitle: p.title })))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Fetch student-submitted problems for faculty approval
  const studentProblems = await prisma.problem.findMany({
    where: {
      submitter: { role: "STUDENT" }
    },
    include: { submitter: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h2>
        <p className="text-muted-foreground">Manage your mentored projects and student teams.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mentored Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mentoredProjects.length}</div>
            <p className="text-xs text-muted-foreground">Active supervision</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Teams</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentTeamsCount}</div>
            <p className="text-xs text-muted-foreground">Unique active students</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingApprovalsCount}</div>
            <p className="text-xs text-muted-foreground">Applications & Deliverables</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Student Problems</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{studentProblems.length}</div>
            <p className="text-xs text-muted-foreground">Total submitted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Project Submissions</CardTitle>
            <CardDescription>Review deliverables from student teams</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent applications or submissions.</p>
              ) : (
                recentApplications.map((app) => (
                  <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{app.projectTitle}</p>
                      <p className="text-sm text-muted-foreground">{app.user.name || app.user.email} • Submitted {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <Badge variant={app.status === "ACCEPTED" ? "default" : app.status === "REJECTED" ? "destructive" : "secondary"}>{app.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Problem Approvals</CardTitle>
            <CardDescription>Review and approve problems submitted by students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
              {studentProblems.length === 0 ? (
                <p className="text-sm text-muted-foreground">No problems submitted by students yet.</p>
              ) : (
                studentProblems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4">
                    <div className="space-y-1 flex-1">
                      <p className="text-sm font-bold leading-tight">{problem.title}</p>
                      <p className="text-xs text-muted-foreground">By {problem.submitter.name || problem.submitter.email}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{problem.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge variant={problem.facultyApproved ? "default" : "secondary"} className="text-[10px] uppercase">
                        {problem.facultyApproved ? "Approved" : "Pending"}
                      </Badge>
                      <form action={approveProblem.bind(null, problem.id, "FACULTY", !problem.facultyApproved)}>
                        <Button 
                          type="submit" 
                          size="sm" 
                          variant={problem.facultyApproved ? "outline" : "default"}
                          className="h-7 text-xs px-3"
                        >
                          {problem.facultyApproved ? "Revoke Approval" : "Approve Problem"}
                        </Button>
                      </form>
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
