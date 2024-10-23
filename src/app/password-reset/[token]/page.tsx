import Link from "next/link";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";

import { PasswordResetForm } from "./password-reset-form";

export default function ForgotPassword() {
  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
        <Link
          href="/login"
          className={buttonVariants({ variant: "secondary" })}
        >
          I remember my password
        </Link>
      </Header>

      <main className="container max-w-screen-sm py-8">
        <PasswordResetForm />
      </main>
    </div>
  );
}
