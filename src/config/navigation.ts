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
};

export const navItems: NavItem[] = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard, roles: ["ALL"] },
  { name: "AI Copilot", href: "/dashboard/ai", icon: BrainCircuit, roles: ["ALL"] },
  { name: "Excellence Framework", href: "/dashboard/excellence", icon: Award, roles: ["ALL"] },
  {
    name: "Org Assessments",
    href: "/dashboard/org-assessments",
    icon: ClipboardList,
    roles: ["SUPERADMIN", "FACULTY", "INDUSTRY_PARTNER"],
  },
  { name: "Certifications", href: "/dashboard/certifications", icon: Award, roles: ["ALL"] },
  { name: "Innovation Hub", href: "/dashboard/innovation", icon: Lightbulb, roles: ["ALL"] },
  {
    name: "Sustainability Center",
    href: "/dashboard/sustainability",
    icon: Leaf,
    roles: ["ALL"],
  },
  { name: "Knowledge Graph", href: "/dashboard/knowledge-graph", icon: Network, roles: ["ALL"] },
  { name: "Training & Courses", href: "/dashboard/lms", icon: BookOpen, roles: ["ALL"] },
  { name: "User Management", href: "/dashboard/users", icon: Users, roles: ["SUPERADMIN"] },
  { name: "Departments", href: "/dashboard/departments", icon: Building, roles: ["SUPERADMIN"] },
  { name: "KPIs & Analytics", href: "/dashboard/kpis", icon: BarChart, roles: ["SUPERADMIN"] },
  {
    name: "Research",
    href: "/dashboard/projects",
    icon: Briefcase,
    roles: ["STUDENT", "FACULTY", "INDUSTRY_PARTNER"],
  },
  {
    name: "Applications",
    href: "/dashboard/applications",
    icon: Inbox,
    roles: ["STUDENT", "FACULTY", "INDUSTRY_PARTNER"],
  },
  { name: "Projects / Problems", href: "/dashboard/problems", icon: AlertCircle, roles: ["ALL"] },
  { name: "Placements & Jobs", href: "/dashboard/placements", icon: Briefcase, roles: ["ALL"] },
  { name: "Documents", href: "/dashboard/documents", icon: Files, roles: ["ALL"] },
  { name: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["ALL"] },
  { name: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["ALL"] },
  { name: "Profile", href: "/dashboard/profile", icon: User, roles: ["ALL"] },
  { name: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["ALL"] },
];
