export default function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-6 md:py-0">
      <div className="mx-auto w-full max-w-7xl flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row px-4 md:px-6">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by JAIN University & IFQM. &copy; {new Date().getFullYear()} Sarvottam Ecosystem.
        </p>
      </div>
    </footer>
  );
}
