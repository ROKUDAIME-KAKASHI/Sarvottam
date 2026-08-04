"use client";

import { useState } from "react";
import { createInterviewSlot } from "@/lib/actions/placements.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

export function CreateSlotForm() {
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await createInterviewSlot(formData);
      if (res.success) {
        toast.success("Interview slot created successfully!");
        (e.target as HTMLFormElement).reset();
      } else {
        toast.error(res.error || "Failed to create slot");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto items-center justify-center"
    >
      <div className="flex-1 w-full">
        <Input type="datetime-local" name="startTime" required className="bg-background/50 h-11" />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="h-11 rounded-full px-6 w-full sm:w-auto"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Plus className="w-4 h-4 mr-2" />
        )}
        Create Slot
      </Button>
    </form>
  );
}
