import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/providers/theme-toggle";
import { Logo } from "@/components/logo";
import { NavLinks } from "@/components/layout/nav-links";
import { MobileNav } from "@/components/layout/mobile-nav";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-3 sm:p-4 w-full pointer-events-none">
      <header className="pointer-events-auto flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 w-full max-w-5xl rounded-full border border-border/50 bg-background/70 backdrop-blur-xl shadow-xs transition-all">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2.5 group">
            <Logo className="h-6 w-6 text-primary transition-transform group-hover:scale-105" />
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight inline-block text-foreground">
                Sarvottam
              </span>
              <span className="hidden sm:inline-flex text-[9px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold uppercase tracking-wider">
                JAIN × IFQM
              </span>
            </div>
          </Link>
          <NavLinks />
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <ThemeToggle />
          {session ? (
            <Link
              href="/dashboard"
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "rounded-full shadow-xs text-xs font-semibold px-4",
              })}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "rounded-full hidden sm:inline-flex text-xs",
                })}
              >
                Log in
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  size: "sm",
                  className: "rounded-full shadow-xs text-xs font-semibold px-4",
                })}
              >
                Get Started
              </Link>
            </>
          )}
          <MobileNav isLoggedIn={!!session} />
        </div>
      </header>
    </div>
  );
}
