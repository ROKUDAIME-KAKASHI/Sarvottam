"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

export function HideOnDashboard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  if (isDashboard) {
    return null;
  }

  return <>{children}</>;
}
