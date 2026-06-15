"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createProject, getSustainabilityDashboardData } from "@/lib/actions/sustainability.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export default function NewSustainabilityProjectPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", sdgIds: [] as string[] });
  const [sdgs, setSdgs] = useState<any[]>([]);

  useEffect(() => {
    getSustainabilityDashboardData().then(data => setSdgs(data.sdgs));
  }, []);

  const toggleSdg = (id: string) => {
    setFormData(prev => ({
      ...prev,
      sdgIds: prev.sdgIds.includes(id) ? prev.sdgIds.filter(s => s !== id) : [...prev.sdgIds, id]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createProject(formData);
      toast.success("Project Created Successfully");
      router.push("/dashboard/sustainability");
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pt-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Sustainability Project</CardTitle>
            <CardDescription>Launch an initiative and map it to UN Sustainable Development Goals.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" 
                required 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="e.g., Campus Solar Microgrid" 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="What are the sustainability objectives?" 
              />
            </div>

            <div className="space-y-2">
              <Label>Map to SDGs (Select all that apply)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                {sdgs.map(sdg => {
                  const isSelected = formData.sdgIds.includes(sdg.id);
                  return (
                    <div 
                      key={sdg.id} 
                      onClick={() => toggleSdg(sdg.id)}
                      className={`cursor-pointer border rounded-md p-2 text-sm flex items-center transition-colors ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary'}`}
                    >
                      <div className="w-4 h-4 rounded-full mr-2 shrink-0" style={{ backgroundColor: sdg.color }}></div>
                      <span className="line-clamp-1">{sdg.sdgNumber}. {sdg.title}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading || !formData.title || formData.sdgIds.length === 0}>
              {loading ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
