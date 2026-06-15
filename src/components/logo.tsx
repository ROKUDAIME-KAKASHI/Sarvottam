import * as React from "react";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden flex-shrink-0 ${className}`}>
      <Image 
        src="/logo.png" 
        alt="Sarvottam" 
        fill
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
