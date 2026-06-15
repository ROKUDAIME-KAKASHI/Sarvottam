"use client";

import { useState } from "react";
import { applyToJob } from "@/lib/actions/placements.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Link as LinkIcon, FileText } from "lucide-react";
import { toast } from "sonner";

export function ApplyForm({ jobId }: { jobId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      const res = await applyToJob(jobId, formData);
      if (res.success) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(res.error || "Failed to submit application");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="resumeUrl" className="flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-primary" />
          Resume Link / Portfolio
        </Label>
        <Input 
          id="resumeUrl" 
          name="resumeUrl" 
          type="url" 
          placeholder="https://your-portfolio.com or Google Drive link" 
          required 
          className="bg-background/50"
        />
        <p className="text-xs text-muted-foreground">Provide a link to your resume, LinkedIn, or personal portfolio.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverLetter" className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          Cover Letter / Pitch
        </Label>
        <Textarea 
          id="coverLetter" 
          name="coverLetter" 
          placeholder="Why are you a good fit for this role?" 
          rows={5} 
          required
          className="bg-background/50 resize-y"
        />
      </div>

      <Button type="submit" disabled={isPending} className="w-full rounded-full shadow-lg shadow-primary/20">
        {isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Application"
        )}
      </Button>
    </form>
  );
}
