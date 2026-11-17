"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Activity,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SystemHeroProps {
  stats: {
    problemsCount: number;
    projectsCount: number;
    departmentsCount: number;
    usersCount: number;
  };
  isLoggedIn: boolean;
}

const DEMO_ACCOUNTS = [
  {
    role: "Super Admin",
    email: "admin@jain.edu",
    desc: "Oversees cross-institutional governance, department KPIs, and final challenge approvals.",
  },
  {
    role: "Faculty Mentor",
    email: "dr.smith@jain.edu",
    desc: "Triage industry submissions, assigns research methodologies, and supervises student pods.",
  },
  {
    role: "Industry Partner",
    email: "tech@corp.com",
    desc: "Submits manufacturing & process bottlenecks, reviews prototypes, and receives audited deliverables.",
  },
  {
    role: "Student Researcher",
    email: "student1@jain.edu",
    desc: "Applies to research nodes, solves real industrial challenges, and earns verifiable credentials.",
  },
];

export function SystemHero({ stats, isLoggedIn }: SystemHeroProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  return (
    <section className="relative w-full pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden border-b border-border/40 bg-radial-[at_50%_0%] from-primary/5 via-background to-background">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_10%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
        {/* System Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-background/80 backdrop-blur-md text-xs font-mono mb-8 shadow-xs"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-muted-foreground">NODE: JAIN × IFQM PROTOCOL</span>
          <span className="text-border">|</span>
          <span className="text-primary font-semibold">LIVE PRODUCTION SYSTEM</span>
        </motion.div>

        {/* Concrete, Unslopped Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.15 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground max-w-5xl leading-[1.12]"
        >
          Real Industry Quality Challenges. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 dark:from-primary dark:via-blue-400 dark:to-sky-300">
            Solved by Academic Research Nodes.
          </span>
        </motion.h1>

        {/* Precise Mission Statement */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15, type: "spring", bounce: 0.15 }}
          className="mt-6 text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed"
        >
          Sarvottam is the operational bridge between the{" "}
          <strong className="text-foreground font-semibold">
            Indian Foundation for Quality Management (IFQM)
          </strong>{" "}
          and <strong className="text-foreground font-semibold">JAIN University</strong>. Industry
          partners submit active manufacturing and process bottlenecks; faculty triage and scope
          rigorous methodologies; student pods build, validate, and deploy audited solutions.
        </motion.p>

        {/* Action Button Strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, type: "spring", bounce: 0.15 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <a
            href="#explorer"
            className={buttonVariants({
              size: "lg",
              className: "h-12 px-6 rounded-xl font-medium shadow-sm hover:shadow transition-all",
            })}
          >
            Explore Live Workspaces
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>

          <Link
            href="/problems"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "h-12 px-6 rounded-xl border-border bg-background/60 backdrop-blur-sm hover:bg-muted/60 transition-all",
            })}
          >
            <Building2 className="mr-2 h-4 w-4 text-primary" />
            Submit Industry Challenge
          </Link>

          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "secondary",
                size: "lg",
                className: "h-12 px-6 rounded-xl transition-all",
              })}
            >
              Enter Dashboard
            </Link>
          ) : (
            <Dialog>
              <DialogTrigger
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className:
                    "h-12 px-6 rounded-xl border border-border/40 transition-all cursor-pointer",
                })}
              >
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                Demo Credentials
              </DialogTrigger>
              <DialogContent className="max-w-lg bg-card text-card-foreground border-border rounded-2xl p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Quick Demo Access Credentials
                  </DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground mb-4">
                  All accounts share the default password:{" "}
                  <code className="px-2 py-0.5 rounded bg-muted font-mono font-bold text-foreground">
                    password123
                  </code>
                  . Click any email to copy and log in immediately.
                </p>
                <div className="space-y-3">
                  {DEMO_ACCOUNTS.map((acc) => (
                    <div
                      key={acc.email}
                      className="p-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 transition-colors flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-semibold">
                            {acc.role}
                          </Badge>
                          <span className="font-mono text-sm font-semibold text-foreground">
                            {acc.email}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1.5 leading-snug">
                          {acc.desc}
                        </p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(acc.email)}
                        className="p-2 rounded-lg hover:bg-background border border-border/40 text-muted-foreground hover:text-foreground transition-all shrink-0 cursor-pointer"
                        title="Copy email"
                      >
                        {copiedEmail === acc.email ? (
                          <Check className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <Link
                    href="/login"
                    className={buttonVariants({
                      className: "w-full rounded-xl",
                    })}
                  >
                    Go to Login Screen <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>

        {/* Live System Telemetry Strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, type: "spring", bounce: 0.15 }}
          className="mt-14 w-full max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left"
        >
          <div className="p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Challenges</span>
              <Activity className="h-4 w-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.problemsCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Live industry submissions</div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Workspaces</span>
              <Layers className="h-4 w-4 text-indigo-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.projectsCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Active research projects</div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Departments</span>
              <GraduationCap className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.departmentsCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Engineering nodes linked</div>
          </div>

          <div className="p-4 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-xs font-mono uppercase tracking-wider">Verified Users</span>
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {stats.usersCount}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Faculty, partners & students</div>
          </div>
        </motion.div>

        {/* Founding Institutions */}
        <div className="mt-16 pt-10 border-t border-border/40 w-full max-w-3xl flex flex-col items-center">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-6">
            Institutional Foundation & Alliance
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-90 hover:opacity-100 transition-opacity">
            <div className="relative h-16 w-48 sm:h-20 sm:w-56">
              <Image
                src="/jain-university-logo-png_seeklogo-432784.png"
                alt="JAIN (Deemed-to-be University)"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-10 w-px bg-border hidden sm:block" />
            <div className="relative h-16 w-48 sm:h-20 sm:w-56">
              <Image
                src="/0_Logo-IFQM.png"
                alt="Indian Foundation for Quality Management (IFQM)"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
