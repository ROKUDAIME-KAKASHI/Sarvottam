import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import KPITrendChart from "./KPITrendChart";
import { AlertCircle, ArrowLeft, Target } from "lucide-react";

export default async function KPIDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const kpi = await prisma.kPI.findUnique({
    where: { id: params.id },
    include: {
      category: true,
      department: true,
      targets: { orderBy: { createdAt: 'desc' } },
      history: { orderBy: { date: 'asc' } },
      alerts: { orderBy: { createdAt: 'desc' } }
    }
  });

  if (!kpi) {
    return <div className="p-8">KPI not found.</div>;
  }

  const latestTarget = kpi.targets[0];
  const activeAlerts = kpi.alerts.filter(a => !a.isResolved);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-4 mb-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/kpis"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{kpi.metricName}</h2>
          <p className="text-muted-foreground">{kpi.category.name} | Unit: {kpi.unit || "N/A"}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Current Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{kpi.currentValue} {kpi.unit}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Target</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {latestTarget ? (
              <>
                <div className="text-3xl font-bold">{latestTarget.targetValue} {kpi.unit}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {latestTarget.isAchieved ? "Achieved" : "In Progress"}
                </p>
              </>
            ) : (
              <div className="text-xl text-muted-foreground">No target set</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts</CardTitle>
            <AlertCircle className={`h-4 w-4 ${activeAlerts.length > 0 ? "text-red-500" : "text-green-500"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${activeAlerts.length > 0 ? "text-red-500" : "text-green-500"}`}>
              {activeAlerts.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active risk alerts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Trend Analysis</CardTitle>
            <CardDescription>Historical performance charting</CardDescription>
          </CardHeader>
          <CardContent>
            <KPITrendChart history={kpi.history} />
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent History & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {kpi.history.slice().reverse().map(h => (
                <div key={h.id} className="border-b pb-2 last:border-0 text-sm">
                  <div className="flex justify-between font-medium">
                    <span>{h.value} {kpi.unit}</span>
                    <span className="text-muted-foreground">{h.date.toLocaleDateString()}</span>
                  </div>
                  {h.notes && <p className="text-muted-foreground mt-1">{h.notes}</p>}
                </div>
              ))}
              {kpi.history.length === 0 && <p className="text-muted-foreground">No history logged.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
