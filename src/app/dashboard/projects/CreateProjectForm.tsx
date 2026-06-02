"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { createProject } from "@/app/actions/projects";

export default function CreateProjectForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createProject(formData);

    if (result.error) {
      setError(result.error);
    } else {
      setIsOpen(false);
    }
    
    setIsSubmitting(false);
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        size="sm" 
        className="rounded-xl shadow-lg shadow-primary/20"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Project
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-background border border-border p-6 rounded-2xl shadow-2xl w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Create New Project</h3>
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Title</label>
                <input 
                  type="text" 
                  name="title" 
                  required 
                  className="w-full p-3 mt-1 rounded-xl bg-muted/30 border border-border/50 text-foreground"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Description</label>
                <textarea 
                  name="description" 
                  required 
                  rows={4}
                  className="w-full p-3 mt-1 rounded-xl bg-muted/30 border border-border/50 text-foreground"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Difficulty</label>
                  <select name="difficultyLevel" className="w-full p-3 mt-1 rounded-xl bg-muted/30 border border-border/50 text-foreground appearance-none">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">Duration</label>
                  <input type="text" name="duration" placeholder="e.g. 3 Months" className="w-full p-3 mt-1 rounded-xl bg-muted/30 border border-border/50 text-foreground" />
                </div>
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Project
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
