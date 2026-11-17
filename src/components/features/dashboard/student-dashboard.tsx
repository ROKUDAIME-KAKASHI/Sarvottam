import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Award, Activity, Briefcase } from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { XPBar } from "./xp-bar";
import { TrophyRoom, type BadgeData } from "./trophy-room";
import { getXPForLevel } from "@/lib/actions/gamification";

export async function StudentDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  // Fetch student data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      userSkills: { include: { skill: true } },
      applications: {
        include: {
          project: {
            include: { partner: true },
          },
        },
      },
      submittedProblems: true,
      certificates: true,
      badges: {
        include: { badge: true },
      },
    },
  });

  const activeProjects = user?.applications.filter((a) => a.status === "ACCEPTED") || [];
  const openApplications = user?.applications.filter((a) => a.status === "PENDING") || [];
  const submittedProblemsCount = user?.submittedProblems.length || 0;
  const certificatesCount = user?.certificates.length || 0;

  // Gamification Data
  const xp = user?.xp || 0;
  const level = user?.level || 1;
  const nextLevelXP = Math.max(getXPForLevel(level + 1), 100);

  const earnedBadges: BadgeData[] =
    user?.badges.map((b) => ({
      id: b.badge.id,
      name: b.badge.name,
      description: b.badge.description,
      imageUrl: b.badge.imageUrl,
      earned: true,
      earnedAt: b.earnedAt,
    })) || [];

  const allBadges = await prisma.badge.findMany();
  const trophyBadges: BadgeData[] = allBadges.map((b) => {
    const earned = earnedBadges.find((eb) => eb.id === b.id);
    if (earned) return earned;
    return {
      id: b.id,
      name: b.name,
      description: b.description,
      imageUrl: b.imageUrl,
      earned: false,
    };
  });

  // Skills string to array
  const skillsArray =
    user?.userSkills && user.userSkills.length > 0
      ? user.userSkills.map((us) => us.skill.name)
      : ["No skills added yet"];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back! Here is an overview of your research projects and skills.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Research</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">Currently participating</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projects / Problems</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedProblemsCount}</div>
            <p className="text-xs text-muted-foreground">Industry challenges raised</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificatesCount}</div>
            <p className="text-xs text-muted-foreground">Earned achievements</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Applications</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{openApplications.length}</div>
            <p className="text-xs text-muted-foreground">Pending review</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-full md:col-span-3">
          <XPBar currentXP={xp} nextLevelXP={nextLevelXP} level={level} />
        </div>
        <div className="col-span-full md:col-span-4">
          <TrophyRoom badges={trophyBadges} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Current Research</CardTitle>
            <CardDescription>Your active participation in industry challenges.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeProjects.length === 0 ? (
                <div className="text-center py-6 px-4 bg-muted/20 border border-dashed border-border/70 rounded-xl space-y-3">
                  <p className="text-sm text-muted-foreground">
                    You have not joined an active industry research project yet.
                  </p>
                  <a
                    href="/research"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm"
                  >
                    Browse Open Industry Challenges &rarr;
                  </a>
                </div>
              ) : (
                activeProjects.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{app.project.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {app.project.partner?.companyName || "Internal"}
                      </p>
                    </div>
                    <Badge variant="default">{app.project.status}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Skill Tracking</CardTitle>
            <CardDescription>Your validated quality competencies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1 bg-primary/5">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="pt-3 border-t border-border/50 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Quick Actions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="/framework"
                  className="p-2 text-xs font-medium rounded-lg border border-border/60 hover:bg-muted/40 hover:border-primary/30 transition-all block text-center"
                >
                  Quality Engine
                </a>
                <a
                  href="/dashboard/placements"
                  className="p-2 text-xs font-medium rounded-lg border border-border/60 hover:bg-muted/40 hover:border-primary/30 transition-all block text-center"
                >
                  Placements & Jobs
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
