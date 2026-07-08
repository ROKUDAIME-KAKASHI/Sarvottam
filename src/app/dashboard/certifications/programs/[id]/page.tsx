import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import IssueCertificateModal from "./IssueCertificateModal"; // We will create this

export default async function ProgramDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect("/login");

  const program = await prisma.certificationProgram.findUnique({
    where: { id: params.id },
    include: {
      tracks: { include: { assessments: true } },
      badges: true,
      certificates: { include: { user: true } },
    },
  });

  if (!program) {
    return <div className="p-8">Program not found.</div>;
  }

  // Fetch users for issuing dropdown
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true } });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/certifications">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{program.name}</h2>
            <p className="text-muted-foreground">Issuer: {program.issuer}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {session.user.role === "SUPERADMIN" && (
            <IssueCertificateModal programId={program.id} tracks={program.tracks} users={users} />
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Learning Tracks</CardTitle>
            <CardDescription>Structured paths within this program.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {program.tracks.map((track) => (
              <div key={track.id} className="border-b pb-2 last:border-0 text-sm">
                <div className="flex justify-between font-medium">
                  <span>{track.name}</span>
                  <span className="text-muted-foreground">{track.level}</span>
                </div>
                <p className="text-muted-foreground mt-1">
                  Assessments: {track.assessments.length}
                </p>
              </div>
            ))}
            {program.tracks.length === 0 && (
              <p className="text-sm text-muted-foreground">No tracks configured.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issued Certificates</CardTitle>
            <CardDescription>Recipients of this credential.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
            {program.certificates.map((cert) => (
              <div key={cert.id} className="border-b pb-2 last:border-0 text-sm">
                <div className="flex justify-between font-medium">
                  <span>{cert.user.name || cert.user.email}</span>
                  <span className="text-muted-foreground">
                    {cert.issueDate.toLocaleDateString()}
                  </span>
                </div>
                <p className="text-muted-foreground mt-1">Credential: {cert.title}</p>
              </div>
            ))}
            {program.certificates.length === 0 && (
              <p className="text-sm text-muted-foreground">No certificates issued yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
