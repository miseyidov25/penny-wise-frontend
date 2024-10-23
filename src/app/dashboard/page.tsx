"use client";

import { GearIcon } from "@radix-ui/react-icons";
import { AxiosError } from "axios";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddWalletDialog } from "@/features/transactions/add-wallet-dialog";
import { Dashboard } from "@/features/transactions/dashboard";
import type { Wallet } from "@/features/transactions/types";
import { useAuth } from "@/hooks/auth";
import { axiosInstance } from "@/lib/axios";

export default function Page() {
  useAuth({ middleware: "auth" });

  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isPending, startTransition] = useTransition();
  const [walletId, setWalletId] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    startTransition(async () => {
      try {
        const response = await axiosInstance.get<{ wallets: Wallet[] }>(
          "/api/wallets",
          {
            signal: controller.signal,
          },
        );

        setWallets(response.data.wallets);
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        toast.error("Failed to fetch wallets");
      }
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
        <Link
          href="/settings/profile"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <GearIcon />
        </Link>
      </Header>

      <main className="container max-w-screen-sm py-8">
        <section className="grid grid-cols-[1fr,_auto] gap-4">
          <Select onValueChange={(walletId) => setWalletId(+walletId)}>
            <SelectTrigger disabled={isPending}>
              <SelectValue placeholder="Select a wallet" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectLabel>Wallets</SelectLabel>

                {wallets.map((wallet) => (
                  <SelectItem value={wallet.id.toString()} key={wallet.id}>
                    {wallet.name} (
                    {new Intl.NumberFormat("de-DE", {
                      style: "currency",
                      currency: wallet.currency,
                    }).format(Number(wallet.balance))}
                    )
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <AddWalletDialog setWallets={setWallets} />
        </section>

        {walletId && <Dashboard walletId={walletId} className="mt-8" />}
      </main>
    </div>
  );
}
