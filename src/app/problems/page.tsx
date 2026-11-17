"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Upload,
  Building2,
  Factory,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { createProblem } from "@/app/actions/problems";
import Link from "next/link";

const SECTORS = [
  "Advanced Manufacturing",
  "Automotive & Electric Vehicles",
  "Supply Chain & Operations",
  "IoT, Edge & Cyber-Physical Systems",
  "Energy, Utilities & ESG",
  "Chemical & Materials Engineering",
  "Software QA & Telemetry",
];

const PROBLEM_TYPES = [
  { value: "PROCESS", label: "Process Quality & Yield Bottleneck" },
  { value: "TECHNOLOGY", label: "Hardware / IoT / Telemetry Defect" },
  { value: "PEOPLE", label: "Workforce & Operational Training Gap" },
  { value: "BUSINESS", label: "Supply Chain / Quality Cost Variance" },
  { value: "COMPLIANCE", label: "Regulatory / ISO / ESG Audit Variance" },
];

export default function ProblemsPortal() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    company: "",
    sector: "Advanced Manufacturing",
    type: "PROCESS",
    problem: "",
    outcome: "",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    if (!formData.company.trim() || !formData.sector.trim() || !formData.problem.trim()) {
      setError("Please fill in all required fields.");
      setIsPending(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        // Append attachment note if file was uploaded
        outcome: attachedFile
          ? `${formData.outcome}\n\n[Attachment: ${attachedFile.name} (${(attachedFile.size / 1024).toFixed(1)} KB)]`
          : formData.outcome,
      };

      const res = await createProblem(payload);

      if (res.error) {
        if (res.error.includes("log in")) {
          router.push("/login?callbackUrl=/problems");
        } else {
          setError(res.error);
          setIsPending(false);
        }
      } else {
        setSubmittedId(res.problemId || "success");
        setIsPending(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to submit challenge.");
      setIsPending(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-20 md:py-24 max-w-4xl">
        <div className="text-center mb-12 space-y-3">
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-mono font-semibold border-primary/30 bg-primary/10 text-primary backdrop-blur-md rounded-full"
          >
            <Factory className="w-3.5 h-3.5 mr-1.5 inline-block text-primary" />
            INDUSTRY INTAKE TERMINAL
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Industry Problem Intake Portal
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Submit your manufacturing, quality, and operational bottlenecks. University faculty and
            specialized research pods will calibrate methodology and build deployable solutions.
          </p>
        </div>

        {submittedId ? (
          <Card className="rounded-3xl border-border/60 bg-card p-8 sm:p-12 text-center shadow-sm space-y-6">
            <div className="h-16 w-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                SUBMISSION REGISTERED IN CLOUD DB
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Challenge Ingested into Sarvottam Pipeline
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Your submission has been prioritized for academic triage. University faculty will
              review technical scope and establish research pod allocations. You earned{" "}
              <strong className="text-foreground">+50 XP</strong> on the platform.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/dashboard/problems"
                className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-xs"
              >
                Inspect in Operational Dashboard
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSubmittedId(null);
                  setAttachedFile(null);
                  setFormData({
                    company: "",
                    sector: "Advanced Manufacturing",
                    type: "PROCESS",
                    problem: "",
                    outcome: "",
                  });
                }}
                className="rounded-xl text-xs"
              >
                Submit Another Challenge
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="rounded-3xl border-border/60 bg-card shadow-sm overflow-hidden p-6 sm:p-10">
            <CardHeader className="p-0 pb-6 border-b border-border/40">
              <CardTitle className="text-xl sm:text-2xl font-bold">
                Log New Quality Challenge
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground">
                Provide comprehensive technical context. All data is governed under the JAIN-IFQM
                Academic Confidentiality Agreement.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-destructive/10 text-destructive p-4 rounded-xl text-xs font-semibold border border-destructive/20 flex items-start gap-2.5">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-xs font-mono font-semibold uppercase">
                      Company / Plant Name <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Tata Advanced Systems, Bharat Forge..."
                        required
                        className="pl-10 h-11 rounded-xl bg-muted/30 border-border/60 text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sector" className="text-xs font-mono font-semibold uppercase">
                      Industrial Sector <span className="text-destructive">*</span>
                    </Label>
                    <select
                      id="sector"
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full h-11 px-3.5 rounded-xl bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {SECTORS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="text-xs font-mono font-semibold uppercase">
                    Challenge Domain / Area <span className="text-destructive">*</span>
                  </Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full h-11 px-3.5 rounded-xl bg-muted/30 border border-border/60 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {PROBLEM_TYPES.map((pt) => (
                      <option key={pt.value} value={pt.value}>
                        {pt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="problem" className="text-xs font-mono font-semibold uppercase">
                    Problem Statement & Operational Context{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="problem"
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    placeholder="Detail the quality variance, assembly line bottleneck, or data telemetry failure. Include operating conditions, frequency of defect, and business impact..."
                    rows={5}
                    required
                    className="rounded-xl bg-muted/30 border-border/60 text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="outcome" className="text-xs font-mono font-semibold uppercase">
                    Target Quality Benchmark / Expected Metric{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="outcome"
                    value={formData.outcome}
                    onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                    placeholder="e.g. Reduce rejection rate from 4.2% to <0.5%, achieve sub-50ms sync, or implement Six Sigma DMAIC control"
                    required
                    className="h-11 rounded-xl bg-muted/30 border-border/60 text-sm"
                  />
                </div>

                {/* Supporting Telemetry / Document Attachment */}
                <div className="space-y-2">
                  <Label className="text-xs font-mono font-semibold uppercase">
                    Supporting Telemetry or Spec Sheet (Optional)
                  </Label>
                  {attachedFile ? (
                    <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/40 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-foreground">{attachedFile.name}</span>
                        <span className="text-muted-foreground">
                          ({(attachedFile.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAttachedFile(null)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative border-2 border-dashed border-border/60 hover:border-primary/50 transition-colors rounded-2xl p-6 text-center bg-muted/20">
                      <Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
                      <p className="text-xs font-semibold text-foreground">
                        Click or drag to attach defect log, dataset, or technical specs
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        PDF, CSV, XLSX, or DOCX up to 15MB
                      </p>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.csv,.xlsx,.xls,.docx,.txt"
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Audited under JAIN-IFQM Governance Standards</span>
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full sm:w-auto h-12 px-8 rounded-xl font-semibold shadow-xs"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Transmitting to Workflow...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Challenge to Triage
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
