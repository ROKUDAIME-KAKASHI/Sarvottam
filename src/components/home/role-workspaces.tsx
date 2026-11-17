"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  Building2,
  ShieldAlert,
  ArrowRight,
  CheckCircle,
  Award,
  Layers,
  FileCheck,
  BarChart3,
  UserCheck,
} from "lucide-react";

const ROLES = [
  {
    id: "student",
    title: "Student Researcher",
    badge: "STUDENT NODE",
    icon: GraduationCap,
    headline: "Build a Verified Engineering Track Record Solving Live Industry Bottlenecks",
    desc: "Move beyond theoretical assignments. Apply to active research nodes mentored by university professors and funded by industrial leaders.",
    features: [
      "Live marketplace to browse open engineering & process challenges",
      "Gamified progression with XP levels and verifiable digital badges",
      "Direct supervision from specialized departmental faculty",
      "Direct placement pathway & industry portfolio review",
    ],
    demoEmail: "student1@jain.edu",
    workspaceUrl: "/dashboard",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "faculty",
    title: "Faculty Supervisor",
    badge: "ACADEMIC MENTOR",
    icon: Briefcase,
    headline: "Calibrate Industry Challenges with Academic Rigor & Supervise High-Impact Pods",
    desc: "Lead academic triage, shape research methodology, approve student applications, and publish co-authored industrial whitepapers.",
    features: [
      "Review and approve incoming industry challenge submissions",
      "Form student pods matching technical skills to project requirements",
      "Set sprint milestones, deliverable deadlines, and syllabus credits",
      "Track department-wide KPI metrics and research publications",
    ],
    demoEmail: "dr.smith@jain.edu",
    workspaceUrl: "/dashboard",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "industry",
    title: "Industry Partner",
    badge: "ENTERPRISE CLIENT",
    icon: Building2,
    headline: "Tap University Research Nodes to Solve Production, Quality & ESG Challenges",
    desc: "Post manufacturing bottlenecks, algorithm optimization challenges, and ESG reporting targets directly into our academic research pipeline.",
    features: [
      "Structured intake studio for logging problem statements and targets",
      "Multi-tier approval pipeline (Industry, Faculty, and Admin)",
      "Real-time milestone tracking and sprint deliverable reviews",
      "Audited quality handover compliant with IFQM and ISO standards",
    ],
    demoEmail: "tech@corp.com",
    workspaceUrl: "/dashboard",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    id: "admin",
    title: "System Governance",
    badge: "SUPERADMIN",
    icon: ShieldAlert,
    headline: "Institutional Governance, Cross-Departmental Auditing & KPI Oversight",
    desc: "Manage the ecosystem-wide parameters, department allocations, user roles, security audits, and institutional certifications.",
    features: [
      "Full administrative oversight across all problems, projects, and users",
      "Department and faculty assignment controls",
      "Organizational excellence frameworks and audit trail monitoring",
      "Comprehensive reporting on academic-industry collaboration metrics",
    ],
    demoEmail: "admin@jain.edu",
    workspaceUrl: "/dashboard",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];

interface RoleWorkspacesProps {
  isLoggedIn: boolean;
}

export function RoleWorkspaces({ isLoggedIn }: RoleWorkspacesProps) {
  const [selectedRoleId, setSelectedRoleId] = useState("student");
  const activeRole = ROLES.find((r) => r.id === selectedRoleId) || ROLES[0];

  return (
    <section className="py-20 md:py-28 bg-muted/20 border-b border-border/40 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4">
            <UserCheck className="h-3.5 w-3.5" />
            STAKEHOLDER OPERATIONAL ENGINES
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Built for Every Node in the Alliance
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            A cohesive system tailored to the exact operational needs of students, faculty,
            corporate partners, and university administrators.
          </p>
        </div>

        {/* Role Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-4xl mx-auto mb-10">
          {ROLES.map((role) => {
            const isSelected = selectedRoleId === role.id;
            const Icon = role.icon;

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRoleId(role.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border/60 bg-background/80 hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{role.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Role Interactive Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="rounded-3xl border-border/60 bg-card shadow-sm overflow-hidden p-6 sm:p-10">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                  <div className="space-y-4 max-w-xl">
                    <Badge variant="outline" className={`font-mono text-xs ${activeRole.bg}`}>
                      {activeRole.badge}
                    </Badge>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug">
                      {activeRole.headline}
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {activeRole.desc}
                    </p>

                    <div className="pt-4 space-y-2.5">
                      <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-3">
                        Core Platform Capabilities:
                      </h4>
                      {activeRole.features.map((feat, i) => (
                        <div
                          key={i}
                          className="flex items-start text-xs sm:text-sm text-foreground"
                        >
                          <CheckCircle className="h-4 w-4 mr-2.5 text-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Access Action Box */}
                  <div className="p-6 rounded-2xl border border-border/60 bg-muted/30 md:w-80 shrink-0 flex flex-col justify-between space-y-6">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                        Operational Workspace
                      </span>
                      <h4 className="text-base font-bold text-foreground">
                        {activeRole.title} Console
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        Access dedicated role views, action queues, and live reporting metrics.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-border/40 bg-background text-xs space-y-1 font-mono">
                      <span className="text-muted-foreground text-[10px] block">DEMO ACCOUNT:</span>
                      <span className="font-semibold text-foreground block truncate">
                        {activeRole.demoEmail}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        Pass: <code className="text-foreground font-bold">password123</code>
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href={
                          isLoggedIn
                            ? activeRole.workspaceUrl
                            : `/login?email=${activeRole.demoEmail}`
                        }
                        className={buttonVariants({
                          className: "w-full rounded-xl text-xs font-semibold shadow-xs",
                        })}
                      >
                        {isLoggedIn ? "Open Dashboard" : "Log In as " + activeRole.title}
                        <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                      </Link>
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
