"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Settings, FileText, Users, Briefcase,
  LogOut, Building, Bell, BarChart, User, Files, Inbox,
  AlertCircle, Menu, ChevronLeft, Award, ClipboardList, BookOpen, Lightbulb, Leaf, BrainCircuit, Network
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/logo";

interface SidebarProps {
  role: string;
  user: {
    name?: string | null;
    email?: string | null;
  } | undefined;
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
    
    // Initial check
    handleResize();
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
    { name: "AI Copilot", href: "/dashboard/ai", icon: BrainCircuit, roles: ["ALL"] },
    { name: "Excellence Framework", href: "/dashboard/excellence", icon: Award, roles: ["ALL"] },
    { name: "Org Assessments", href: "/dashboard/org-assessments", icon: ClipboardList, roles: ["SUPERADMIN", "FACULTY", "INDUSTRY_PARTNER"] },
    { name: "Certifications", href: "/dashboard/certifications", icon: Award, roles: ["ALL"] },
    { name: "Innovation Hub", href: "/dashboard/innovation", icon: Lightbulb, roles: ["ALL"] },
    { name: "Sustainability Center", href: "/dashboard/sustainability", icon: Leaf, roles: ["ALL"] },
    { name: "Knowledge Graph", href: "/dashboard/knowledge-graph", icon: Network, roles: ["ALL"] },
    { name: "Training & Courses", href: "/dashboard/lms", icon: BookOpen, roles: ["ALL"] },
    { name: "User Management", href: "/dashboard/users", icon: Users, roles: ["SUPERADMIN"] },
    { name: "Departments", href: "/dashboard/departments", icon: Building, roles: ["SUPERADMIN"] },
    { name: "KPIs & Analytics", href: "/dashboard/kpis", icon: BarChart, roles: ["SUPERADMIN"] },
    { name: "Research", href: "/dashboard/projects", icon: Briefcase, roles: ["STUDENT", "FACULTY", "INDUSTRY_PARTNER"] },
    { name: "Applications", href: "/dashboard/applications", icon: Inbox, roles: ["STUDENT", "FACULTY", "INDUSTRY_PARTNER"] },
    { name: "Projects / Problems", href: "/dashboard/problems", icon: AlertCircle, roles: ["ALL"] },
    { name: "Documents", href: "/dashboard/documents", icon: Files, roles: ["ALL"] },
    { name: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["ALL"] },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["ALL"] },
    { name: "Profile", href: "/dashboard/profile", icon: User, roles: ["ALL"] },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ALL"] },
  ];

  const filteredItems = navItems.filter(item => 
    item.roles.includes("ALL") || item.roles.includes(role)
  );

  return (
    <motion.aside 
      animate={{ width: isCollapsed ? 80 : 256 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="border-r bg-background flex flex-col h-screen sticky top-0 shrink-0 z-50 shadow-xl shadow-primary/5"
    >
      <div className="h-16 flex items-center border-b px-4 justify-between">
        <Link href="/" className={`flex items-center gap-2 ${isCollapsed ? 'mx-auto' : 'px-2'}`}>
          <Logo className="h-7 w-7 shrink-0" />
          {!isCollapsed && (
            <motion.span 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="font-bold text-xl text-primary whitespace-nowrap overflow-hidden"
            >
              Sarvottam
            </motion.span>
          )}
        </Link>
        {!isCollapsed && (
          <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(true)} className="shrink-0 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
      </div>

      {isCollapsed && (
        <div className="flex justify-center mt-4">
           <Button variant="ghost" size="icon" onClick={() => setIsCollapsed(false)} className="shrink-0 text-muted-foreground hover:text-foreground">
             <Menu className="h-5 w-5" />
           </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
        <nav className="grid items-start px-3 text-sm font-medium gap-2">
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center rounded-xl transition-all group relative
                  ${isCollapsed ? 'justify-center p-3' : 'gap-3 px-3 py-2.5'}
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-bold shadow-sm shadow-primary/10 border border-primary/10' 
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                  }
                `}
                title={isCollapsed ? item.name : undefined}
              >
                <item.icon className={`shrink-0 ${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'}`} />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden">{item.name}</span>
                )}
                {isCollapsed && (
                  <span className="absolute left-full ml-4 bg-foreground text-background px-2 py-1 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-border/50 bg-background">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} mb-4`}>
          <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary ring-1 ring-primary/20">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex flex-col overflow-hidden min-w-0">
              <span className="text-sm font-bold truncate">{user?.name}</span>
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-wider truncate">{role}</span>
            </div>
          )}
        </div>
        <Link 
          href="/logout" 
          className={buttonVariants({ 
            variant: "outline", 
            className: `w-full text-muted-foreground hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all ${isCollapsed ? 'px-0 justify-center' : 'justify-start'}` 
          })}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
          {!isCollapsed && "Sign Out"}
        </Link>
      </div>
    </motion.aside>
  );
}
