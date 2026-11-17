"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronRight, Search, ShieldCheck, Sparkles, User } from "lucide-react";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Badge } from "@/components/ui/badge";

interface DashboardTopbarProps {
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export function DashboardTopbar({ user }: DashboardTopbarProps) {
  const pathname = usePathname();

  // Generate breadcrumb items from pathname
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((seg) => {
      // Clean up segment name
      return seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    });

  return (
    <header className="h-16 border-b border-border/40 bg-background/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Breadcrumb path */}
      <div className="flex items-center space-x-2 text-xs font-medium">
        <Link
          href="/dashboard"
          className="text-muted-foreground hover:text-foreground transition-colors font-mono font-semibold"
        >
          WORKSPACE
        </Link>
        {segments.slice(1).map((seg, i) => (
          <div key={i} className="flex items-center space-x-2">
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
            <span
              className={
                i === segments.length - 2
                  ? "text-foreground font-bold"
                  : "text-muted-foreground font-medium"
              }
            >
              {seg}
            </span>
          </div>
        ))}
      </div>

      {/* Right side telemetry & quick actions */}
      <div className="flex items-center space-x-3">
        {/* Node status indicator */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-[10px] font-mono font-semibold text-primary">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>SYS: ONLINE</span>
        </div>

        {/* Notifications Icon with indicator */}
        <Link
          href="/dashboard/notifications"
          className="h-8 w-8 rounded-lg border border-border/50 hover:bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors relative"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Link>

        {/* Theme switcher */}
        <ThemeToggle />

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-border/40">
          <div className="h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-foreground leading-tight truncate max-w-[120px]">
              {user?.name || "User"}
            </span>
            <span className="text-[9px] font-mono font-semibold text-muted-foreground uppercase">
              {user?.role || "STUDENT"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
