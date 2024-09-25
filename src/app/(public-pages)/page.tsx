import Link from "next/link";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
        <Link
          href="/login"
          className={buttonVariants({ variant: "secondary" })}
        >
          Login
        </Link>
      </Header>

      <main></main>
    </div>
  );
}
