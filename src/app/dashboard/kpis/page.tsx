import { getDashboardKPIs, getKPICategories } from "@/lib/actions/kpi.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, TrendingDown, Target, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import UpdateKPIButton from "./UpdateKPIButton"; // we will create this

export default async function KPIDashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const kpis = await getDashboardKPIs();
  const categories = await getKPICategories();

  const totalAlerts = kpis.reduce((acc, kpi) => acc + kpi.alerts.length, 0);
  const achievedTargets = kpis.filter(kpi => kpi.targets[0]?.isAchieved).length;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">KPI & Analytics Dashboard</h2>
        {session.user.role === "SUPERADMIN" && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/kpis/manage">Manage KPIs</Link>
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active KPIs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpis.length}</div>
            <p className="text-xs text-muted-foreground">Across {categories.length} categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Targets Achieved</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{achievedTargets}</div>
            <p className="text-xs text-muted-foreground">Goals met this period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalAlerts}</div>
            <p className="text-xs text-muted-foreground">Unresolved KPI alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {kpis.length > 0 
                ? `${Math.round(kpis.filter(k => k.targets[0] && (k.currentValue >= k.targets[0].targetValue)).length / kpis.length * 100)}%`
                : "N/A"
              }
            </div>
            <p className="text-xs text-muted-foreground">Overall target completion</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Current values vs. established targets.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpis.map((kpi) => {
                  const target = kpi.targets[0];
                  const isAtRisk = kpi.alerts.length > 0;
                  return (
                    <TableRow key={kpi.id}>
                      <TableCell className="font-medium">
                        {kpi.metricName}
                        {isAtRisk && <AlertCircle className="inline ml-2 h-4 w-4 text-red-500" />}
                      </TableCell>
                      <TableCell>{kpi.category.name}</TableCell>
                      <TableCell className="font-bold">
                        {kpi.currentValue} {kpi.unit}
                      </TableCell>
                      <TableCell>{target ? `${target.targetValue} ${kpi.unit}` : "No Target"}</TableCell>
                      <TableCell>
                        {target?.isAchieved ? (
                          <span className="text-green-600 font-medium flex items-center"><CheckCircle2 className="mr-1 h-3 w-3"/> Achieved</span>
                        ) : (
                          <span className="text-amber-600 font-medium">In Progress</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <UpdateKPIButton kpi={kpi} />
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/kpis/${kpi.id}`}>Trends</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {kpis.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No KPIs defined yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Category Analytics</CardTitle>
            <CardDescription>KPI distribution across pillars.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center">
                  <div className="w-full flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat.name}</span>
                    <span className="text-muted-foreground">{cat.kpis.length} metrics</span>
                  </div>
                </div>
              ))}
              {categories.length === 0 && <p className="text-sm text-muted-foreground">No categories defined.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
