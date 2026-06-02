"use client";

import { usePathname } from "next/navigation";

export function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  
  return (
    <div style={{ display: isDashboard ? 'none' : 'contents' }}>
      {children}
    </div>
  );
}
