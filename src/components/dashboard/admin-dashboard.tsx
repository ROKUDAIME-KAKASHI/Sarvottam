import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Building, Activity, ShieldCheck, LogIn } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { impersonateUser, getUsersForImpersonation } from "@/app/actions/admin";

export async function AdminDashboard() {
  const totalUsers = await prisma.user.count();
  const industryPartners = await prisma.user.count({ where: { role: "INDUSTRY_PARTNER" } });
  const activeProjects = await prisma.project.count({ where: { status: "OPEN" } });
  const totalProblems = await prisma.problem.count();

  const usersList = await getUsersForImpersonation();

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
          <TabsTrigger value="projects">Projects Pipeline</TabsTrigger>
          <TabsTrigger value="departments">Department Performance</TabsTrigger>
        </TabsList>
        
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
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground">
                [ Chart Visualization: Projects Pipeline ]
              </div>
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
              <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg bg-muted/10 text-muted-foreground">
                [ Bar Chart: Department KPIs ]
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
