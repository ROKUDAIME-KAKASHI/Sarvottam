"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFramework } from "@/lib/actions/excellence.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";

export default function NewFrameworkPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "", version: "1.0" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createFramework(formData);
      toast.success("Framework created successfully");
      router.push("/dashboard/excellence/frameworks");
    } catch (error) {
      toast.error("Failed to create framework");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 pt-6">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>New Excellence Framework</CardTitle>
            <CardDescription>Create a new framework structure like EFQM or Baldrige.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Framework Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g., Sarvottam Excellence Model" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input 
                id="version" 
                value={formData.version} 
                onChange={(e) => setFormData({ ...formData, version: e.target.value })} 
                placeholder="e.g., 2024" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Briefly describe the purpose of this framework..." 
                rows={4} 
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Framework"}</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
