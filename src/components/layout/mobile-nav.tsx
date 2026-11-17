"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, ShieldCheck, Layers, BookOpen, AlertCircle } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";

interface MobileNavProps {
  isLoggedIn: boolean;
}

export function MobileNav({ isLoggedIn }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Framework", href: "/framework", icon: Layers },
    { name: "Problems", href: "/problems", icon: AlertCircle },
    { name: "Research", href: "/research", icon: BookOpen },
  ];

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-full text-foreground h-9 w-9"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {isOpen && (
        <div className="fixed inset-x-4 top-20 p-5 rounded-3xl border border-border/80 bg-background/95 backdrop-blur-2xl shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6 text-primary" />
              <span className="font-extrabold text-base tracking-tight">Sarvottam</span>
            </div>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold">
              JAIN × IFQM
            </span>
          </div>

          <nav className="py-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-border/40 space-y-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className={buttonVariants({
                  className: "w-full rounded-xl text-xs font-semibold shadow-xs",
                })}
              >
                Access Dashboard <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className={buttonVariants({
                    variant: "outline",
                    className: "w-full rounded-xl text-xs",
                  })}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className={buttonVariants({
                    className: "w-full rounded-xl text-xs font-semibold",
                  })}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
