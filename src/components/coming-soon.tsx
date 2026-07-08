"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface ComingSoonProps {
  children: ReactNode;
  feature?: string;
}

export function ComingSoon({ children }: ComingSoonProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push("/coming-soon");
  };

  return (
    <div onClick={handleClick} className="cursor-pointer contents">
      {children}
    </div>
  );
}
