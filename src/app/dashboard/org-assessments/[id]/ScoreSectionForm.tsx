"use client";

import { useState } from "react";
import { submitEvaluationScore } from "@/lib/actions/org-assessment.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function ScoreSectionForm({ 
  sectionId, 
  assessmentId, 
  existingScores, 
  currentUserId 
}: { 
  sectionId: string, 
  assessmentId: string, 
  existingScores: any[], 
  currentUserId: string 
}) {
  const existingMyScore = existingScores.find(s => s.evaluator.userId === currentUserId);
  
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(existingMyScore?.score || "");
  const [feedback, setFeedback] = useState(existingMyScore?.feedback || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await submitEvaluationScore({
        sectionId,
        assessmentId,
        score: parseFloat(score as string),
        feedback
      });
      toast.success("Score submitted successfully");
    } catch (error) {
      toast.error("Failed to submit score");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4">
        <div className="w-1/3">
          <Input 
            type="number" 
            min={0} 
            max={100} 
            step={0.1}
            placeholder="Score (0-100)" 
            value={score} 
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>
        <div className="w-2/3 flex gap-2">
          <Textarea 
            placeholder="Feedback or justification..." 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[40px] h-10"
          />
          <Button type="submit" disabled={loading} className="shrink-0">
            {existingMyScore ? "Update" : "Submit"}
          </Button>
        </div>
      </div>
      {existingScores.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs text-muted-foreground mb-2">All Scores for this section:</p>
          <ul className="space-y-1">
            {existingScores.map(s => (
              <li key={s.id} className="text-xs flex justify-between">
                <span className="font-medium">{s.evaluator.user.name}</span>
                <span>{s.score} - {s.feedback}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
