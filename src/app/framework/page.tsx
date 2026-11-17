"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Workflow,
  Target,
  BarChart,
  Cpu,
  Sprout,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Layers,
  GraduationCap,
  Building2,
  Users,
  Award,
} from "lucide-react";

const FRAMEWORK_PILLARS = [
  {
    id: "ingestion",
    phase: "PHASE 01",
    title: "Problem Intake & Telemetry Ingestion",
    methodology: "DMAIC: Define & Measure",
    icon: Target,
    objective:
      "Industry partners submit real-world quality variances, assembly line bottlenecks, or telemetry deficits into the platform.",
    deliverables: [
      "Standardized problem statement with operational boundary",
      "Defect frequency, yield impact & baseline telemetry data",
      "Confidentiality & intellectual property tier assignment",
    ],
    qualityGate: "Intake Schema Verification & Priority Severity Scoring",
  },
  {
    id: "scoping",
    phase: "PHASE 02",
    title: "Academic Calibration & Research Scoping",
    methodology: "DMAIC: Analyze & Hypothesis",
    icon: GraduationCap,
    objective:
      "JAIN University faculty supervisors review submissions against peer-reviewed academic literature and assign technical student squad requirements.",
    deliverables: [
      "Literature review & theoretical model mapping",
      "Student squad skill requirements matrix (e.g. AI, CAD, IoT)",
      "Curriculum syllabus credit & milestone schedule definition",
    ],
    qualityGate: "Faculty Academic Integrity & Feasibility Review Gate",
  },
  {
    id: "engineering",
    phase: "PHASE 03",
    title: "Student Node Sprint & Solution Engineering",
    methodology: "DMAIC: Improve & Validate",
    icon: Cpu,
    objective:
      "Cross-functional student pods build proof-of-concepts, write optimization algorithms, test simulations, and attend weekly mentor standups.",
    deliverables: [
      "Sprint pull requests, hardware models & codebase commits",
      "Mentor checkpoint reviews & mid-term deliverable audits",
      "Gamified student XP points, skill endorsements & badges",
    ],
    qualityGate: "Continuous Mentor Audit & Benchmarking Evaluation",
  },
  {
    id: "handover",
    phase: "PHASE 04",
    title: "IFQM Quality Audit & Industrial Handover",
    methodology: "DMAIC: Control & Standardize",
    icon: ShieldCheck,
    objective:
      "The deliverable is benchmarked against Six Sigma and Total Quality Management (TQM) standards by the IFQM Board before final enterprise deployment.",
    deliverables: [
      "Audited error-rate reduction & performance validation report",
      "Co-authored academic paper or patent draft (where applicable)",
      "Verifiable Digital Certificate of Quality Excellence",
    ],
    qualityGate: "IFQM Production Readiness & Institutional Quality Seal",
  },
];

const MATURITY_LEVELS = [
  {
    level: "Level 1",
    name: "Ad-Hoc / Reactive",
    desc: "Quality issues addressed reactively after failure; no structured academic linkage.",
  },
  {
    level: "Level 2",
    name: "Logged & Scoped",
    desc: "Problems systematically cataloged and assigned to departmental faculty for review.",
  },
  {
    level: "Level 3",
    name: "Pod Execution",
    desc: "Cross-functional student squads execute targeted sprint deliverables under mentor supervision.",
  },
  {
    level: "Level 4",
    name: "Audited & Certified",
    desc: "Solutions benchmarked against Six Sigma / TQM standards and certified by IFQM.",
  },
  {
    level: "Level 5",
    name: "Predictive & Sustainable",
    desc: "Real-time edge telemetry and ESG lifecycle accounting continuously prevent regressions.",
  },
];

export default function FrameworkPage() {
  const [selectedPhase, setSelectedPhase] = useState(0);
  const currentPillar = FRAMEWORK_PILLARS[selectedPhase];

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-20 md:py-24 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-mono font-semibold border-primary/30 bg-primary/10 text-primary backdrop-blur-md rounded-full"
          >
            <Workflow className="w-3.5 h-3.5 mr-1.5 inline-block text-primary" />
            GOVERNED ALLIANCE METHODOLOGY
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            The Sarvottam Quality Framework
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium">
            A structured, 4-stage engineering lifecycle harmonizing academic research depth with
            industrial quality precision. Built in collaboration between JAIN University and IFQM.
          </p>
        </div>

        {/* Interactive Phase Controller */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {FRAMEWORK_PILLARS.map((pillar, idx) => {
              const isSelected = selectedPhase === idx;
              const Icon = pillar.icon;

              return (
                <button
                  key={pillar.id}
                  onClick={() => setSelectedPhase(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between h-28 ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/30"
                      : "border-border/60 bg-card hover:bg-muted/50 text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {pillar.phase}
                    </span>
                    <Icon
                      className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </div>
                  <div className="text-xs font-bold text-foreground leading-tight truncate">
                    {pillar.title}
                  </div>
                </button>
              );
            })}
          </div>

          <Card className="rounded-3xl border-border/60 bg-card shadow-sm p-6 sm:p-10">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-border/40">
                <div>
                  <Badge variant="outline" className="font-mono text-xs font-semibold mb-2">
                    {currentPillar.phase} // {currentPillar.methodology}
                  </Badge>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                    {currentPillar.title}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1.5">
                      Stage Purpose & Operations
                    </h4>
                    <p className="text-sm sm:text-base text-foreground leading-relaxed">
                      {currentPillar.objective}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                      Key Deliverables & Artifacts
                    </h4>
                    <ul className="space-y-2">
                      {currentPillar.deliverables.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start text-xs sm:text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-border/60 bg-muted/30 space-y-4 text-xs">
                  <div>
                    <span className="font-mono uppercase text-muted-foreground text-[10px] block mb-1">
                      Quality Gate
                    </span>
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{currentPillar.qualityGate}</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/40">
                    <span className="font-mono uppercase text-muted-foreground text-[10px] block mb-1">
                      Governance Compliance
                    </span>
                    <p className="text-muted-foreground leading-snug">
                      ISO 9001 / Six Sigma DMAIC documentation signed off by university and
                      corporate evaluators.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Quality Maturity Scale */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Institutional Quality Maturity Index
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              How participating industry partners and research nodes measure progress.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {MATURITY_LEVELS.map((mat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border border-border/60 bg-card flex flex-col justify-between space-y-3"
              >
                <div>
                  <Badge variant="outline" className="text-[10px] font-mono mb-2">
                    {mat.level}
                  </Badge>
                  <h4 className="text-sm font-bold text-foreground">{mat.name}</h4>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{mat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="max-w-4xl mx-auto text-center p-8 sm:p-12 rounded-3xl border border-border/60 bg-card shadow-xs space-y-5">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Deploy the Sarvottam Framework in Your Node
          </h3>
          <p className="text-sm text-muted-foreground max-w-xl mx-auto">
            Whether you are an industry plant seeking defect elimination or an academic department
            aiming for high-impact research, the ecosystem is live and active.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/problems"
              className={buttonVariants({
                size: "lg",
                className: "h-11 px-6 rounded-xl font-semibold shadow-xs text-xs",
              })}
            >
              Submit an Industry Problem <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
            <Link
              href="/research"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className: "h-11 px-6 rounded-xl text-xs",
              })}
            >
              Browse Research Marketplace
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
