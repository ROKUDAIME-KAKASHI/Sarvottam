"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Users, Briefcase, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { createDepartment } from "@/app/actions/departments";
import { toast } from "sonner";

export default function DepartmentsClient({ departments }: { departments: { id: string, name: string, description: string | null, _count?: { faculties: number, projects: number } }[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", bounce: 0.3 } as const }
  };

  const handleAdd = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await createDepartment(formData);
      if (res.success) {
        toast.success("Department created!");
        setIsAdding(false);
      } else {
        toast.error(res.error || "Failed to create department");
      }
    });
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Departments</h2>
          <p className="text-muted-foreground font-medium">Manage university departments and academic nodes.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-2">
          <Button onClick={() => setIsAdding(!isAdding)} size="sm" className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className={`h-4 w-4 mr-2 ${isAdding ? 'rotate-45' : ''} transition-transform`} />
            {isAdding ? 'Cancel' : 'Add Department'}
          </Button>
        </motion.div>
      </div>

      {isAdding && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 bg-muted/30 border-dashed">
            <form onSubmit={handleAdd} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <label className="text-sm font-bold">Department Name</label>
                <input required name="name" className="w-full h-10 px-3 rounded-md border bg-background" placeholder="e.g. Computer Science" />
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-bold">Description</label>
                <input name="description" className="w-full h-10 px-3 rounded-md border bg-background" placeholder="Brief description" />
              </div>
              <Button type="submit" disabled={isPending} className="h-10">
                Save
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      {departments.length === 0 && !isAdding && (
        <div className="text-center py-12 text-muted-foreground">No departments created yet.</div>
      )}

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <motion.div key={dept.id} variants={item}>
            <Card className="group h-full rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative">
              <CardHeader className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                    <Building className="h-5 w-5" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {dept.name}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase mt-1 line-clamp-1">
                  ID: {dept.id.slice(-6)} • {dept.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 pt-0 space-y-4">
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Users className="h-3 w-3"/> Faculties</span>
                    <span className="text-lg font-black">{dept._count?.faculties || 0}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Briefcase className="h-3 w-3"/> Projects</span>
                    <span className="text-lg font-black">{dept._count?.projects || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
