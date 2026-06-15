import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ScorecardPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const result = await prisma.assessmentResult.findUnique({
    where: { id: params.id },
    include: {
      template: {
        include: { framework: true }
      },
      responses: {
        include: { question: { include: { dimension: true } } }
      },
      assessor: true,
      improvementPlans: true
    }
  });

  if (!result) {
    return <div className="p-8">Result not found.</div>;
  }

  // Calculate scores per dimension
  const dimensionScores: Record<string, { total: number; max: number; percentage: number }> = {};
  
  result.responses.forEach(r => {
    const dim = r.question.dimension.name;
    if (!dimensionScores[dim]) {
      dimensionScores[dim] = { total: 0, max: 0, percentage: 0 };
    }
    dimensionScores[dim].total += (r.numericValue || 0);
    dimensionScores[dim].max += (r.question.maxValue || 5);
  });

  Object.keys(dimensionScores).forEach(dim => {
    dimensionScores[dim].percentage = Math.round((dimensionScores[dim].total / dimensionScores[dim].max) * 100);
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Assessment Scorecard</h2>
          <p className="text-muted-foreground">{result.template.name}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/dashboard/excellence/results">Back to Results</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{result.totalScore}</div>
            <p className="text-xs text-muted-foreground mt-1">Normalized: {result.normalizedScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{result.status}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Date: {result.createdAt.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Assessor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold truncate">{result.assessor.name || result.assessor.email}</div>
            <p className="text-xs text-muted-foreground mt-1">{result.assessor.role}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dimension Breakdown</CardTitle>
          <CardDescription>Performance across framework dimensions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(dimensionScores).map(([dim, scores]) => (
              <div key={dim} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dim}</span>
                  <span className="text-sm text-muted-foreground">{scores.total} / {scores.max} ({scores.percentage}%)</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary" 
                    style={{ width: `${scores.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dimension</TableHead>
                <TableHead className="w-1/2">Question</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.responses.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.question.dimension.name}</TableCell>
                  <TableCell>{r.question.text}</TableCell>
                  <TableCell className="font-bold">{r.numericValue} / {r.question.maxValue}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{r.notes || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
