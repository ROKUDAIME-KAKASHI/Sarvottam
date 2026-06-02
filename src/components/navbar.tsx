import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

export default async function Navbar() {
  const session = await auth();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center p-4 w-full pointer-events-none">
      <header className="pointer-events-auto flex items-center justify-between px-6 py-3 w-full max-w-5xl rounded-full border border-border/40 bg-background/60 backdrop-blur-xl shadow-sm transition-all">
        <div className="flex items-center gap-6 md:gap-8">
          <Link href="/" className="flex items-center space-x-2 group">
            <Logo className="h-6 w-6 transition-transform group-hover:scale-105" />
            <span className="font-bold text-lg tracking-tight inline-block text-foreground">Sarvottam</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/framework" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Framework
            </Link>
            <Link href="/problems" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Problems
            </Link>
            <Link href="/research" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Research
            </Link>
          </nav>
        </div>
        
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          {session ? (
            <Link href="/dashboard" className={buttonVariants({ variant: "default", size: "sm", className: "rounded-full shadow-sm" })}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm", className: "rounded-full hidden sm:inline-flex" })}>
                Log in
              </Link>
              <Link href="/login" className={buttonVariants({ size: "sm", className: "rounded-full shadow-md shadow-primary/20" })}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}
