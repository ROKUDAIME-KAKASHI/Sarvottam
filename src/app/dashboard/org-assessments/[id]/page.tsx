import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ScoreSectionForm from "./ScoreSectionForm";

export default async function OrgAssessmentDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const assessment = await prisma.orgAssessment.findUnique({
    where: { id: params.id },
    include: {
      organization: true,
      sections: {
        include: {
          evidences: { include: { uploadedBy: true } },
          scores: { include: { evaluator: { include: { user: true } } } },
        },
      },
      evaluators: { include: { user: true } },
    },
  });

  if (!assessment) {
    return <div className="p-8">Assessment not found.</div>;
  }

  const isEvaluator =
    assessment.evaluators.some((e) => e.userId === session.user.id) ||
    session.user.role === "SUPERADMIN";

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{assessment.title}</h2>
          <p className="text-muted-foreground">
            {assessment.organization.name} | Status: {assessment.status}
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/dashboard/org-assessments/organizations/${assessment.organizationId}`}>
            Back to Organization
          </Link>
        </Button>
      </div>

      <div className="space-y-8">
        {assessment.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>{section.name}</CardTitle>
              <CardDescription>Weight: {section.weight}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold mb-2">Evidence Provided</h4>
                {section.evidences.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.evidences.map((ev) => (
                      <li key={ev.id} className="text-sm">
                        <a
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary hover:underline"
                        >
                          {ev.title}
                        </a>
                        <span className="text-muted-foreground ml-2">
                          by {ev.uploadedBy.name || ev.uploadedBy.email}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No evidence uploaded yet.</p>
                )}
                {/* Note: In a full implementation, you'd add an "Add Evidence" form here */}
              </div>

              {isEvaluator && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-4">Evaluate Section</h4>
                  <ScoreSectionForm
                    sectionId={section.id}
                    assessmentId={assessment.id}
                    existingScores={section.scores}
                    currentUserId={session.user.id as string}
                  />
                </div>
              )}

              {!isEvaluator && section.scores.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <h4 className="text-sm font-semibold mb-2">Current Scores</h4>
                  <ul className="space-y-2">
                    {section.scores.map((s) => (
                      <li key={s.id} className="text-sm flex justify-between p-2 bg-muted rounded">
                        <span>
                          {s.evaluator.user.name}: {s.score}
                        </span>
                        <span className="text-muted-foreground italic">{s.feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
