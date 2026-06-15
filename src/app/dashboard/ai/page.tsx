import { getDashboardAI } from "@/lib/actions/ai.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Sparkles, UserCheck, Briefcase, Activity, AlertTriangle } from "lucide-react";

export default async function AICopilotPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const aiData = await getDashboardAI() as any;

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <BrainCircuit className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Copilot</h2>
          <p className="text-muted-foreground">Personalized insights and recommendations powered by Sarvottam AI.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* STUDENT VIEW */}
        {session.user.role === "STUDENT" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Briefcase className="w-5 h-5 mr-2"/> Recommended Projects</CardTitle>
                <CardDescription>Vector-matched based on your skills and interests.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiData.recommendedProjects?.map((p: any) => (
                  <div key={p.id} className="p-4 border rounded-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-bl-md">
                      {p.matchScore}% Match
                    </div>
                    <h4 className="font-semibold text-lg">{p.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{p.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><UserCheck className="w-5 h-5 mr-2"/> Recommended Faculty</CardTitle>
                <CardDescription>Potential mentors for your next venture.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiData.recommendedFaculty?.map((f: any) => (
                  <div key={f.id} className="flex justify-between items-center p-3 border-b last:border-0">
                    <span className="font-medium">{f.name || f.email}</span>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                      {f.matchScore}% Synergy
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="col-span-2 border-primary/50 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center text-primary"><Sparkles className="w-5 h-5 mr-2"/> Skill Gap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium mb-2">Identified Missing Skills:</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {aiData.skillGap?.missingSkills.map((s: string) => <Badge key={s} variant="destructive">{s}</Badge>)}
                </div>
                <p className="text-sm">{aiData.skillGap?.suggestion}</p>
              </CardContent>
            </Card>
          </>
        )}

        {/* FACULTY VIEW */}
        {session.user.role === "FACULTY" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Research Opportunities</CardTitle>
                <CardDescription>Matched problem statements and grants.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiData.researchOpportunities?.map((r: any) => (
                  <div key={r.id} className="p-4 border rounded-md">
                    <h4 className="font-semibold">{r.title}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    <div className="bg-primary/10 text-primary text-xs p-2 rounded mt-3 italic">
                      <Sparkles className="w-3 h-3 inline mr-1"/> {r.aiInsight}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Collaboration Suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiData.collaborationSuggestions?.map((c: any) => (
                  <div key={c.id} className="p-4 border rounded-md">
                    <h4 className="font-semibold">{c.name || c.email}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{c.reason}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* INDUSTRY VIEW */}
        {session.user.role === "INDUSTRY_PARTNER" && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Talent Matching</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiData.talentMatches?.map((t: any) => (
                  <div key={t.id} className="flex justify-between items-center p-3 border-b last:border-0">
                    <span className="font-medium">{t.name || t.email}</span>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">{t.alignment}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Research Commercialization Matches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiData.researchMatches?.map((r: any) => (
                  <div key={r.id} className="p-4 border rounded-md">
                    <h4 className="font-semibold">{r.title}</h4>
                    <p className="text-sm mt-1">Potential: <span className="font-bold text-green-600">{r.commercializationPotential}</span></p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {/* SUPERADMIN VIEW */}
        {session.user.role === "SUPERADMIN" && (
          <>
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center"><Activity className="w-5 h-5 mr-2"/> Executive Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg">{aiData.summary}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center"><Sparkles className="w-5 h-5 mr-2"/> Predictive Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {aiData.predictions?.map((p: string, idx: number) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-red-500"><AlertTriangle className="w-5 h-5 mr-2"/> Detected Anomalies</CardTitle>
              </CardHeader>
              <CardContent>
                {aiData.anomalies?.length > 0 ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-red-600 dark:text-red-400">
                    {aiData.anomalies.map((a: string, idx: number) => (
                      <li key={idx}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No anomalies detected.</p>
                )}
              </CardContent>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}
