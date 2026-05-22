import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t border-border px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-xs text-muted sm:flex-row">
        <p>© {new Date().getFullYear()} Exam AI. Built for UPSC aspirants.</p>
        <div className="flex gap-6">
          <Link href="#" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Terms
          </Link>
          <Link href="#" className="transition-colors hover:text-foreground">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
