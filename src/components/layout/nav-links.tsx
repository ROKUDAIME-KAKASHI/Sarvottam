"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { name: "Framework", href: "/framework" },
  { name: "Problems", href: "/problems" },
  { name: "Research", href: "/research" },
];

export function NavLinks() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center gap-6">
      {LINKS.map((link) => {
        const isActive =
          pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-medium transition-colors ${
              isActive ? "text-primary font-bold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
