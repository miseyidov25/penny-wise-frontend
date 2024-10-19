"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

import { AddTransactionForm } from "./add-transaction-form";
import { useWallet } from "./use-wallet";
import { Wallet } from "./wallet";

export function Dashboard({ walletId }: { walletId: number }) {
  useAuth({ middleware: "auth" });

  const { wallet, categories, error, addTransaction, isPending } =
    useWallet(walletId);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header />

      <main className="container max-w-screen-sm py-8">
        <div className="mt-8">
          {wallet ? (
            <Wallet wallet={wallet} categories={categories} />
          ) : (
            <ul className="space-y-2">
              <li>
                <Skeleton className="h-[74px] rounded-md bg-card" />
              </li>

              <li>
                <Skeleton className="h-[74px] rounded-md bg-card" />
              </li>

              <li>
                <Skeleton className="h-[74px] rounded-md bg-card" />
              </li>
            </ul>
          )}
        </div>
      </main>

      <footer className="container grid max-w-screen-sm grid-cols-3">
        <AddTransactionForm
          onSubmit={(values) => addTransaction(values)}
          categories={categories.map((category) => category.name)}
          isPending={isPending}
          className={cn(buttonVariants({ size: "lg" }), "col-start-2")}
        />
      </footer>
    </div>
  );
}
