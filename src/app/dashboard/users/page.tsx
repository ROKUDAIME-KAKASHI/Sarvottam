import { Card } from "@/components/ui/card";
import { Search } from "lucide-react";
import {} from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { prisma } from "@/lib/prisma";
import UserList from "./UserList";
import { InviteUser } from "./InviteUser";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-foreground">User Management</h2>
          <p className="text-muted-foreground font-medium">
            Coordinate researchers, partners, and administrators across the ecosystem.
          </p>
        </div>

        <div>
          <InviteUser />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="relative max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name, email, or node..."
            className="pl-11 h-12 bg-background/50 border-border/50 rounded-xl focus:ring-primary/20 focus:border-primary/50 backdrop-blur-md transition-all"
          />
        </div>

        <Card className="rounded-[2rem] border-border/50 bg-background/40 backdrop-blur-xl overflow-hidden shadow-xl shadow-black/5 relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <UserList users={users.map((u) => ({ ...u, email: u.email || "" }))} />
        </Card>
      </div>
    </div>
  );
}
