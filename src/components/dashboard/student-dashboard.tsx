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
  const skillsArray = user?.skills
    ? user.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
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
                <p className="text-sm text-muted-foreground">
                  You are not participating in any active projects yet.
                </p>
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
            <CardDescription>Your validated quality skills</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, i) => (
                <Badge key={i} variant="outline" className="px-3 py-1 bg-primary/5">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
