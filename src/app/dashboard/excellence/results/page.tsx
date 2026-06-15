import { getResults } from "@/lib/actions/excellence.actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ResultsPage() {
  const results = await getResults();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assessment Results</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Results</CardTitle>
          <CardDescription>View scores and benchmarking data across all completed assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Template</TableHead>
                <TableHead>Framework</TableHead>
                <TableHead>Assessor</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.id}>
                  <TableCell className="font-medium">{result.template.name}</TableCell>
                  <TableCell>{result.template.framework.name}</TableCell>
                  <TableCell>{result.assessor.name || result.assessor.email}</TableCell>
                  <TableCell className="font-bold">{result.totalScore}</TableCell>
                  <TableCell>
                    {result.status}
                  </TableCell>
                  <TableCell>{result.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/excellence/results/${result.id}`}>View Scorecard</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {results.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
