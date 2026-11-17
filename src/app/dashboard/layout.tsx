import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardTopbar } from "@/components/layout/dashboard-topbar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role || "STUDENT";

  return (
    <div className="flex min-h-screen w-full bg-muted/20 relative">
      <Sidebar role={role} user={session.user} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopbar
          user={{
            name: session.user.name,
            email: session.user.email,
            role: session.user.role,
          }}
        />
        <div className="flex-1 p-4 md:p-8 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
