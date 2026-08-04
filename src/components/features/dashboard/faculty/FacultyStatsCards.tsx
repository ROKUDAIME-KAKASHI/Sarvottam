import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, CheckCircle, Activity } from "lucide-react";

export function FacultyStatsCards({
  mentoredProjectsCount,
  studentTeamsCount,
  pendingApprovalsCount,
  studentProblemsCount,
}: {
  mentoredProjectsCount: number;
  studentTeamsCount: number;
  pendingApprovalsCount: number;
  studentProblemsCount: number;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mentored Projects</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{mentoredProjectsCount}</div>
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
          <div className="text-2xl font-bold">{studentProblemsCount}</div>
          <p className="text-xs text-muted-foreground">Total submitted</p>
        </CardContent>
      </Card>
    </div>
  );
}
