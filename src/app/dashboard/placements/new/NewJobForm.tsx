"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJob } from "@/lib/actions/placements.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NewJobForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createJob(formData);
      if (res.success) {
        toast.success("Job posted successfully!");
        router.push("/dashboard/placements");
      } else {
        toast.error(res.error || "Failed to post job");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="e.g. Junior Frontend Developer"
          required
          className="bg-background/50"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="company">Company / Organization</Label>
          <Input
            id="company"
            name="company"
            placeholder="e.g. TechFlow Innovations"
            required
            className="bg-background/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g. Remote, Bangalore, etc."
            required
            className="bg-background/50"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Job Type</Label>
        <select
          id="type"
          name="type"
          required
          className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="FULL_TIME">Full Time</option>
          <option value="PART_TIME">Part Time</option>
          <option value="INTERNSHIP">Internship</option>
          <option value="CONTRACT">Contract</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Job Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe the role, responsibilities, and requirements..."
          rows={8}
          required
          className="bg-background/50 resize-y"
        />
      </div>

      <div className="pt-4 border-t border-border/50 flex justify-end gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard/placements")}
          disabled={isPending}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isPending}
          className="rounded-full shadow-lg shadow-primary/20 px-8"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Job"
          )}
        </Button>
      </div>
    </form>
  );
}
