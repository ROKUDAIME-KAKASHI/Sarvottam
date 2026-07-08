"use client";

import { useActionState } from "react";
import { motion } from "framer-motion";
import { logOutAction } from "./actions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { LogOut, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function LogoutPage() {
  const [, formAction, isPending] = useActionState(logOutAction, undefined);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", bounce: 0.4 }}
        className="w-full max-w-sm p-6 z-10"
      >
        <Card className="rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardHeader className="p-8 pb-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 ring-1 ring-red-500/20">
              <LogOut className="h-8 w-8 ml-1" />
            </div>
            <CardTitle className="text-2xl font-black tracking-tight">Sign Out</CardTitle>
            <CardDescription className="text-sm font-medium mt-2">
              Are you sure you want to log out of your account?
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 space-y-4">
            <form action={formAction}>
              <Button
                type="submit"
                variant="destructive"
                disabled={isPending}
                className="w-full p-6 text-base rounded-xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all group"
              >
                {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : "Yes, sign me out"}
              </Button>
            </form>

            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "outline",
                className:
                  "w-full p-6 text-base rounded-xl bg-background border-border/50 hover:bg-muted/50 transition-all block text-center",
              })}
            >
              <div className="flex items-center justify-center">
                <ArrowLeft className="h-4 w-4 mr-2" />
                No, return to dashboard
              </div>
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
