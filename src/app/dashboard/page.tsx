"use client";

import { GearIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddWalletDialog } from "@/features/transactions/add-wallet-dialog";
import { useWallets } from "@/features/transactions/use-wallets";
import { useAuth } from "@/hooks/auth";

export default function Wallets() {
  useAuth({ middleware: "auth" });

  const { addWallet, balance, error, isPending, wallets } = useWallets();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header isAuthorized>
        <Link
          href="/settings/profile"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <GearIcon />
        </Link>
      </Header>

      <main className="container space-y-8 py-8">
        {balance && (
          <div className="flex flex-col items-center">
            <p className="text-4xl font-extrabold tracking-tight">{balance}</p>
            <HoverCard>
              <HoverCardTrigger className="text-muted-foreground underline-offset-4 hover:underline">
                (total)
              </HoverCardTrigger>

              <HoverCardContent>
                <h3 className="font-medium">How does it work?</h3>

                <p className="mt-2 text-sm">
                  See the combined balance from all wallets in your primary
                  currency.
                </p>

                <p className="mt-2 text-sm">
                  Balances refresh automatically, using the latest exchange
                  rates to convert currencies.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        )}

        {
          <ul className="inline-flex flex-wrap justify-center gap-8">
            {isPending ? (
              <>
                <li>
                  <Skeleton className="h-64 w-96 rounded-xl bg-secondary" />
                </li>

                <li>
                  <Skeleton className="h-64 w-96 rounded-xl bg-secondary" />
                </li>
              </>
            ) : (
              <>
                {wallets.map((wallet) => (
                  <li key={wallet.id}>
                    <Link
                      href={`/dashboard/${wallet.id}`}
                      className="flex h-64 w-96 flex-col gap-2 rounded-xl border border-input bg-background p-8 shadow hover:bg-accent hover:text-accent-foreground"
                    >
                      <div className="flex justify-between gap-4">
                        <p className="truncate text-clip text-xl font-medium">
                          {wallet.name}
                        </p>
                      </div>

                      <p>
                        {new Intl.NumberFormat("de-DE", {
                          style: "currency",
                          currency: wallet.currency,
                        }).format(Number(wallet.balance))}
                      </p>
                    </Link>
                  </li>
                ))}
              </>
            )}

            <li>
              <AddWalletDialog addWallet={addWallet} />
            </li>
          </ul>
        }
      </main>
    </div>
  );
}
