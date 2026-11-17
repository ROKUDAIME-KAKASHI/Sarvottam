"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut, Menu, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { navSections, type NavItem } from "@/config/navigation";

interface SidebarProps {
  role: string;
  user:
    | {
        name?: string | null;
        email?: string | null;
      }
    | undefined;
}

export function Sidebar({ role, user }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  // Auto-collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isItemActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 272 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="border-r border-border/50 bg-background/95 backdrop-blur-md flex flex-col h-screen sticky top-0 shrink-0 z-50 shadow-sm"
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center border-b border-border/40 px-4 justify-between">
        <Link href="/" className={`flex items-center gap-2.5 ${isCollapsed ? "mx-auto" : "px-2"}`}>
          <Logo className="h-7 w-7 shrink-0 text-primary" />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="font-extrabold text-lg text-foreground tracking-tight leading-none">
                Sarvottam
              </span>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground tracking-wider uppercase mt-1">
                JAIN × IFQM
              </span>
            </div>
          )}
        </Link>
        {!isCollapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(true)}
            className="shrink-0 text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center mt-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(false)}
            className="shrink-0 text-muted-foreground hover:text-foreground h-8 w-8 rounded-lg"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Nav List Grouped by Sections */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6 custom-scrollbar">
        {navSections.map((section, sIdx) => {
          const visibleItems = section.items.filter(
            (item) => item.roles.includes("ALL") || item.roles.includes(role)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} className="space-y-1">
              {!isCollapsed && (
                <div className="px-3 pb-1 text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground/70">
                  {section.title}
                </div>
              )}
              {isCollapsed && sIdx > 0 && (
                <div className="w-8 mx-auto my-2 border-t border-border/40" />
              )}
              <nav className="grid gap-1">
                {visibleItems.map((item) => {
                  const active = isItemActive(item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center rounded-xl transition-all group relative text-xs font-semibold
                        ${isCollapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"}
                        ${
                          active
                            ? "bg-primary text-primary-foreground shadow-xs font-bold"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                        }
                      `}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon className={`shrink-0 ${isCollapsed ? "h-5 w-5" : "h-4 w-4"}`} />
                      {!isCollapsed && (
                        <div className="flex items-center justify-between flex-1 overflow-hidden">
                          <span className="truncate">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className={`text-[9px] px-1.5 py-0 h-4 font-mono font-bold uppercase ${
                                active ? "bg-primary-foreground/20 text-primary-foreground" : ""
                              }`}
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      )}
                      {isCollapsed && (
                        <span className="absolute left-full ml-3 bg-foreground text-background px-2.5 py-1 rounded-md text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-lg">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          );
        })}
      </div>

      {/* User Status & Signout Footer */}
      <div className="p-3 border-t border-border/40 bg-muted/10">
        <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"} mb-3`}>
          <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-primary ring-1 ring-primary/20 text-xs">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-xs font-bold truncate text-foreground">
                {user?.name || "User"}
              </span>
              <span className="text-[10px] font-mono font-semibold text-muted-foreground uppercase tracking-wider truncate">
                {role}
              </span>
            </div>
          )}
        </div>
        <Link
          href="/logout"
          className={buttonVariants({
            variant: "outline",
            size: "sm",
            className: `w-full text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 rounded-xl transition-all ${
              isCollapsed ? "px-0 justify-center h-8" : "justify-start h-8"
            }`,
          })}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className={`h-3.5 w-3.5 ${isCollapsed ? "" : "mr-2"}`} />
          {!isCollapsed && "Sign Out"}
        </Link>
      </div>
    </motion.aside>
  );
}
