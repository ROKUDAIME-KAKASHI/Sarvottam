import { getOrganizations, getOrgAssessments } from "@/lib/actions/org-assessment.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function OrgAssessmentDashboard() {
  const organizations = await getOrganizations();
  const assessments = await getOrgAssessments();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Organizational Assessments</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/org-assessments/organizations">
            <Button variant="outline">Manage Organizations</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Orgs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{organizations.length}</div>
            <p className="text-xs text-muted-foreground">Organizations tracked</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter((a) => a.status !== "COMPLETED").length}
            </div>
            <p className="text-xs text-muted-foreground">Evaluations in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {assessments.filter((a) => a.status === "COMPLETED").length}
            </div>
            <p className="text-xs text-muted-foreground">Evaluations finished</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evaluators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(assessments.flatMap((a) => a.evaluators.map((e) => e.userId))).size}
            </div>
            <p className="text-xs text-muted-foreground">Unique active evaluators</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Overview of recent evaluation activities.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {assessments.slice(0, 5).map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{assessment.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Organization: {assessment.organization.name}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-sm font-medium">{assessment.status}</div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/org-assessments/${assessment.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {assessments.length === 0 && (
                <p className="text-sm text-muted-foreground">No assessments initiated yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
