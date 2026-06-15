import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getFrameworks, getResults, getImprovementPlans } from "@/lib/actions/excellence.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ExcellenceDashboard() {
  const frameworks = await getFrameworks();
  const results = await getResults();
  const plans = await getImprovementPlans();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Excellence Framework</h2>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/excellence/assessments">
            <Button>Take Assessment</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{frameworks.length}</div>
            <p className="text-xs text-muted-foreground">Excellence models available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessments Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{results.filter(r => r.status === 'SUBMITTED').length}</div>
            <p className="text-xs text-muted-foreground">Organizational evaluations</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Maturity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {results.length > 0 
                ? (results.reduce((acc, curr) => acc + (curr.totalScore || 0), 0) / results.length).toFixed(1) 
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Across all departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Improvement Plans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">Active initiatives</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
            <CardDescription>Overview of recent evaluations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {results.slice(0, 5).map((result) => (
                <div key={result.id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{result.template.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Assessor: {result.assessor.name || result.assessor.email}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">Score: {result.totalScore}</div>
                </div>
              ))}
              {results.length === 0 && <p className="text-sm text-muted-foreground">No assessments yet.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Frameworks Overview</CardTitle>
            <CardDescription>Configured excellence models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {frameworks.map((framework) => (
                <div key={framework.id} className="flex items-center border-b pb-4 last:border-0 last:pb-0">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{framework.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {framework.dimensions.length} Dimensions | {framework.maturityLevels.length} Levels
                    </p>
                  </div>
                </div>
              ))}
              {frameworks.length === 0 && <p className="text-sm text-muted-foreground">No frameworks configured.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
