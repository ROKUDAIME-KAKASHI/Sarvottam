import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Briefcase, UserCircle, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ApplyForm } from "./ApplyForm";

export default async function JobDetailsPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      poster: { select: { name: true, role: true } },
      applications: {
        where: { applicantId: session.user?.id },
      },
    },
  });

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Job Not Found</h2>
        <Link href="/dashboard/placements" className={buttonVariants({ variant: "outline" })}>
          Back to Placements
        </Link>
      </div>
    );
  }

  const hasApplied = job.applications.length > 0;
  const isStudent = session.user?.role === "STUDENT";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Link href="/dashboard/placements" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Jobs
      </Link>

      <div className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        
        <div className="p-6 md:p-8 space-y-6 relative z-10">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0">{job.type.replace("_", " ")}</Badge>
              <span className="text-xs font-medium text-muted-foreground flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
              {job.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-medium">
              <span className="flex items-center text-foreground/80">
                <Building className="w-5 h-5 text-primary mr-2 shrink-0" />
                {job.company}
              </span>
              {job.location && (
                <span className="flex items-center text-foreground/80">
                  <MapPin className="w-5 h-5 text-primary mr-2 shrink-0" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center text-foreground/80">
                <UserCircle className="w-5 h-5 text-primary mr-2 shrink-0" />
                Posted by {job.poster.name}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h3 className="text-lg font-bold mb-3">About the Role</h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
              <p className="whitespace-pre-wrap leading-relaxed">{job.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/20 border-t border-border/50 p-6 md:p-8">
          {isStudent ? (
            hasApplied ? (
              <div className="bg-green-500/10 text-green-600 dark:text-green-400 p-4 rounded-xl border border-green-500/20 text-center font-medium">
                You have successfully applied for this position!
              </div>
            ) : (
              <div className="bg-card rounded-2xl border border-border/50 p-6 shadow-sm">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-primary" />
                  Apply Now
                </h3>
                <ApplyForm jobId={job.id} />
              </div>
            )
          ) : (
            <div className="text-center py-4 text-muted-foreground font-medium">
              Only students can apply to jobs.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
