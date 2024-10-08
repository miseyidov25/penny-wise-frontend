import Link from "next/link";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";

import { LoginForm } from "./login-form";

export default function Login() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
        <Link
          href="/register"
          className={buttonVariants({ variant: "secondary" })}
        >
          Do you have an account?
        </Link>
      </Header>

      <main className="container max-w-screen-sm py-8">
        <LoginForm />
      </main>
    </div>
  );
}
