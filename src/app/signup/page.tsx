"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { registerUser } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Loader2, Mail, AlertCircle, Lock, User, Briefcase } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(
    registerUser,
    { error: "" }
  );

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden py-12">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md p-6 z-10"
      >
        <Card className="rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardHeader className="p-8 pb-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/20">
              <Logo className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">Create Account</CardTitle>
            <CardDescription className="text-sm font-medium mt-2">
              Join the Sarvottam research ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <form action={formAction} className="space-y-5">
              <div className="space-y-4">
                
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/60" />
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Aarav Sharma"
                      required
                      className="w-full pl-11 p-3.5 rounded-xl bg-muted/30 border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/60" />
                    <input
                      type="email"
                      name="email"
                      placeholder="student@jain.edu"
                      required
                      className="w-full pl-11 p-3.5 rounded-xl bg-muted/30 border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/60" />
                    <input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="w-full pl-11 p-3.5 rounded-xl bg-muted/30 border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Select Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground/60" />
                    <select
                      name="role"
                      required
                      className="w-full pl-11 p-3.5 rounded-xl bg-muted/30 border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 focus:bg-background outline-none transition-all appearance-none"
                    >
                      <option value="" disabled selected>Select your role...</option>
                      <option value="STUDENT">Student / Researcher</option>
                      <option value="FACULTY">Faculty / Mentor</option>
                      <option value="INDUSTRY_PARTNER">Industry Partner</option>
                    </select>
                  </div>
                </div>

              </div>

              {state?.error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-sm font-medium text-red-500 bg-red-500/10 p-3 rounded-lg"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{state.error}</p>
                </motion.div>
              )}

              <Button 
                type="submit" 
                disabled={isPending}
                className="w-full p-6 text-base rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all group"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm font-medium text-muted-foreground">
              <p>Already have an account? <Link href="/login" className="text-primary hover:underline">Sign In</Link></p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
