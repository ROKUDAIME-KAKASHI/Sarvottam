import { getAssessmentTemplates } from "@/lib/actions/excellence.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AssessmentsPage() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const templates = await getAssessmentTemplates();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Assessments</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.framework.name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
              <div className="text-sm font-medium">
                Questions: {template.questions.length}
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/dashboard/excellence/assessments/${template.id}`} className="w-full">
                <Button className="w-full">Start Assessment</Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
        {templates.length === 0 && (
          <div className="col-span-full flex justify-center p-8 border rounded-lg border-dashed">
            <p className="text-muted-foreground">No assessment templates available yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
