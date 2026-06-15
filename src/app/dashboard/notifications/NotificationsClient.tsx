"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markAllAsRead, markNotificationAsRead, deleteNotification } from "@/app/actions/notifications";
import { useTransition } from "react";
import { toast } from "sonner";

export default function NotificationsClient({ notifications }: { notifications: { id: string, message: string, read: boolean, createdAt: Date | string }[] }) {
  const [isPending, startTransition] = useTransition();

  const handleMarkAllAsRead = () => {
    startTransition(async () => {
      const res = await markAllAsRead();
      if (res.success) toast.success("All notifications marked as read");
    });
  };

  const handleMarkAsRead = (id: string) => {
    startTransition(async () => {
      await markNotificationAsRead(id);
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const res = await deleteNotification(id);
      if (res.success) toast.success("Notification deleted");
      else toast.error("Failed to delete notification");
    });
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Notifications</h2>
          <p className="text-muted-foreground font-medium">Stay updated with your latest alerts.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleMarkAllAsRead}
            disabled={isPending || notifications.length === 0}
            className="text-muted-foreground hover:text-foreground"
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </motion.div>
      </div>

      {notifications.length === 0 ? (
         <div className="text-center py-12 text-muted-foreground">You have no notifications.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif, i) => (
            <motion.div 
              key={notif.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card 
                onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                className={`group overflow-hidden rounded-2xl border-border/50 backdrop-blur-sm transition-all cursor-pointer ${notif.read ? 'bg-background/20 opacity-70' : 'bg-background/80 hover:bg-background'}`}
              >
                <CardContent className="p-4 sm:p-6 flex items-start gap-4 sm:gap-6 relative">
                  {!notif.read && <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-primary" />}
                  <div className={`mt-1 h-10 w-10 shrink-0 rounded-full flex items-center justify-center ${notif.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm sm:text-base ${notif.read ? 'font-medium' : 'font-bold'} text-foreground`}>Notification</p>
                      <span className="text-xs font-medium text-muted-foreground shrink-0 ml-4">
                        {new Date(notif.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notif.message}</p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      disabled={isPending}
                      onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                      className="h-8 w-8 text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
