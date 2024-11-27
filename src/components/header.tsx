import { FileTextIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";

import { buttonVariants } from "./ui/button";

export function Header({
  children,
  isAuthorized,
}: {
  children?: React.ReactNode;
  isAuthorized?: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 border border-border/40 bg-background/60 py-2 backdrop-blur">
      <div className="container flex gap-4">
        <h1 className="flex flex-grow items-center">
          <Link
            href={isAuthorized ? "/dashboard" : "/"}
            className="font-medium"
          >
            PennyWise
          </Link>
        </h1>

        <Link
          href="user_manual.pdf"
          className={buttonVariants({ size: "icon", variant: "outline" })}
        >
          <FileTextIcon />
        </Link>

        <ThemeToggle />

        <nav>{children}</nav>
      </div>
    </header>
  );
}
