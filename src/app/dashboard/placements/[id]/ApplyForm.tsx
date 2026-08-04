"use client";

import { useState } from "react";
import { applyToJob } from "@/lib/actions/placements.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Link as LinkIcon, FileText, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { FileUpload } from "@/components/ui/file-upload";

export function ApplyForm({ jobId }: { jobId: string }) {
  const [isPending, setIsPending] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string>("");
  const [uploadMode, setUploadMode] = useState<"link" | "upload">("upload");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    // Inject the uploaded resume URL if it exists
    if (uploadMode === "upload" && resumeUrl) {
      formData.set("resumeUrl", resumeUrl);
    }

    try {
      const res = await applyToJob(jobId, formData);
      if (res.success) {
        toast.success("Application submitted successfully!");
      } else {
        toast.error(res.error || "Failed to submit application");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="flex items-center gap-2">
            <LinkIcon className="w-4 h-4 text-primary" />
            Resume / Portfolio
          </Label>
          <div className="flex bg-muted/50 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setUploadMode("upload")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                uploadMode === "upload" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Upload PDF
            </button>
            <button
              type="button"
              onClick={() => setUploadMode("link")}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                uploadMode === "link" ? "bg-background shadow-sm" : "text-muted-foreground"
              }`}
            >
              Provide Link
            </button>
          </div>
        </div>

        {uploadMode === "upload" ? (
          resumeUrl ? (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                <CheckCircle className="w-5 h-5" />
                Resume uploaded successfully
              </div>
              <button
                type="button"
                onClick={() => setResumeUrl("")}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Change
              </button>
            </div>
          ) : (
            <FileUpload
              accept="application/pdf"
              maxSizeMB={5}
              onUploadSuccess={(url) => setResumeUrl(url)}
            />
          )
        ) : (
          <Input
            id="resumeUrl"
            name="resumeUrl"
            type="url"
            placeholder="https://your-portfolio.com or Google Drive link"
            required={uploadMode === "link"}
            className="bg-background/50"
          />
        )}
        <p className="text-xs text-muted-foreground">
          {uploadMode === "upload"
            ? "Upload your resume as a PDF file (Max 5MB)."
            : "Provide a link to your resume, LinkedIn, or personal portfolio."}
        </p>
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

      <Button
        type="submit"
        disabled={isPending || (uploadMode === "upload" && !resumeUrl)}
        className="w-full rounded-full shadow-lg shadow-primary/20"
      >
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
