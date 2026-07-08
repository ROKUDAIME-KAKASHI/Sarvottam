import { getCertificationPrograms } from "@/lib/actions/certification.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge as BadgeUI } from "@/components/ui/badge";
import Link from "next/link";
import { ShieldCheck, Award, Route, Search } from "lucide-react";

export default async function CertificationsDashboard() {
  const session = await auth();
  if (!session) redirect("/login");

  const programs = await getCertificationPrograms();

  const totalCertificates = programs.reduce((acc, p) => acc + p.certificates.length, 0);
  const totalBadges = programs.reduce((acc, p) => acc + p.badges.length, 0);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Certification Ecosystem</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/certifications/verify">
              <Search className="w-4 h-4 mr-2" />
              Verify Credential
            </Link>
          </Button>
          {session.user.role === "SUPERADMIN" && (
            <Button asChild>
              <Link href="/dashboard/certifications/programs/new">Create Program</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Route className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.filter((p) => p.isActive).length}</div>
            <p className="text-xs text-muted-foreground">Learning paths available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certificates Issued</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificates}</div>
            <p className="text-xs text-muted-foreground">Verified credentials across ecosystem</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Badges Defined</CardTitle>
            <Award className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBadges}</div>
            <p className="text-xs text-muted-foreground">Micro-credentials & achievements</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Certification Programs</CardTitle>
          <CardDescription>Manage structured learning paths and their assessments.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Issuer</TableHead>
                <TableHead>Tracks</TableHead>
                <TableHead>Badges</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {programs.map((prog) => (
                <TableRow key={prog.id}>
                  <TableCell className="font-medium">{prog.name}</TableCell>
                  <TableCell>{prog.issuer}</TableCell>
                  <TableCell>{prog.tracks.length}</TableCell>
                  <TableCell>{prog.badges.length}</TableCell>
                  <TableCell>
                    {prog.isActive ? (
                      <BadgeUI variant="default">Active</BadgeUI>
                    ) : (
                      <BadgeUI variant="secondary">Inactive</BadgeUI>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/certifications/programs/${prog.id}`}>Manage</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {programs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                    No certification programs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
