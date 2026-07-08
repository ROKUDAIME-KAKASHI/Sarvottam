import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, MapPin, Plus, UserCircle, Search, Clock } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";

export default async function PlacementsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userRole = session.user?.role || "STUDENT";
  const userId = session.user?.id;

  // Fetch all open jobs
  const jobs = await prisma.job.findMany({
    where: { status: "OPEN" },
    include: {
      poster: { select: { name: true, role: true } },
      applications: {
        where: { applicantId: userId },
      },
      _count: { select: { applications: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
              <Briefcase className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Placements & Jobs</h1>
          </div>
          <p className="text-muted-foreground font-medium max-w-xl">
            Discover opportunities posted by industry partners and faculty members.
          </p>
        </div>

        {["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(userRole) && (
          <div className="relative z-10 shrink-0">
            <Link
              href="/dashboard/placements/new"
              className={buttonVariants({
                className:
                  "rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all",
                size: "lg",
              })}
            >
              <Plus className="w-5 h-5 mr-2" />
              Post a Job
            </Link>
          </div>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search for roles, companies, or keywords..."
          className="pl-12 h-14 rounded-2xl bg-card border-border/50 shadow-sm text-base"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold tracking-tight mb-4">Latest Opportunities</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-20 bg-card rounded-3xl border border-border/50 border-dashed">
              <Briefcase className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">No jobs posted yet.</p>
            </div>
          ) : (
            jobs.map((job) => {
              const hasApplied = job.applications && job.applications.length > 0;

              return (
                <Card
                  key={job.id}
                  className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-md hover:-translate-y-1 overflow-hidden"
                >
                  <CardHeader className="pb-3 flex flex-row justify-between items-start">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary border-primary/20 rounded-md"
                        >
                          {job.type.replace("_", " ")}
                        </Badge>
                        <span className="text-xs font-medium text-muted-foreground flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl font-bold">{job.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-foreground/80 font-medium pt-1">
                        <Building className="w-4 h-4 text-primary" /> {job.company}
                        {job.location && (
                          <>
                            <span className="text-muted-foreground/50">•</span>
                            <MapPin className="w-4 h-4 text-primary" /> {job.location}
                          </>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2 flex justify-between items-center bg-muted/20 border-t border-border/50 rounded-b-2xl p-4">
                    <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                      <UserCircle className="w-4 h-4" />
                      Posted by {job.poster.name || "Unknown"}
                      <span className="bg-foreground/10 px-2 py-0.5 rounded text-[10px] ml-1 uppercase">
                        {job.poster.role}
                      </span>
                    </div>
                    {userRole === "STUDENT" &&
                      (hasApplied ? (
                        <Button variant="secondary" disabled className="rounded-full px-6">
                          Applied
                        </Button>
                      ) : (
                        <Link
                          href={`/dashboard/placements/${job.id}`}
                          className={buttonVariants({
                            variant: "default",
                            className: "rounded-full px-6 shadow-sm shadow-primary/20",
                          })}
                        >
                          View & Apply
                        </Link>
                      ))}
                    {userRole !== "STUDENT" && (
                      <div className="text-sm font-semibold text-primary">
                        {job._count.applications} Applicants
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/50 bg-gradient-to-br from-primary/10 via-card to-card overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg">Career Resources</CardTitle>
              <CardDescription>Improve your chances of getting hired</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                "Resume Building Masterclass",
                "Mock Interview Scheduling",
                "Industry Skill Gap Analysis",
                "Portfolio Review",
              ].map((resource, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer border border-transparent hover:border-border/50"
                >
                  <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-primary shadow-sm">
                    {i + 1}
                  </div>
                  <span className="text-sm font-medium">{resource}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
