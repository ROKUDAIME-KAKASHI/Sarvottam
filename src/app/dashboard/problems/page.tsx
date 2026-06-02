import { auth } from "@/auth";
import { getProblems } from "@/app/actions/problems";
import ProblemList from "./ProblemList";
import { AlertCircle, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProblemsDashboardPage() {
  const session = await auth();
  const problems = await getProblems();
  
  const currentUserId = session?.user?.id;

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <AlertCircle className="h-3.5 w-3.5" />
            Industry Problems
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Problem Directory
          </h1>
          <p className="text-muted-foreground mt-2 font-medium max-w-2xl">
            View submitted industry challenges and their current resolution status.
          </p>
        </div>
        <Link href="/problems">
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Submit New Problem
          </Button>
        </Link>
      </div>

      <ProblemList problems={problems} currentUserId={currentUserId} currentUserRole={session?.user?.role} />
    </div>
  );
}
