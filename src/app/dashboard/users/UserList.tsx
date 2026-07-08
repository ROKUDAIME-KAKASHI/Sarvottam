"use client";

import { motion } from "framer-motion";
import { Mail, ShieldCheck, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateUserRole } from "@/app/actions/users";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ComingSoon } from "@/components/coming-soon";

export default function UserList({
  users,
}: {
  users: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: Date | string;
  }[];
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleRoleChange = (userId: string, newRole: string) => {
    startTransition(async () => {
      await updateUserRole(userId, newRole);
      router.refresh();
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0, transition: { type: "spring", bounce: 0.2 } as const },
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border/40 bg-muted/20">
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              User
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Role
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Joined
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground">
              Status
            </th>
            <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-muted-foreground text-right">
              Actions
            </th>
          </tr>
        </thead>
        <motion.tbody variants={container} initial="hidden" animate="show">
          {users.map((user) => (
            <motion.tr
              key={user.id}
              variants={item}
              className="group border-b border-border/30 hover:bg-primary/5 transition-colors"
            >
              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-sm uppercase">
                    {user.name ? user.name.slice(0, 2) : user.email.slice(0, 2)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">
                      {user.name || "Unknown"}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center mt-0.5">
                      <Mail className="h-3 w-3 mr-1 opacity-50" />
                      {user.email}
                    </span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-5">
                <select
                  disabled={isPending}
                  defaultValue={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  className="rounded-lg bg-background/50 font-bold text-[10px] tracking-wider border border-border/50 p-2 uppercase focus:ring-2 focus:ring-primary/50 outline-none"
                >
                  <option value="STUDENT">Student</option>
                  <option value="FACULTY">Faculty</option>
                  <option value="INDUSTRY_PARTNER">Industry Partner</option>
                  <option value="SUPERADMIN">Superadmin</option>
                </select>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center text-sm font-medium text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 mr-2 text-primary/60" />
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-5">
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]`}
                  />
                  <span className="text-sm font-bold text-foreground">Active</span>
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <ComingSoon feature="User management options">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </ComingSoon>
              </td>
            </motion.tr>
          ))}
        </motion.tbody>
      </table>
    </div>
  );
}
