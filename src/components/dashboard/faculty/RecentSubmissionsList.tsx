import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/action-button";
import { approveApplication } from "@/app/actions/applications";

type Application = {
  id: string;
  projectTitle: string;
  user: { name?: string | null; email?: string | null };
  createdAt: Date;
  facultyApproved: boolean;
  status: string;
};

export function RecentSubmissionsList({
  recentApplications,
}: {
  recentApplications: Application[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Project Submissions</CardTitle>
        <CardDescription>Review deliverables from student teams</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentApplications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent applications or submissions.</p>
          ) : (
            recentApplications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{app.projectTitle}</p>
                  <p className="text-sm text-muted-foreground">
                    {app.user.name || app.user.email} •{" "}
                    {new Date(app.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={app.facultyApproved ? "default" : "secondary"}
                    className="text-[10px] uppercase"
                  >
                    {app.facultyApproved ? "Faculty OK" : "Pending"}
                  </Badge>
                  {app.status === "PENDING" && !app.facultyApproved && (
                    <ActionButton
                      action={async () => {
                        "use server";
                        return await approveApplication(app.id, "FACULTY", true);
                      }}
                      successMessage="Application approved successfully"
                      size="sm"
                      className="h-7 text-xs px-2"
                    >
                      Approve
                    </ActionButton>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
