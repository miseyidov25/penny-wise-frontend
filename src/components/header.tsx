import Link from "next/link";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-50 border border-border/40 bg-background/60 py-2 backdrop-blur">
      <div className="container flex items-center justify-between">
        <Link href="/" className="font-medium">
          PennyWise
        </Link>

        <nav>{children}</nav>
      </div>
    </header>
  );
}
