import { getSustainabilityDashboardData } from "@/lib/actions/sustainability.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Leaf, Globe, Activity, Wind } from "lucide-react";

export default async function SustainabilityDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { projects, esgMetrics, carbonMetrics, reports, sdgs } = await getSustainabilityDashboardData();

  const totalEmissions = carbonMetrics.reduce((acc, curr) => acc + curr.emissions, 0);
  const activeProjects = projects.filter(p => p.status === "ACTIVE").length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Sustainability Center</h2>
        <div className="flex space-x-2">
          {session.user.role === "SUPERADMIN" && (
            <>
              <Button variant="outline" asChild><Link href="/dashboard/sustainability/esg/new">Log ESG Metric</Link></Button>
              <Button asChild><Link href="/dashboard/sustainability/projects/new">New Project</Link></Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Footprint</CardTitle>
            <Wind className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmissions.toFixed(2)} tCO2e</div>
            <p className="text-xs text-muted-foreground">Total recorded emissions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Leaf className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">Sustainability initiatives</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Logs</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{esgMetrics.length}</div>
            <p className="text-xs text-muted-foreground">Metrics recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Reports</CardTitle>
            <Globe className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reports.length}</div>
            <p className="text-xs text-muted-foreground">Published disclosures</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Sustainability Projects (SDG Mapped)</CardTitle>
            <CardDescription>Initiatives tracking towards UN Sustainable Development Goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{project.title}</h4>
                    <Badge variant={project.status === "ACTIVE" ? "default" : "secondary"}>{project.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.sdgs.map(sdg => (
                      <Badge key={sdg.id} variant="outline" style={{ borderColor: sdg.color || '#ccc', color: sdg.color || '#333' }}>
                        SDG {sdg.sdgNumber}: {sdg.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-muted-foreground text-sm">No sustainability projects currently active.</p>}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent ESG & Carbon Logs</CardTitle>
              <CardDescription>Latest tracked metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carbonMetrics.slice(0, 3).map(carbon => (
                  <div key={carbon.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{carbon.source} <span className="text-xs text-muted-foreground">({carbon.scope})</span></p>
                      <p className="text-xs text-muted-foreground">{carbon.measuredAt.toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">{carbon.emissions} tCO2e</span>
                  </div>
                ))}
                {esgMetrics.slice(0, 3).map(esg => (
                  <div key={esg.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="text-sm font-medium">{esg.name} <span className="text-xs text-muted-foreground">({esg.category})</span></p>
                      <p className="text-xs text-muted-foreground">{esg.measuredAt.toLocaleDateString()}</p>
                    </div>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{esg.value} {esg.unit}</span>
                  </div>
                ))}
                {(carbonMetrics.length === 0 && esgMetrics.length === 0) && <p className="text-sm text-muted-foreground">No metrics logged yet.</p>}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
