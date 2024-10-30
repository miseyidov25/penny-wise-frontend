"use client";

import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

export default function Home() {
  useAuth({ middleware: "guest" });

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
        <nav className="space-x-2">
          <Link
            href="/login"
            className={buttonVariants({ variant: "secondary" })}
          >
            Login
          </Link>

          <Link href="/register" className={buttonVariants()}>
            Sign up
          </Link>
        </nav>
      </Header>

      <main className="flex-grow py-8">
        <section className="container flex flex-col items-center justify-center gap-16 py-16 lg:flex-row">
          <div className="max-w-md space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight">
              Take Control of Your Finances with{" "}
              <span className="text-primary">PennyWise</span>
            </h1>

            <p className="text-lg text-muted-foreground">
              Managing your money shouldn&apos;t be complicated. With PennyWise,
              track your income and expenses effortlessly, build smarter
              budgets, and make informed financial decisions.
            </p>

            <Link
              href="/register"
              className={cn(buttonVariants({ size: "lg" }), "px-16")}
            >
              Sign up
            </Link>
          </div>

          <Image
            width={2315}
            height={1866}
            alt=""
            src="/hero.png"
            className="max-w-sm"
          />
        </section>

        <section className="container mt-8">
          <ul className="grid gap-8 lg:grid-cols-3">
            <li className="rounded-xl border bg-card p-6 text-card-foreground shadow">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Easy to Use
              </h3>

              <p className="mt-2">
                Clean, intuitive design for fast, hassle-free tracking.
              </p>
            </li>

            <li className="rounded-xl border bg-card p-6 text-card-foreground shadow">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Smart Insights
              </h3>

              <p className="mt-2">
                Get clear insights into your spending habits to stay on track.
              </p>
            </li>

            <li className="rounded-xl border bg-card p-6 text-card-foreground shadow">
              <h3 className="text-lg font-semibold leading-none tracking-tight">
                Personalized Budgets
              </h3>

              <p className="mt-2">
                Set flexible goals and watch your savings grow.
              </p>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
