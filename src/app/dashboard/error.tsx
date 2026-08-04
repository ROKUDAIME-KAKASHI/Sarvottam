"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center">
      <AlertCircle className="h-10 w-10 text-destructive" />
      <div className="space-y-2">
        <h2 className="text-xl font-bold">Something went wrong in the dashboard!</h2>
        <p className="text-sm text-muted-foreground max-w-[500px]">
          We encountered an unexpected error while loading this module. Please try again.
        </p>
      </div>
      <Button onClick={() => reset()} variant="outline">
        Try again
      </Button>
    </div>
  );
}
