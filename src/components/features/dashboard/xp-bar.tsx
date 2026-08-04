"use client";

import { motion } from "framer-motion";

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
}

export function XPBar({ currentXP, nextLevelXP, level }: XPBarProps) {
  const progress = Math.min((currentXP / Math.max(nextLevelXP, 1)) * 100, 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-background/50 p-6 backdrop-blur-xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Level {level}</h3>
          <p className="text-sm text-muted-foreground">
            {currentXP} / {nextLevelXP} XP
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
          <span className="text-lg font-bold">✨</span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="h-4 w-full overflow-hidden rounded-full bg-secondary/30">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ type: "spring", bounce: 0.15, duration: 1.5 }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
        />
      </div>

      <p className="mt-2 text-right text-xs text-muted-foreground">
        {Math.max(nextLevelXP - currentXP, 0)} XP to next level
      </p>
    </div>
  );
}
