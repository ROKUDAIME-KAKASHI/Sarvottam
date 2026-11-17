import Link from "next/link";
import { Logo } from "@/components/logo";
import { Activity, ShieldCheck, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm text-foreground py-12 md:py-16">
      <div className="mx-auto w-full max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-border/40">
          {/* Brand & Partnership Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-extrabold text-xl tracking-tight">Sarvottam</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              The collaborative ecosystem bridging academia and industry. Transforming real-world
              manufacturing, IoT, and process quality challenges into peer-reviewed research
              solutions.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                SYSTEM PRODUCTION ONLINE
              </span>
              <span className="text-xs text-muted-foreground font-mono">v2.4.0</span>
            </div>
          </div>

          {/* Directory Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Discovery Portals
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li>
                <Link href="/framework" className="hover:text-primary transition-colors">
                  Quality Framework
                </Link>
              </li>
              <li>
                <Link href="/problems" className="hover:text-primary transition-colors">
                  Industry Problem Portal
                </Link>
              </li>
              <li>
                <Link href="/research" className="hover:text-primary transition-colors">
                  Research Marketplace
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-primary transition-colors">
                  Operational Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Directory Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Quality Methodologies
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Total Quality Management
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Six Sigma DMAIC
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  Industry 4.0 Telemetry
                </span>
              </li>
              <li>
                <span className="hover:text-foreground transition-colors cursor-default">
                  ESG Lifecycle Accounting
                </span>
              </li>
            </ul>
          </div>

          {/* Directory Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-foreground">
              Institutional Alliance
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground font-medium">
              <li>
                <span className="text-foreground font-semibold block">JAIN University</span>
                <span className="text-xs text-muted-foreground block">
                  Deemed-to-be-University, Bangalore
                </span>
              </li>
              <li className="pt-2">
                <span className="text-foreground font-semibold block">IFQM</span>
                <span className="text-xs text-muted-foreground block">
                  Indian Foundation for Quality Management
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Sarvottam Ecosystem. Built in official partnership
            with JAIN University & IFQM.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/framework" className="hover:text-foreground transition-colors">
              Framework Documentation
            </Link>
            <span>·</span>
            <Link href="/problems" className="hover:text-foreground transition-colors">
              Submit Challenge
            </Link>
            <span>·</span>
            <Link href="/login" className="hover:text-foreground transition-colors">
              Partner Sign-In
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
