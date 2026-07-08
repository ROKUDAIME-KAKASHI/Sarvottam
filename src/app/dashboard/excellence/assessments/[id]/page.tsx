import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AssessmentForm from "./AssessmentForm";

export default async function AssessmentDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // The id here is the AssessmentTemplate id
  const template = await prisma.assessmentTemplate.findUnique({
    where: { id: params.id },
    include: {
      questions: {
        include: {
          dimension: true,
        },
        orderBy: {
          orderIndex: "asc",
        },
      },
      framework: true,
    },
  });

  if (!template) {
    return <div className="p-8">Template not found.</div>;
  }

  // Check if there's an ongoing draft or create a new AssessmentResult
  let result = await prisma.assessmentResult.findFirst({
    where: {
      templateId: template.id,
      assessorId: session.user.id as string,
      status: "DRAFT",
    },
  });

  if (!result) {
    result = await prisma.assessmentResult.create({
      data: {
        templateId: template.id,
        assessorId: session.user.id as string,
        status: "DRAFT",
      },
    });
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{template.name}</h2>
        <p className="text-muted-foreground">{template.description}</p>
      </div>

      {/* We use a Client Component for the form to manage state and submission */}
      <AssessmentForm template={template} resultId={result.id} />
    </div>
  );
}
