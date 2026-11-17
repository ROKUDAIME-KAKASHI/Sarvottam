"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  GraduationCap,
  Cpu,
  CheckCircle2,
  Workflow,
  ArrowRight,
  ShieldCheck,
  FileCode,
  Terminal,
  Layers,
} from "lucide-react";

const PIPELINE_STAGES = [
  {
    id: "intake",
    step: "01",
    title: "Industry Intake & Telemetry",
    subtitle: "Real-World Bottleneck Ingestion",
    icon: Factory,
    actor: "Industry Partner (IFQM Network)",
    objective:
      "Manufacturing plants and enterprise partners log recurring quality bottlenecks, yield variances, or legacy workflow friction into the ecosystem.",
    inputs: [
      "Assembly line defect rates & telemetry logs",
      "Supply chain variance & lead time metrics",
      "Process tolerance & regulatory compliance constraints",
    ],
    qualityGate: "Intake Schema Validation & Priority Level Scoring",
    output: "Formal Ecosystem Challenge Node (e.g. CHAL-084)",
    badgeColor: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  },
  {
    id: "scoping",
    step: "02",
    title: "Faculty Scrutiny & Academic Scoping",
    subtitle: "Methodological Calibration",
    icon: GraduationCap,
    actor: "University Faculty Supervisors",
    objective:
      "Experienced professors analyze root causes, map relevant academic literature, define engineering methodologies, and establish credit weight.",
    inputs: [
      "Cross-departmental feasibility analysis",
      "Mathematical modeling & simulation requirements",
      "Student skill matrix definition (AI, Robotics, IoT)",
    ],
    qualityGate: "Academic Integrity & Peer-Review Scoping Gate",
    output: "Verified Research Workspace Specification",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  },
  {
    id: "execution",
    step: "03",
    title: "Student Node Execution & Sprints",
    subtitle: "Supervised Prototype Engineering",
    icon: Cpu,
    actor: "Student Engineering Pods",
    objective:
      "Cross-functional student squads build proof-of-concepts, write predictive algorithms, simulate workflows, and participate in mentor check-ins.",
    inputs: [
      "Agile 2-week research sprint deliverables",
      "Code repository commits & physical prototype testing",
      "Gamified progress tracking with XP & Milestone Badges",
    ],
    qualityGate: "Continuous Mentor Audit & Deliverable Verification",
    output: "Tested Functional Model & Research Paper Draft",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  },
  {
    id: "handover",
    step: "04",
    title: "IFQM Quality Validation & Handover",
    subtitle: "Industrial Benchmark Deployment",
    icon: ShieldCheck,
    actor: "IFQM Audit Board & Enterprise Leadership",
    objective:
      "The final solution is benchmarked against Six Sigma DMAIC, ISO 9001/14001, and Total Quality Management (TQM) standards for enterprise rollout.",
    inputs: [
      "Pilot test telemetry & error-rate reduction metrics",
      "Cost-benefit & ESG sustainability impact analysis",
      "Enterprise deployment documentation & IP sign-off",
    ],
    qualityGate: "Final Quality Excellence & Production Handover Seal",
    output: "Verifiable Digital Certificate & Enterprise Deployment",
    badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  },
];

export function SystemPipeline() {
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const currentStage = PIPELINE_STAGES[activeStageIndex];

  return (
    <section className="py-20 md:py-28 bg-background border-b border-border/40 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4">
            <Workflow className="h-3.5 w-3.5" />
            END-TO-END EXECUTION LIFECYCLE
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            The Sarvottam Quality Engine
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            How a raw factory or enterprise problem transforms into a peer-reviewed,
            industry-audited solution through academic collaboration.
          </p>
        </div>

        {/* Pipeline Stage Buttons */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-5xl mx-auto mb-8">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isSelected = activeStageIndex === idx;

            return (
              <button
                key={stage.id}
                onClick={() => setActiveStageIndex(idx)}
                className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-32 relative ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm ring-1 ring-primary/30"
                    : "border-border/60 bg-card/60 hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    STAGE {stage.step}
                  </span>
                  <Icon
                    className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                  />
                </div>
                <div>
                  <h3
                    className={`text-sm font-bold leading-tight ${
                      isSelected ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stage.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {stage.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Stage Interactive Console */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-2xl border-border/60 bg-card shadow-sm overflow-hidden">
                <div className="p-6 sm:p-8">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/40">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs font-semibold ${currentStage.badgeColor}`}
                        >
                          STAGE {currentStage.step} // {currentStage.actor}
                        </Badge>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                        {currentStage.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <span className="text-xs font-mono text-muted-foreground">
                        {activeStageIndex + 1} of {PIPELINE_STAGES.length}
                      </span>
                      <div className="flex gap-1">
                        <button
                          disabled={activeStageIndex === 0}
                          onClick={() => setActiveStageIndex((prev) => Math.max(0, prev - 1))}
                          className="px-2.5 py-1 text-xs rounded-lg border border-border/60 disabled:opacity-40 hover:bg-muted cursor-pointer font-mono"
                        >
                          PREV
                        </button>
                        <button
                          disabled={activeStageIndex === PIPELINE_STAGES.length - 1}
                          onClick={() =>
                            setActiveStageIndex((prev) =>
                              Math.min(PIPELINE_STAGES.length - 1, prev + 1)
                            )
                          }
                          className="px-2.5 py-1 text-xs rounded-lg border border-border/60 disabled:opacity-40 hover:bg-muted cursor-pointer font-mono"
                        >
                          NEXT
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
                    {/* Main Description */}
                    <div className="md:col-span-2 space-y-5">
                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                          Operational Objective
                        </h4>
                        <p className="text-sm sm:text-base text-foreground/90 leading-relaxed font-medium">
                          {currentStage.objective}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2.5">
                          Required Inputs & Telemetry
                        </h4>
                        <ul className="space-y-2">
                          {currentStage.inputs.map((inp, i) => (
                            <li
                              key={i}
                              className="flex items-start text-xs sm:text-sm text-muted-foreground"
                            >
                              <CheckCircle2 className="h-4 w-4 mr-2.5 text-emerald-500 shrink-0 mt-0.5" />
                              <span>{inp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Quality Gate & Output Card */}
                    <div className="space-y-4 p-5 rounded-xl border border-border/60 bg-muted/30">
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                          Quality Verification Gate
                        </span>
                        <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                          <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                          <span>{currentStage.qualityGate}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/40">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                          Stage Output Artifact
                        </span>
                        <div className="flex items-center gap-2 text-xs font-mono font-bold text-foreground">
                          <FileCode className="h-4 w-4 text-blue-500 shrink-0" />
                          <span>{currentStage.output}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/40">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                          Platform Automation
                        </span>
                        <div className="text-[11px] text-muted-foreground leading-snug">
                          Automated status notifications, role-based audit trail logging, and XP
                          allocation triggers execute on transition.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
