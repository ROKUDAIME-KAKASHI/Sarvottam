import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, UserCheck, Video, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getAvailableInterviewSlots, bookInterviewSlot } from "@/lib/actions/placements.actions";
import { CreateSlotForm } from "./CreateSlotForm";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function MockInterviewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const availableSlots = await getAvailableInterviewSlots();
  const role = session.user.role || "STUDENT";
  const isMentor = ["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(role);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 pt-6">
      <PageHeader
        title="Mock Interviews"
        description="Schedule a 1-on-1 mock interview with industry experts or faculty to prep for placements."
        icon={Video}
        iconClassName="text-blue-500 bg-blue-500/10"
      />

      {isMentor && (
        <div className="p-6 bg-blue-500/5 rounded-3xl border border-blue-500/20 text-center space-y-4">
          <h3 className="text-lg font-bold text-blue-500">Create a New Interview Slot</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">
            Offer your time to help students practice their interviewing skills. Select a time
            below.
          </p>
          <CreateSlotForm />
        </div>
      )}

      {availableSlots.length === 0 ? (
        <div className="text-center p-12 bg-card rounded-3xl border border-border/50">
          <h3 className="text-xl font-bold text-muted-foreground">No slots available right now.</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Please check back later or request a mentor.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableSlots.map((slot) => (
            <Card
              key={slot.id}
              className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm hover:border-primary/30 transition-all hover:-translate-y-1"
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                    Available
                  </Badge>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">
                  {slot.interviewer.name || "Expert Mentor"}
                </CardTitle>
                <CardDescription>{slot.interviewer.role}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-foreground/80 font-medium">
                  <Clock className="w-4 h-4 text-primary" />
                  {new Date(slot.startTime).toLocaleString()}
                </div>
                {!isMentor && (
                  <form action={bookInterviewSlot.bind(null, slot.id)}>
                    <Button
                      type="submit"
                      className="w-full rounded-full shadow-sm shadow-primary/20"
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Book Slot
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isMentor && (
        <div className="p-6 bg-muted/30 rounded-3xl border border-border/50 text-center space-y-4">
          <h3 className="text-lg font-bold">Want to become an interviewer?</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            If you are faculty or an industry partner, you can volunteer to conduct mock interviews
            and help students succeed.
          </p>
          <Button variant="outline" className="rounded-full" disabled>
            Apply to Mentor
          </Button>
        </div>
      )}
    </div>
  );
}
