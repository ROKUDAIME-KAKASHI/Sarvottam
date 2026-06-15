import { getOrgAssessments } from "@/lib/actions/org-assessment.actions";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";
import StartAssessmentButton from "./StartAssessmentButton";

export default async function OrganizationDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const organization = await prisma.organization.findUnique({
    where: { id: params.id },
  });

  if (!organization) {
    return <div className="p-8">Organization not found.</div>;
  }

  const assessments = await getOrgAssessments(organization.id);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{organization.name}</h2>
          <p className="text-muted-foreground">{organization.industry} | {organization.type} | {organization.size}</p>
        </div>
        <div className="flex items-center space-x-2">
          <StartAssessmentButton orgId={organization.id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assessments</CardTitle>
          <CardDescription>Evaluation history for this organization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Evaluators</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assessments.map((assessment) => (
                <TableRow key={assessment.id}>
                  <TableCell className="font-medium">{assessment.title}</TableCell>
                  <TableCell>{assessment.status}</TableCell>
                  <TableCell>{assessment.evaluators.length}</TableCell>
                  <TableCell>{assessment.createdAt.toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/dashboard/org-assessments/${assessment.id}`}>View / Evaluate</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {assessments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No assessments initiated yet.
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
