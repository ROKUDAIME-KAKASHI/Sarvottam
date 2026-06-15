import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getApplications } from "@/app/actions/applications";
import { auth } from "@/auth";
import ApplicationList from "./ApplicationList";
import { ComingSoon } from "@/components/coming-soon";

export default async function ApplicationsPage() {
  const session = await auth();
  const applications = await getApplications();
  
  const currentUserId = session?.user?.id;

  const mappedApplications = applications.map((app) => ({
    ...app,
    user: app.user ? { name: app.user.name, email: app.user.email } : undefined,
    project: {
      ...app.project,
      creatorId: app.project.creatorId || "",
    }
  }));

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Applications</h2>
          <p className="text-muted-foreground font-medium">Review and manage project applications.</p>
        </div>
        <div className="flex gap-2">
          <ComingSoon feature="Filtering">
            <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-background/50 backdrop-blur-md">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </ComingSoon>
        </div>
      </div>

      <ApplicationList applications={mappedApplications} currentUserId={currentUserId} currentUserRole={session?.user?.role} />
    </div>
  );
}
