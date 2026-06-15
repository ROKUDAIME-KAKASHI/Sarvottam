import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, User, Building, Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ApplicationList from "@/app/dashboard/applications/ApplicationList";
import { auth } from "@/auth";

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      creator: true,
      partner: {
        include: { user: true }
      },
      mentor: {
        include: { user: true }
      },
      department: true,
      applications: {
        include: { user: true }
      }
    }
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/projects" className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-full" })}>
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground">
            Project Details
          </h1>
          <p className="text-muted-foreground mt-2 font-medium">
            View comprehensive details and applications for this project.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl shadow-lg">
            <CardHeader className="p-8">
              <div className="flex justify-between items-start mb-4 gap-4">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20 shrink-0">
                  <Briefcase className="h-7 w-7" />
                </div>
                <Badge 
                  variant={project.status === "COMPLETED" ? "default" : "secondary"}
                  className={`rounded-full px-4 py-1.5 text-xs font-black uppercase tracking-wider ${
                    project.status === "OPEN" ? "bg-emerald-500/10 text-emerald-500" : 
                    project.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500" : ""
                  }`}
                >
                  {project.status}
                </Badge>
              </div>
              <CardTitle className="text-3xl font-bold leading-tight mb-2">
                {project.title}
              </CardTitle>
              <CardDescription className="text-sm font-bold text-muted-foreground/60 tracking-widest uppercase">
                ID: {project.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 pt-0 space-y-8">
              <div>
                <h3 className="text-lg font-bold mb-3 border-b pb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.difficultyLevel && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Difficulty</h3>
                    <div className="flex items-center gap-2 font-medium">
                      <Layers className="h-4 w-4 text-primary" />
                      {project.difficultyLevel}
                    </div>
                  </div>
                )}
                
                {project.duration && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Duration</h3>
                    <div className="flex items-center gap-2 font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      {project.duration}
                    </div>
                  </div>
                )}

                {project.creator && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Creator</h3>
                    <div className="flex items-center gap-2 font-medium">
                      <User className="h-4 w-4 text-primary" />
                      {project.creator.name || project.creator.email}
                    </div>
                  </div>
                )}

                {project.partner && (
                  <div>
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Industry Partner</h3>
                    <div className="flex items-center gap-2 font-medium">
                      <Building className="h-4 w-4 text-primary" />
                      {project.partner.companyName}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-xl font-bold">Applications</CardTitle>
              <CardDescription>Students and teams who applied</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <ApplicationList 
                applications={project.applications.map(app => ({
                  ...app,
                  projectTitle: project.title,
                  project: {
                    title: project.title,
                    creatorId: project.creatorId || "",
                  },
                  user: {
                    name: app.user.name,
                    email: app.user.email,
                    skills: app.user.skills
                  }
                }))}
                currentUserRole={session?.user?.role}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
