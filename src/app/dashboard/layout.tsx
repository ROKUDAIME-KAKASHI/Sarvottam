import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Settings, 
  FileText, 
  Users, 
  Briefcase,
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) {
    redirect("/api/auth/signin");
  }

  const role = session.user?.role || "STUDENT";

  return (
    <div className="flex min-h-screen w-full bg-muted/20">
      <aside className="w-64 border-r bg-background hidden md:flex flex-col">
        <div className="h-16 flex items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="h-7 w-7" />
            <span className="font-bold text-xl text-primary">Sarvottam</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6">
          <nav className="grid items-start px-4 text-sm font-medium gap-2">
            <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 bg-primary/10 text-primary transition-all">
              <LayoutDashboard className="h-4 w-4" />
              Overview
            </Link>
            {role === "SUPERADMIN" && (
              <>
                <Link href="/dashboard/users" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
                  <Users className="h-4 w-4" />
                  User Management
                </Link>
              </>
            )}
            {(role === "STUDENT" || role === "FACULTY") && (
              <Link href="/dashboard/projects" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
                <Briefcase className="h-4 w-4" />
                Projects
              </Link>
            )}
            <Link href="/dashboard/reports" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
              <FileText className="h-4 w-4" />
              Reports
            </Link>
            <Link href="/dashboard/settings" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary transition-all">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-medium truncate">{session.user?.name}</span>
              <span className="text-xs text-muted-foreground uppercase truncate">{role}</span>
            </div>
          </div>
          <Link href="/api/auth/signout">
            <Button variant="outline" className="w-full justify-start text-muted-foreground">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </Link>
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between border-b bg-background px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 md:hidden">
              <Logo className="h-6 w-6" />
              <h1 className="text-xl font-bold">Sarvottam</h1>
            </Link>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2 md:hidden" />
                <span className="hidden md:inline-flex items-center">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </span>
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
