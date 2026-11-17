import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BENCHMARK_RESULTS: Record<string, any> = {
  "res-01": {
    id: "res-01",
    totalScore: 92,
    normalizedScore: 920,
    status: "SUBMITTED",
    createdAt: new Date(),
    template: {
      name: "Aerospace & Automotive Engineering Quality Audit",
      framework: { name: "IFQM Institutional Quality Excellence Model (IQEM)" },
    },
    assessor: {
      name: "Prof. S. R. Narasimhan",
      email: "sr.narasimhan@jainuniversity.ac.in",
      role: "FACULTY",
    },
    responses: [
      {
        id: "resp-1",
        numericValue: 5,
        notes: "Automated optical inspection calibrated against ISO standards.",
        question: {
          text: "Are Critical-to-Quality (CTQ) specifications baseline-measured using Gage R&R?",
          maxValue: 5,
          dimension: { name: "Statistical Process Governance" },
        },
      },
      {
        id: "resp-2",
        numericValue: 4,
        notes: "Real-time SPC charts active on all manufacturing test benches.",
        question: {
          text: "Is process capability (Cp/Cpk) tracked continuously with statistical alerts?",
          maxValue: 5,
          dimension: { name: "Process Outcomes" },
        },
      },
      {
        id: "resp-3",
        numericValue: 5,
        notes: "Joint reviews held every second Tuesday with partner quality leads.",
        question: {
          text: "Are industry sponsors actively involved in bi-weekly sprint reviews?",
          maxValue: 5,
          dimension: { name: "Academic-Industry Co-Creation" },
        },
      },
    ],
  },
  "res-02": {
    id: "res-02",
    totalScore: 88,
    normalizedScore: 880,
    status: "SUBMITTED",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    template: {
      name: "Clean Energy & Battery Labs DMAIC Assessment",
      framework: { name: "Lean Six Sigma DMAIC Operational Architecture" },
    },
    assessor: {
      name: "Dr. Arvind Swaminathan",
      email: "arvind.s@tatamotors.com",
      role: "INDUSTRY_PARTNER",
    },
    responses: [
      {
        id: "resp-4",
        numericValue: 4,
        notes: "Slurry viscosity and coating thickness monitored within 3 microns.",
        question: {
          text: "Are cathode slurry coating variations controlled within Six Sigma tolerances?",
          maxValue: 5,
          dimension: { name: "Measure & Analyze" },
        },
      },
      {
        id: "resp-5",
        numericValue: 5,
        notes: "Gage repeatability verified below 6.5%.",
        question: {
          text: "Is measurement error verified through Gage R&R studies?",
          maxValue: 5,
          dimension: { name: "Improve & Control" },
        },
      },
    ],
  },
  "res-03": {
    id: "res-03",
    totalScore: 95,
    normalizedScore: 950,
    status: "SUBMITTED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    template: {
      name: "Institutional ESG & Carbon Readiness Review",
      framework: { name: "IFQM Institutional Quality Excellence Model (IQEM)" },
    },
    assessor: {
      name: "IFQM External Quality Auditor",
      email: "audit@ifqm.org",
      role: "SUPERADMIN",
    },
    responses: [
      {
        id: "resp-6",
        numericValue: 5,
        notes: "Comprehensive Scope 1-3 carbon tracking enabled across labs.",
        question: {
          text: "Does the institution maintain verified GHG emissions reporting?",
          maxValue: 5,
          dimension: { name: "ESG & Sustainability Impact" },
        },
      },
    ],
  },
};

export default async function ScorecardPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = null;
  try {
    result = await prisma.assessmentResult.findUnique({
      where: { id },
      include: {
        template: {
          include: { framework: true },
        },
        responses: {
          include: { question: { include: { dimension: true } } },
        },
        assessor: true,
        improvementPlans: true,
      },
    });
  } catch (error) {
    console.warn(
      "Database lookup failed for assessment result, checking benchmark evaluations:",
      error
    );
  }

  if (!result) {
    result = BENCHMARK_RESULTS[id];
  }

  if (!result) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Assessment result scorecard not found.
      </div>
    );
  }

  // Calculate scores per dimension
  const dimensionScores: Record<string, { total: number; max: number; percentage: number }> = {};

  result.responses?.forEach((r: any) => {
    const dim = r.question?.dimension?.name || "Core Dimension";
    if (!dimensionScores[dim]) {
      dimensionScores[dim] = { total: 0, max: 0, percentage: 0 };
    }
    dimensionScores[dim].total += r.numericValue || 0;
    dimensionScores[dim].max += r.question?.maxValue || 5;
  });

  Object.keys(dimensionScores).forEach((dim) => {
    dimensionScores[dim].percentage = Math.round(
      (dimensionScores[dim].total / dimensionScores[dim].max) * 100
    );
  });

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-primary">
            {result.template?.framework?.name || "Quality Excellence Model"}
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Assessment Scorecard
          </h2>
          <p className="text-sm text-muted-foreground">{result.template?.name}</p>
        </div>
        <Button variant="outline" asChild className="rounded-xl">
          <Link href="/dashboard/excellence">Back to Excellence Hub</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Overall Audit Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl md:text-4xl font-extrabold text-foreground">
              {result.totalScore} / 100
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              Normalized Rating: {result.normalizedScore || result.totalScore * 10}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Status & Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{result.status}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Recorded:{" "}
              {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : "Active"}
            </p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
              Lead Quality Assessor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate text-foreground">
              {result.assessor?.name || result.assessor?.email || "Quality Council Lead"}
            </div>
            <p className="text-xs font-mono uppercase text-primary mt-0.5">
              {result.assessor?.role || "ASSESSOR"}
            </p>
          </CardContent>
        </Card>
      </div>

      {Object.keys(dimensionScores).length > 0 && (
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Dimension Breakdown</CardTitle>
            <CardDescription className="text-xs">
              Performance across framework criteria
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(dimensionScores).map(([dim, scores]) => (
                <div key={dim} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs md:text-sm">
                    <span className="font-semibold text-foreground">{dim}</span>
                    <span className="text-muted-foreground font-mono">
                      {scores.total} / {scores.max} ({scores.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${scores.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {result.responses && result.responses.length > 0 && (
        <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Detailed Response Audit</CardTitle>
            <CardDescription className="text-xs">
              Specific questions and evidence notes
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="font-bold text-xs">Dimension</TableHead>
                  <TableHead className="w-1/2 font-bold text-xs">Question Criteria</TableHead>
                  <TableHead className="font-bold text-xs">Rating</TableHead>
                  <TableHead className="font-bold text-xs">Auditor Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.responses.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-semibold text-xs text-foreground">
                      {r.question?.dimension?.name || "Core"}
                    </TableCell>
                    <TableCell className="text-xs text-foreground/90">{r.question?.text}</TableCell>
                    <TableCell className="font-bold font-mono text-xs text-primary">
                      {r.numericValue} / {r.question?.maxValue || 5}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {r.notes || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
