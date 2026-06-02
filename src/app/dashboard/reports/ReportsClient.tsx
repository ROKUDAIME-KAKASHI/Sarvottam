"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateReport } from "@/app/actions/reports";
import { useTransition } from "react";

export default function ReportsClient({ reports, role }: { reports: any[], role: string }) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const title = `System Snapshot - ${new Date().toLocaleDateString()}`;
      await generateReport(title);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
          <p className="text-muted-foreground">View analytics and generated system reports.</p>
        </div>
        {role === "SUPERADMIN" && (
          <Button onClick={handleGenerate} disabled={isPending} size="sm" className="shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4 mr-2" />
            Generate New Report
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Generated Reports</CardTitle>
          </div>
          <CardDescription>
            {reports.length === 0 ? "No reports have been generated yet." : "Recent snapshots of system activity."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">Reports will appear here once your projects reach the evaluation stage.</p>
          ) : (
            <div className="space-y-2">
              {reports.map((report, i) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{report.title}</p>
                      <p className="text-xs text-muted-foreground">Generated on {new Date(report.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
