"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { logESGMetric, logCarbonMetric } from "@/lib/actions/sustainability.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LogMetricsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // ESG State
  const [esgData, setEsgData] = useState({ category: "ENVIRONMENTAL", name: "", value: "", unit: "" });
  
  // Carbon State
  const [carbonData, setCarbonData] = useState({ scope: "SCOPE_1", source: "", emissions: "" });

  const handleEsgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logESGMetric({
        ...esgData,
        value: parseFloat(esgData.value)
      });
      toast.success("ESG Metric Logged Successfully");
      router.push("/dashboard/sustainability");
    } catch (error) {
      toast.error("Failed to log ESG metric");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCarbonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await logCarbonMetric({
        ...carbonData,
        emissions: parseFloat(carbonData.emissions)
      });
      toast.success("Carbon Emissions Logged Successfully");
      router.push("/dashboard/sustainability");
    } catch (error) {
      toast.error("Failed to log Carbon emissions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8 pt-6">
      <Card>
        <CardHeader>
          <CardTitle>Log Sustainability Metrics</CardTitle>
          <CardDescription>Record ESG indicators or Carbon Footprint data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="esg" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="esg">ESG Metric</TabsTrigger>
              <TabsTrigger value="carbon">Carbon Footprint</TabsTrigger>
            </TabsList>
            
            <TabsContent value="esg">
              <form onSubmit={handleEsgSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select onValueChange={(val: any) => setEsgData({ ...esgData, category: val })} defaultValue={esgData.category}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ENVIRONMENTAL">Environmental</SelectItem>
                      <SelectItem value="SOCIAL">Social</SelectItem>
                      <SelectItem value="GOVERNANCE">Governance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Metric Name</Label>
                  <Input required value={esgData.name} onChange={e => setEsgData({ ...esgData, name: e.target.value })} placeholder="e.g. Diversity Ratio, Energy Saved" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Value</Label>
                    <Input required type="number" step="any" value={esgData.value} onChange={e => setEsgData({ ...esgData, value: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Unit</Label>
                    <Input required value={esgData.unit} onChange={e => setEsgData({ ...esgData, unit: e.target.value })} placeholder="e.g. %, kWh" />
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Log ESG Data</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="carbon">
              <form onSubmit={handleCarbonSubmit} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Emissions Scope</Label>
                  <Select onValueChange={(val: any) => setCarbonData({ ...carbonData, scope: val })} defaultValue={carbonData.scope}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SCOPE_1">Scope 1 (Direct)</SelectItem>
                      <SelectItem value="SCOPE_2">Scope 2 (Indirect - Energy)</SelectItem>
                      <SelectItem value="SCOPE_3">Scope 3 (Indirect - Value Chain)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Source Description</Label>
                  <Input required value={carbonData.source} onChange={e => setCarbonData({ ...carbonData, source: e.target.value })} placeholder="e.g. Fleet Vehicles, Purchased Electricity" />
                </div>

                <div className="space-y-2">
                  <Label>Emissions (tCO2e)</Label>
                  <Input required type="number" step="any" value={carbonData.emissions} onChange={e => setCarbonData({ ...carbonData, emissions: e.target.value })} placeholder="Metric tons of CO2 equivalent" />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>Log Carbon Data</Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
