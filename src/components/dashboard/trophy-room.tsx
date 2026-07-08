"use client";

import { motion } from "framer-motion";

export interface BadgeData {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  earned: boolean;
  earnedAt?: Date;
}

interface TrophyRoomProps {
  badges: BadgeData[];
}

export function TrophyRoom({ badges }: TrophyRoomProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-background/50 p-6 backdrop-blur-xl">
      <h3 className="mb-6 text-lg font-semibold text-foreground">Trophy Room 🏆</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring", bounce: 0.2 }}
            className={`flex flex-col items-center rounded-xl border p-4 text-center transition-all ${
              badge.earned
                ? "border-primary/30 bg-primary/5 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                : "border-border/50 bg-secondary/10 opacity-50 grayscale"
            }`}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-inner">
              {badge.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={badge.imageUrl} alt={badge.name} className="h-8 w-8 object-contain" />
              ) : (
                <span className="text-xl">{badge.earned ? "🏅" : "🔒"}</span>
              )}
            </div>
            <h4 className="text-sm font-medium">{badge.name}</h4>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{badge.description}</p>
          </motion.div>
        ))}
        {badges.length === 0 && (
          <div className="col-span-full py-8 text-center text-muted-foreground">
            No badges available yet.
          </div>
        )}
      </div>
    </div>
  );
}
