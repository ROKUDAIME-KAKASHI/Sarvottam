import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
      <p className="text-lg font-medium text-muted-foreground animate-pulse">Loading...</p>
    </div>
  );
}
