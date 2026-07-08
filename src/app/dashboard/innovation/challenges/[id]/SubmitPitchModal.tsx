"use client";

import { useState } from "react";
import { submitPitch } from "@/lib/actions/innovation.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload } from "lucide-react";

export default function SubmitPitchModal({
  challengeId,
  myStartups,
}: {
  challengeId: string;
  myStartups: any[];
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    deckUrl: "",
    startupId: "none",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        deckUrl: formData.deckUrl || undefined,
        challengeId,
        startupId: formData.startupId === "none" ? undefined : formData.startupId,
      };
      await submitPitch(payload);
      toast.success("Pitch submitted successfully!");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to submit pitch");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="w-full">
            <Upload className="w-4 h-4 mr-2" /> Submit Pitch
          </Button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Your Pitch</DialogTitle>
            <DialogDescription>Present your solution to the challenge.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Project / Pitch Title</Label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AI-Driven Supply Chain Optimizer"
              />
            </div>

            <div className="space-y-2">
              <Label>Link to existing Startup (Optional)</Label>
              <Select
                onValueChange={(val: any) => setFormData({ ...formData, startupId: val })}
                defaultValue={formData.startupId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select startup..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Startup / Individual Submission</SelectItem>
                  {myStartups.map((startup) => (
                    <SelectItem key={startup.id} value={startup.id}>
                      {startup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Pitch Deck URL (Optional)</Label>
              <Input
                type="url"
                value={formData.deckUrl}
                onChange={(e) => setFormData({ ...formData, deckUrl: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Explain your approach..."
                className="h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.description}>
              {loading ? "Submitting..." : "Submit Pitch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
