"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createKPI, getKPICategories } from "@/lib/actions/kpi.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ManageKPIsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [categories, setCategories] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    metricName: "",
    description: "",
    categoryId: "",
    unit: "",
  });

  useEffect(() => {
    async function fetchCats() {
      const cats = await getKPICategories();
      setCategories(cats);
    }
    fetchCats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createKPI(formData);
      toast.success("KPI Created Successfully");
      router.push("/dashboard/kpis");
    } catch (error) {
      toast.error("Failed to create KPI");
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
            <CardTitle>Create New KPI</CardTitle>
            <CardDescription>Define a new performance metric to track over time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metricName">Metric Name</Label>
              <Input
                id="metricName"
                required
                value={formData.metricName}
                onChange={(e) => setFormData({ ...formData, metricName: e.target.value })}
                placeholder="e.g., Number of Publications"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <Select onValueChange={(val: any) => setFormData({ ...formData, categoryId: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select pillar..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit (Optional)</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  placeholder="e.g., %, Count, $"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Details about what this metric measures..."
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !formData.categoryId}>
              {loading ? "Creating..." : "Create KPI"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
