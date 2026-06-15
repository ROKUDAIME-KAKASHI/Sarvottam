import { Badge } from "@/components/ui/badge";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getProjects } from "@/app/actions/projects";
import { getMarketplaceProblems } from "@/app/actions/problems";
import ResearchList from "./ResearchList";
import { auth } from "@/auth";

export default async function ResearchMarketplace() {
  const projects = await getProjects();
  const problems = await getMarketplaceProblems();
  const session = await auth();

  const mappedProjects = projects.map(p => ({
    ...p,
    difficultyLevel: p.difficultyLevel || undefined,
    duration: p.duration || undefined,
    mentor: p.mentor ? { user: p.mentor.user ? { name: p.mentor.user.name } : undefined } : undefined,
    partner: p.partner ? { companyName: p.partner.companyName } : undefined,
    creator: p.creator ? { name: p.creator.name, email: p.creator.email } : undefined,
  }));

  const mappedProblems = problems.map(p => ({
    ...p,
    description: p.description || "",
    submitter: p.submitter ? { name: p.submitter.name, email: p.submitter.email, role: p.submitter.role } : undefined
  }));

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      {/* PREMIUM BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 max-w-2xl">
            <div>
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/10 text-primary backdrop-blur-md shadow-sm rounded-full">
                <Sparkles className="w-4 h-4 mr-2 inline-block animate-pulse" />
                Live Marketplace
              </Badge>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
              Research Marketplace
            </h2>
            <p className="text-xl text-muted-foreground font-medium">
              Discover open industry projects and apply to join a specialized research node.
            </p>
          </div>
          
          <div className="relative w-full md:w-80 group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-colors" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
            <Input 
              type="search" 
              placeholder="Search research..." 
              className="pl-12 h-14 w-full bg-background/60 backdrop-blur-xl border-border/50 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all relative z-10 text-base" 
            />
          </div>
        </div>

        <ResearchList projects={mappedProjects} problems={mappedProblems} currentUserRole={session?.user?.role} />
      </div>
    </div>
  );
}
