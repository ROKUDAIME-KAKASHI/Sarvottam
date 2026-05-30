import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Target, Activity, Plus } from "lucide-react";

export function IndustryDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Partner Dashboard</h2>
          <p className="text-muted-foreground">Monitor your submitted problems and research outcomes.</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Submit New Problem
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted Problems</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">3 assigned to teams</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">Active development</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Research Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Ready to download</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Problem Status Tracking</CardTitle>
          <CardDescription>Track the lifecycle of your submitted challenges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[
              { 
                title: "Reduce Assembly Line Defect Rate", 
                stage: "Execution", 
                progress: 65, 
                team: "Eng-Alpha",
                status: "On Track" 
              },
              { 
                title: "Predictive Maintenance for CNC Machines", 
                stage: "Research", 
                progress: 20, 
                team: "Data-Beta",
                status: "Requires Input" 
              },
              { 
                title: "Supply Chain Vendor Quality Audit", 
                stage: "Completed", 
                progress: 100, 
                team: "MBA-Gamma",
                status: "Report Available" 
              }
            ].map((item, i) => (
              <div key={i} className="flex flex-col space-y-2 border-b pb-4 last:border-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{item.title}</span>
                  <Badge variant={item.status === "Report Available" ? "default" : item.status === "Requires Input" ? "destructive" : "secondary"}>
                    {item.status}
                  </Badge>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Stage: {item.stage}</span>
                  <span>Team: {item.team}</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${item.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
