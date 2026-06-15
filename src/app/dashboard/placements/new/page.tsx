import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { NewJobForm } from "./NewJobForm";

export default async function NewJobPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userRole = session.user?.role || "STUDENT";
  if (!["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(userRole)) {
    redirect("/dashboard/placements");
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard/placements" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Link>

      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden relative p-6 md:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3 border-b border-border/50 pb-6">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Post a New Job</h1>
              <p className="text-muted-foreground font-medium text-sm">
                Create a new opportunity for students to apply to.
              </p>
            </div>
          </div>

          <NewJobForm />
        </div>
      </div>
    </div>
  );
}
