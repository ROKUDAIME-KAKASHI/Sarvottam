import * as React from "react";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image 
        src="/logo.png" 
        alt="Sarvottam Logo" 
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}
