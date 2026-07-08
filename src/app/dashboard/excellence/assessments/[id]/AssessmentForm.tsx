"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitAssessment } from "@/lib/actions/excellence.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AssessmentForm({
  template,
  resultId,
}: {
  template: any;
  resultId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState<
    Record<string, { numericValue?: number; textValue?: string; notes?: string }>
  >({});

  // Group questions by dimension
  const questionsByDimension = template.questions.reduce((acc: any, q: any) => {
    const dimName = q.dimension.name;
    if (!acc[dimName]) acc[dimName] = [];
    acc[dimName].push(q);
    return acc;
  }, {});

  const handleNumericChange = (qId: string, val: string) => {
    setResponses((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], numericValue: parseInt(val, 10) },
    }));
  };

  const handleNotesChange = (qId: string, val: string) => {
    setResponses((prev) => ({
      ...prev,
      [qId]: { ...prev[qId], notes: val },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formattedResponses = Object.keys(responses).map((qId) => ({
      questionId: qId,
      ...responses[qId],
    }));

    try {
      await submitAssessment(resultId, formattedResponses);
      toast.success("Assessment submitted successfully");
      router.push("/dashboard/excellence/results");
    } catch (error) {
      toast.error("Failed to submit assessment");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {Object.keys(questionsByDimension).map((dimName) => (
        <Card key={dimName}>
          <CardHeader>
            <CardTitle>{dimName}</CardTitle>
            <CardDescription>Evaluate parameters related to {dimName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questionsByDimension[dimName].map((q: any) => (
              <div key={q.id} className="p-4 border rounded-lg bg-card/50 space-y-4">
                <div>
                  <Label className="text-base">{q.text}</Label>
                  {q.guidance && <p className="text-sm text-muted-foreground mt-1">{q.guidance}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Score (1 - {q.maxValue})</Label>
                    <Input
                      type="number"
                      min={1}
                      max={q.maxValue}
                      required
                      onChange={(e) => handleNumericChange(q.id, e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Evidence / Notes</Label>
                    <Textarea
                      placeholder="Provide justification or links to evidence..."
                      rows={2}
                      onChange={(e) => handleNotesChange(q.id, e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Assessment"}
        </Button>
      </div>
    </form>
  );
}
