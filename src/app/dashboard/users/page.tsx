"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Search, Mail, ShieldCheck, MoreHorizontal, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UsersPage() {
  const users = [
    { 
      id: "1", 
      name: "Dr. Ananya Sharma", 
      email: "ananya.s@jain.edu", 
      role: "FACULTY", 
      status: "Active",
      node: "Data Analytics",
      initials: "AS"
    },
    { 
      id: "2", 
      name: "Rahul Mehra", 
      email: "rahul.m@student.jain.edu", 
      role: "STUDENT", 
      status: "Active",
      node: "Engineering",
      initials: "RM"
    },
    { 
      id: "3", 
      name: "Vikram Malhotra", 
      email: "v.malhotra@ifqm.org", 
      role: "INDUSTRY_PARTNER", 
      status: "Pending",
      node: "Quality Excellence",
      initials: "VM"
    },
    { 
      id: "4", 
      name: "Admin Sarvottam", 
      email: "admin@sarvottam.ai", 
      role: "SUPERADMIN", 
      status: "Active",
      node: "Central Node",
      initials: "AD"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.2 } as const }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-foreground">User Management</h2>
          <p className="text-muted-foreground font-medium">Coordinate researchers, partners, and administrators across the ecosystem.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Button className="rounded-xl shadow-lg shadow-primary/20">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite User
          </Button>
        </motion.div>
      </div>

      <div className="grid gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative max-w-md group"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search by name, email, or node..." 
            className="pl-11 h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20 focus:border-primary/50 backdrop-blur-md transition-all"
          />
        </motion.div>

        <Card className="rounded-[2rem] border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/5 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20">
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">User</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Role</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Assigned Node</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                </tr>
              </thead>
              <motion.tbody 
                variants={container}
                initial="hidden"
                animate="show"
              >
                {users.map((user) => (
                  <motion.tr 
                    key={user.id} 
                    variants={item}
                    className="group border-b border-border/30 hover:bg-primary/5 transition-colors"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm">
                          {user.initials}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-foreground">{user.name}</span>
                          <span className="text-xs text-muted-foreground flex items-center mt-0.5">
                            <Mail className="h-3 w-3 mr-1 opacity-50" />
                            {user.email}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <Badge variant="outline" className="rounded-lg bg-background/50 font-bold text-[10px] tracking-wider border-border/50">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 mr-2 text-primary/60" />
                        {user.node}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`} />
                        <span className="text-sm font-bold text-foreground">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
