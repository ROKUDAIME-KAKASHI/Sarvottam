import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AssessmentForm from "./AssessmentForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BENCHMARK_TEMPLATES: Record<string, any> = {
  "tmpl-dmaic-audit": {
    id: "tmpl-dmaic-audit",
    name: "Institutional Lean Six Sigma & DMAIC Audit",
    description:
      "Structured evaluation of academic-industry research cohorts against Six Sigma defect tolerances and statistical process control.",
    framework: { name: "Lean Six Sigma DMAIC Operational Architecture" },
    questions: [
      {
        id: "q1",
        question: "Are Critical-to-Quality (CTQ) specifications baseline-measured using Gage R&R?",
        dimension: { name: "Measure" },
      },
      {
        id: "q2",
        question: "Is process capability (Cp/Cpk) tracked continuously with statistical alerts?",
        dimension: { name: "Control" },
      },
      {
        id: "q3",
        question:
          "Are root causes validated with multi-vari or DoE testing prior to implementation?",
        dimension: { name: "Analyze" },
      },
    ],
  },
  "tmpl-iqem-review": {
    id: "tmpl-iqem-review",
    name: "IFQM Quality Excellence Institutional Assessment",
    description:
      "Comprehensive 5-dimension evaluation of departmental research governance, industry co-creation, and student competency outcomes.",
    framework: { name: "IFQM Institutional Quality Excellence Model (IQEM)" },
    questions: [
      {
        id: "q4",
        question:
          "Does leadership allocate dedicated budget and lab capacity for industry quality problems?",
        dimension: { name: "Strategic Quality Leadership" },
      },
      {
        id: "q5",
        question: "Are industry sponsors actively involved in bi-weekly sprint reviews?",
        dimension: { name: "Academic-Industry Co-Creation" },
      },
      {
        id: "q6",
        question:
          "Are student project deliverables submitted to external peer-reviewed or patent scrutiny?",
        dimension: { name: "Student Research Competency Output" },
      },
    ],
  },
};

export default async function AssessmentDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let template: any = null;
  try {
    template = await prisma.assessmentTemplate.findUnique({
      where: { id },
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
  } catch (error) {
    console.warn(
      "Database error querying assessment template, checking benchmark templates:",
      error
    );
  }

  if (!template) {
    template = BENCHMARK_TEMPLATES[id];
  }

  if (!template) {
    return (
      <div className="p-8 text-center text-muted-foreground">Assessment template not found.</div>
    );
  }

  // Check if there's an ongoing draft or create a new AssessmentResult
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let resultId = `result-${id}-${session.user.id || "guest"}`;
  try {
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
    resultId = result.id;
  } catch (error) {
    console.warn(
      "Database error saving draft assessment result, using active memory session:",
      error
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 max-w-4xl mx-auto">
      <div className="space-y-1.5 pb-4 border-b border-border/60">
        <div className="text-xs font-semibold uppercase tracking-wider text-primary">
          {template.framework?.name || "Quality Excellence Model"}
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">{template.name}</h2>
        <p className="text-sm text-muted-foreground">{template.description}</p>
      </div>

      <AssessmentForm template={template} resultId={resultId} />
    </div>
  );
}
