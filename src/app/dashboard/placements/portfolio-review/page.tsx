import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileCode, Star, Send } from "lucide-react";
import { getTopPortfolios, submitPortfolioReview } from "@/lib/actions/placements.actions";
import { PageHeader } from "@/components/layout/PageHeader";

export default async function PortfolioReviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const topPortfolios = await getTopPortfolios();

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 p-8 pt-6">
      <PageHeader
        title="Portfolio Review"
        description="Submit your portfolio, GitHub, or research papers for expert feedback."
        icon={FileCode}
        iconClassName="text-emerald-500 bg-emerald-500/10"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-border/50 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Submit for Review</CardTitle>
            <CardDescription>Share your work with our panel of experts.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={submitPortfolioReview} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Portfolio URL</label>
                <input
                  name="portfolioUrl"
                  type="url"
                  required
                  placeholder="https://your-portfolio.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">What do you want feedback on?</label>
                <textarea
                  name="feedbackGoal"
                  placeholder="I would love feedback on my UI/UX choices..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Button type="submit" className="w-full rounded-full shadow-sm shadow-primary/20">
                <Send className="w-4 h-4 mr-2" /> Submit
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/50 bg-gradient-to-br from-emerald-500/5 via-card to-card">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-500">
                <Star className="w-5 h-5 mr-2" /> Top Portfolios this Month
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {topPortfolios.length === 0 ? (
                <div className="text-center p-4 text-sm text-muted-foreground">
                  No portfolios rated yet.
                </div>
              ) : (
                topPortfolios.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center p-3 bg-background rounded-xl border border-border/50"
                  >
                    <span className="font-medium text-sm">{p.student.name || "Student"}</span>
                    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600">
                      {p.score}/100
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
