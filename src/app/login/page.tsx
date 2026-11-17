"use client";

import { useActionState, useState } from "react";
import { motion } from "framer-motion";
import { authenticate } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import {
  Loader2,
  Mail,
  AlertCircle,
  Lock,
  ShieldCheck,
  UserCheck,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";

const DEMO_ACCOUNTS = [
  { role: "Superadmin", email: "admin@jain.edu", icon: ShieldCheck },
  { role: "Faculty Lead", email: "faculty@jain.edu", icon: UserCheck },
  { role: "Student", email: "student@jain.edu", icon: GraduationCap },
  { role: "Industry Partner", email: "partner@industry.com", icon: Briefcase },
];

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(authenticate, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fillCredentials = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("password123");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-12 px-4">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10 space-y-4"
      >
        <Card className="rounded-3xl border-border/60 bg-card/90 backdrop-blur-xl shadow-xl overflow-hidden">
          <CardHeader className="p-8 pb-4 text-center">
            <div className="mx-auto mb-3 h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/20">
              <Logo className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Ecosystem Sign In
            </CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium mt-1">
              JAIN University x IFQM Quality Governance Portal
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-2">
            <form action={formAction} className="space-y-4">
              <div className="space-y-3">
                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-0.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@jain.edu"
                      required
                      className="w-full pl-10 pr-3 h-11 text-sm rounded-xl bg-muted/30 border border-border/70 font-medium text-foreground focus:ring-2 focus:ring-primary/40 focus:bg-background outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pl-0.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground/60" />
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full pl-10 pr-3 h-11 text-sm rounded-xl bg-muted/30 border border-border/70 font-medium text-foreground focus:ring-2 focus:ring-primary/40 focus:bg-background outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {errorMessage && (
                <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-11 text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In to Workspace"}
              </Button>
            </form>

            {/* 1-Click Demo Fill */}
            <div className="mt-6 pt-5 border-t border-border/60">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block text-center mb-2.5">
                Quick Demo Sign-In
              </span>
              <div className="grid grid-cols-2 gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => fillCredentials(acc.email)}
                    className="flex items-center gap-2 p-2 rounded-lg border border-border/70 bg-muted/30 hover:bg-primary/10 hover:border-primary/40 text-xs font-medium text-foreground transition-all text-left cursor-pointer"
                  >
                    <acc.icon className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{acc.role}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 text-center text-xs font-medium text-muted-foreground">
              <p>
                Need to create a new profile?{" "}
                <Link href="/signup" className="text-primary hover:underline font-semibold">
                  Register
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
