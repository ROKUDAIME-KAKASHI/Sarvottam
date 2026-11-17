import {
  LayoutDashboard,
  Settings,
  FileText,
  Users,
  Briefcase,
  Building,
  Bell,
  BarChart,
  User,
  Files,
  Inbox,
  AlertCircle,
  Award,
  ClipboardList,
  BookOpen,
  Lightbulb,
  Leaf,
  BrainCircuit,
  Network,
} from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: any;
  roles: string[];
  badge?: string;
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
      {
        name: "AI Copilot",
        href: "/dashboard/ai",
        icon: BrainCircuit,
        roles: ["ALL"],
        badge: "AI",
      },
      { name: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["ALL"] },
      { name: "Profile", href: "/dashboard/profile", icon: User, roles: ["ALL"] },
    ],
  },
  {
    title: "Research & Industry",
    items: [
      {
        name: "Research Nodes",
        href: "/dashboard/projects",
        icon: Briefcase,
        roles: ["STUDENT", "FACULTY", "INDUSTRY_PARTNER"],
      },
      { name: "Problem Board", href: "/dashboard/problems", icon: AlertCircle, roles: ["ALL"] },
      {
        name: "Applications",
        href: "/dashboard/applications",
        icon: Inbox,
        roles: ["STUDENT", "FACULTY", "INDUSTRY_PARTNER"],
      },
      { name: "Placements & Jobs", href: "/dashboard/placements", icon: Briefcase, roles: ["ALL"] },
      {
        name: "Knowledge Graph",
        href: "/dashboard/knowledge-graph",
        icon: Network,
        roles: ["ALL"],
      },
      { name: "Innovation Hub", href: "/dashboard/innovation", icon: Lightbulb, roles: ["ALL"] },
    ],
  },
  {
    title: "Quality & Standards",
    items: [
      { name: "Excellence Framework", href: "/dashboard/excellence", icon: Award, roles: ["ALL"] },
      {
        name: "Org Assessments",
        href: "/dashboard/org-assessments",
        icon: ClipboardList,
        roles: ["SUPERADMIN", "FACULTY", "INDUSTRY_PARTNER"],
      },
      { name: "Certifications", href: "/dashboard/certifications", icon: Award, roles: ["ALL"] },
      { name: "Training & LMS", href: "/dashboard/lms", icon: BookOpen, roles: ["ALL"] },
      {
        name: "Sustainability (ESG)",
        href: "/dashboard/sustainability",
        icon: Leaf,
        roles: ["ALL"],
      },
    ],
  },
  {
    title: "Governance & Operations",
    items: [
      { name: "User Management", href: "/dashboard/users", icon: Users, roles: ["SUPERADMIN"] },
      {
        name: "Departments",
        href: "/dashboard/departments",
        icon: Building,
        roles: ["SUPERADMIN"],
      },
      { name: "KPIs & Analytics", href: "/dashboard/kpis", icon: BarChart, roles: ["SUPERADMIN"] },
      { name: "Documents", href: "/dashboard/documents", icon: Files, roles: ["ALL"] },
      { name: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["ALL"] },
      { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ALL"] },
    ],
  },
];

// Flat export for backwards compatibility
export const navItems: NavItem[] = navSections.flatMap((s) => s.items);
