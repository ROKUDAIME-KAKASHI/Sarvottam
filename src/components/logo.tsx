import * as React from "react";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Jain University Logo */}
      <div className="relative h-10 w-24">
        <Image 
          src="/jain-university-logo-png_seeklogo-432784.png" 
          alt="Jain University Logo" 
          fill
          className="object-contain"
        />
      </div>

      {/* Divider */}
      <div className="h-6 w-[1px] bg-border/50"></div>

      {/* IFQM Logo */}
      <div className="relative h-10 w-24">
        <Image 
          src="/0_Logo-IFQM.png" 
          alt="IFQM Logo" 
          fill
          className="object-contain"
        />
      </div>
      
      {/* Ecosystem Name */}
      <span className="ml-2 hidden sm:inline-block font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
        Sarvottam
      </span>
    </div>
  );
}
