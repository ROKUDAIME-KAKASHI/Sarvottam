"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Save, Shield, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "./actions";

interface ProfileFormProps {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: string;
    skills: string | null;
    portfolioUrl: string | null;
  };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [skills, setSkills] = useState(user.skills || "");
  const [portfolioUrl, setPortfolioUrl] = useState(user.portfolioUrl || "");
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setMessage(null);

    try {
      await updateProfile({ name, skills, portfolioUrl });
      setMessage({ type: "success", text: "Changes saved" });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to save changes",
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      <div className="flex flex-col justify-between items-start gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-foreground">My Profile</h2>
          <p className="text-muted-foreground font-medium">
            Manage your personal information and preferences.
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl shadow-xl">
          <CardHeader className="p-8 border-b border-border/50 flex flex-row items-center gap-6">
            <div className="h-24 w-24 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/20">
              <User className="h-12 w-12" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl font-bold truncate">{user.name || "User"}</CardTitle>
              <CardDescription className="text-sm font-semibold flex items-center gap-2 mt-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                {user.role}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </label>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/50 font-medium text-foreground truncate">
                    {user.email}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full p-3 rounded-xl bg-background border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    required
                    minLength={2}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Skills
                  </label>
                  <input
                    type="text"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, Python"
                    className="w-full p-3 rounded-xl bg-background border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Portfolio URL
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-3 rounded-xl bg-background border border-border/50 font-medium text-foreground focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border/50">
                <div className="flex-1">
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`text-sm font-medium flex items-center gap-2 ${
                        message.type === "success" ? "text-emerald-500" : "text-red-500"
                      }`}
                    >
                      {message.type === "success" && <CheckCircle2 className="h-4 w-4" />}
                      {message.text}
                    </motion.div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={
                    isPending ||
                    (name === user.name &&
                      skills === user.skills &&
                      portfolioUrl === user.portfolioUrl)
                  }
                  className="rounded-xl shadow-lg shadow-primary/20 min-w-[140px]"
                >
                  {isPending ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
