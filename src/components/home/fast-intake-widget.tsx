"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createProblem } from "@/app/actions/problems";
import {
  Building2,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

interface FastIntakeWidgetProps {
  isLoggedIn: boolean;
}

const SECTORS = [
  "Advanced Manufacturing",
  "Automotive & EV",
  "Supply Chain & Logistics",
  "IoT & Edge Telemetry",
  "Renewable Energy & ESG",
  "Software QA & Automation",
];

export function FastIntakeWidget({ isLoggedIn }: FastIntakeWidgetProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    company: "",
    sector: "Advanced Manufacturing",
    problem: "",
    outcome: "",
    type: "RESEARCH_PROJECT",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.company.trim()) {
      setError("Please specify your company or organization name.");
      return;
    }
    if (formData.problem.trim().length < 15) {
      setError("Problem statement must be at least 15 characters long.");
      return;
    }
    if (formData.outcome.trim().length < 10) {
      setError("Expected outcome / target metric must be at least 10 characters long.");
      return;
    }

    if (!isLoggedIn) {
      // Store in session storage so they can resume
      try {
        sessionStorage.setItem("draft_problem", JSON.stringify(formData));
      } catch (err) {
        // ignore
      }
      router.push("/login?callbackUrl=/problems");
      return;
    }

    setIsPending(true);
    try {
      const res = await createProblem(formData);
      if (res.error) {
        setError(res.error);
      } else if (res.success) {
        setSuccessId(res.problemId || "success");
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <section
      id="intake"
      className="py-20 md:py-28 bg-background border-b border-border/40 relative"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4">
              <Building2 className="h-3.5 w-3.5" />
              DIRECT INDUSTRY INTAKE TERMINAL
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
              Submit an Industry Problem Node
            </h2>
            <p className="text-muted-foreground mt-3 text-base sm:text-lg max-w-2xl mx-auto">
              Have a high-variance manufacturing defect, telemetry bottleneck, or process hurdle?
              Submit it directly into our academic triage pipeline.
            </p>
          </div>

          <Card className="rounded-3xl border-border/60 bg-card shadow-sm overflow-hidden p-6 sm:p-10">
            {successId ? (
              <div className="py-12 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Challenge Submitted Successfully!
                </h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  Your challenge has been registered in the Sarvottam repository. Faculty
                  supervisors will review technical feasibility and establish research methodology.
                </p>
                <div className="pt-4 flex items-center justify-center gap-3">
                  <Link
                    href="/dashboard/problems"
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs"
                  >
                    View in Dashboard
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSuccessId(null);
                      setFormData({
                        company: "",
                        sector: "Advanced Manufacturing",
                        problem: "",
                        outcome: "",
                        type: "RESEARCH_PROJECT",
                      });
                    }}
                    className="rounded-xl text-xs"
                  >
                    Submit Another
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-xs font-semibold uppercase font-mono">
                      Company / Organization Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="company"
                      placeholder="e.g. Apex Industrial Dynamics"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      className="rounded-xl bg-muted/30 border-border/60 text-sm h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector" className="text-xs font-semibold uppercase font-mono">
                      Industrial Sector <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full h-11 px-3 rounded-xl bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {SECTORS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-xs font-semibold uppercase font-mono">
                    Problem Statement & Operational Context{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="problem"
                    rows={4}
                    placeholder="Describe the technical or process bottleneck, where in the production or software line it occurs, and the current failure symptoms..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    required
                    className="rounded-xl bg-muted/30 border-border/60 text-sm resize-none leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome" className="text-xs font-semibold uppercase font-mono">
                    Target Quality Metric / Expected Outcome{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="outcome"
                    placeholder="e.g. Reduce defect variance by 18%, achieve sub-100ms sync latency, or implement ISO 9001 compliance audit model"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    required
                    className="rounded-xl bg-muted/30 border-border/60 text-sm h-11"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Protected under JAIN-IFQM Academic Confidentiality Agreement</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-xs"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting to Repository...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        {isLoggedIn ? "Submit Problem to Triage" : "Draft & Log In to Submit"}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
