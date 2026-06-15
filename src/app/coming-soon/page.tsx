"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Hammer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ComingSoonPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        className="w-full max-w-md p-6 z-10"
      >
        <Card className="rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl overflow-hidden">
          <CardHeader className="p-8 pb-6 text-center">
            <div className="mx-auto mb-4 h-16 w-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary ring-1 ring-primary/20">
              <Hammer className="h-8 w-8" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tight">Under Construction</CardTitle>
            <CardDescription className="text-sm font-medium mt-2">
              This feature is currently being built.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0 text-center space-y-6">
            <p className="text-muted-foreground font-medium text-sm">
              We are working hard to bring this feature to you as soon as possible. Please check back later!
            </p>
            
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="w-full p-6 text-base rounded-xl border-border/50 hover:bg-muted/50 transition-all group"
            >
              <ArrowLeft className="mr-2 h-5 w-5 text-muted-foreground group-hover:-translate-x-1 transition-transform" />
              Go Back
            </Button>

            <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
              <Link href="/" className="text-primary hover:underline">
                Return to Home
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
