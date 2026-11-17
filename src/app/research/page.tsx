import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import { getMarketplaceProblems } from "@/app/actions/problems";
import ResearchList from "./ResearchList";
import { auth } from "@/auth";

export default async function ResearchMarketplace() {
  const [projects, problems, session] = await Promise.all([
    getProjects(),
    getMarketplaceProblems(),
    auth(),
  ]);

  const mappedProjects = projects.map((p) => ({
    ...p,
    difficultyLevel: p.difficultyLevel || undefined,
    duration: p.duration || undefined,
    mentor: p.mentor
      ? { user: p.mentor.user ? { name: p.mentor.user.name } : undefined }
      : undefined,
    partner: p.partner ? { companyName: p.partner.companyName } : undefined,
    creator: p.creator ? { name: p.creator.name, email: p.creator.email } : undefined,
  }));

  const mappedProblems = problems.map((p) => ({
    ...p,
    description: p.description || "",
    submitter: p.submitter
      ? { name: p.submitter.name, email: p.submitter.email, role: p.submitter.role }
      : undefined,
  }));

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 py-20 md:py-24 max-w-7xl">
        <div className="mb-10 space-y-3">
          <Badge
            variant="outline"
            className="px-3.5 py-1 text-xs font-mono font-semibold border-primary/30 bg-primary/10 text-primary backdrop-blur-md rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 inline-block text-primary" />
            LIVE RESEARCH MARKETPLACE
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Academic Research & Problem Marketplace
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground font-medium max-w-3xl">
            Explore live research workspaces mentored by university faculty and industrial problem
            challenges submitted by enterprise partners. Apply as a student pod or mentor as a
            faculty supervisor.
          </p>
        </div>

        <ResearchList
          projects={mappedProjects}
          problems={mappedProblems}
          currentUserRole={session?.user?.role}
        />
      </div>
    </div>
  );
}
