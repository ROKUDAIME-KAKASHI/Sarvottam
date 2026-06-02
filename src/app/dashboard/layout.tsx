import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Sidebar } from "./Sidebar";

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
      <Sidebar role={role} user={session.user} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
