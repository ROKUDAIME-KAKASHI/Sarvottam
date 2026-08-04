import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconClassName?: string;
  className?: string;
  children?: ReactNode; // For actions or extra content
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  iconClassName,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 md:p-8 rounded-3xl border border-border/50 shadow-sm relative overflow-hidden",
        className
      )}
    >
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4 pointer-events-none" />

      <div className="relative z-10 space-y-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2.5 bg-primary/10 rounded-xl text-primary", iconClassName)}>
            <Icon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        </div>
        <p className="text-muted-foreground font-medium max-w-xl">{description}</p>
      </div>

      {children && <div className="relative z-10 shrink-0">{children}</div>}
    </div>
  );
}
