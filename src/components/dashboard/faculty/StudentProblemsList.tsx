import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Action } from "@/components/action-button";
import { approveProblem } from "@/app/actions/problems";

type Problem = {
  id: string;
  title: string;
  description?: string | null;
  submitter: { name?: string | null; email?: string | null };
  facultyApproved: boolean;
};

export function StudentProblemsList({ studentProblems }: { studentProblems: Problem[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Problem Approvals</CardTitle>
        <CardDescription>Review and approve problems submitted by students</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4">
          {studentProblems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No problems submitted by students yet.</p>
          ) : (
            studentProblems.map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0 gap-4"
              >
                <div className="space-y-1 flex-1">
                  <p className="text-sm font-bold leading-tight">{problem.title}</p>
                  <p className="text-xs text-muted-foreground">
                    By {problem.submitter.name || problem.submitter.email}
                  </p>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                    {problem.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge
                    variant={problem.facultyApproved ? "default" : "secondary"}
                    className="text-[10px] uppercase"
                  >
                    {problem.facultyApproved ? "Approved" : "Pending"}
                  </Badge>
                  <Action
                    action={async () => {
                      "use server";
                      return await approveProblem(problem.id, "FACULTY", !problem.facultyApproved);
                    }}
                    successMessage={
                      problem.facultyApproved
                        ? "Problem approval revoked"
                        : "Problem approved successfully"
                    }
                    size="sm"
                    variant={problem.facultyApproved ? "outline" : "default"}
                    className="h-7 text-xs px-3"
                  >
                    {problem.facultyApproved ? "Revoke Approval" : "Approve Problem"}
                  </Action>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
