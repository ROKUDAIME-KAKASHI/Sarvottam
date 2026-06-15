import * as React from "react";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative h-10 w-10 overflow-hidden rounded-md">
        <Image 
          src="/logo.png" 
          alt="Sarvottam Logo" 
          fill
          className="object-contain"
        />
      </div>
      <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        Sarvottam
      </span>
    </div>
  );
}
