import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border border-border/40 bg-background/60 py-2 backdrop-blur">
      <div className="container grid grid-cols-[1fr,_auto,_auto] gap-4">
        <h1 className="flex items-center">
          <Link href="/" className="font-medium">
            PennyWise
          </Link>
        </h1>

        <ThemeToggle />

        <nav>{children}</nav>
      </div>
    </header>
  );
}
