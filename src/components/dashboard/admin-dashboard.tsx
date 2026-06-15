import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building, Activity, ShieldCheck, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { impersonateUser, getUsersForImpersonation } from "@/app/actions/admin";
import { ComingSoon } from "@/components/coming-soon";
import ApplicationList from "@/app/dashboard/applications/ApplicationList";
import { approveProblem } from "@/app/actions/problems";

export async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const industryPartners = await prisma.user.count({ where: { role: "INDUSTRY_PARTNER" } });
  const activeProjects = await prisma.project.count({ where: { status: "OPEN" } });
  const totalProblems = await prisma.problem.count();

  const usersList = await getUsersForImpersonation();
  
  const pendingApplications = await prisma.application.findMany({
    where: { status: "PENDING" },
    include: { project: true, user: true },
    orderBy: { createdAt: "desc" }
  });

  const pendingProblems = await prisma.problem.findMany({
    where: { 
      OR: [
        { adminApproved: false },
        { status: "OPEN" }
      ]
    },
    include: { submitter: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Super Admin Dashboard</h2>
        <p className="text-muted-foreground">Global overview of the Sarvottam ecosystem.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry Partners</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{industryPartners}</div>
            <p className="text-xs text-muted-foreground">Active organizations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Open for applications</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted Problems</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProblems}</div>
            <p className="text-xs text-muted-foreground">Total in system</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="approvals" className="relative">
            Approvals
            {(pendingApplications.length > 0 || pendingProblems.filter(p => !p.adminApproved).length > 0) && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="projects">Projects Pipeline</TabsTrigger>
          <TabsTrigger value="departments">Department Performance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="approvals" className="mt-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Industry Problems (Final Admin Approval)</CardTitle>
              <CardDescription>Review and provide final authorization for problems to enter the marketplace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {pendingProblems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No problems pending approval.</p>
                ) : (
                  pendingProblems.map(problem => (
                    <div key={problem.id} className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <p className="font-semibold">{problem.title}</p>
                        <p className="text-xs text-muted-foreground">By {problem.submitter.name} ({problem.submitter.role})</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={problem.adminApproved ? "default" : "secondary"}>
                          {problem.adminApproved ? "Admin OK" : "Pending Admin"}
                        </Badge>
                        {!problem.adminApproved && (
                          <form action={async () => { "use server"; await approveProblem(problem.id, "ADMIN", true); }}>
                            <Button size="sm">Approve Problem</Button>
                          </form>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Applications (Final Admin Approval)</CardTitle>
              <CardDescription>Admins can provide the final override or approval for student node applications.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <ApplicationList 
                  applications={pendingApplications.map(app => ({
                    ...app,
                    project: { ...app.project, creatorId: app.project.creatorId || "" }
                  }))} 
                  currentUserRole="SUPERADMIN" 
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Directory & Impersonation</CardTitle>
              <CardDescription>View all users and log in as them without a password to troubleshoot or manage problems.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
                {usersList.map(user => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                    <div>
                      <p className="font-semibold">{user.name || "Unnamed User"}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{user.role}</Badge>
                      {user.role !== "SUPERADMIN" && (
                        <form action={impersonateUser.bind(null, user.id)}>
                          <Button type="submit" variant="secondary" size="sm">
                            <LogIn className="w-4 h-4 mr-2" />
                            Login As
                          </Button>
                        </form>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Pipeline Status</CardTitle>
              <CardDescription>Overview of all projects across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ComingSoon feature="Project pipeline visualization">
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground cursor-pointer hover:bg-muted/20 transition-colors">
                  [ Chart Visualization: Projects Pipeline ]
                </div>
              </ComingSoon>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="departments" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Department Node Performance</CardTitle>
              <CardDescription>KPIs by Node</CardDescription>
            </CardHeader>
            <CardContent>
              <ComingSoon feature="Department KPI charts">
                <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground cursor-pointer hover:bg-muted/20 transition-colors">
                  [ Bar Chart: Department KPIs ]
                </div>
              </ComingSoon>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
