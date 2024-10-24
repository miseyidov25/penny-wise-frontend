"use client";

import { GearIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionDialog } from "@/features/transactions/add-transaction-dialog";
import { AddWalletDialog } from "@/features/transactions/add-wallet-dialog";
import { columns } from "@/features/transactions/columns";
import { DataTable } from "@/features/transactions/data-table";
import { TransactionTabs } from "@/features/transactions/transaction-tabs";
import { useWallets } from "@/features/transactions/use-wallets";
import { useAuth } from "@/hooks/auth";

export default function Page() {
  useAuth({ middleware: "auth" });

  const {
    addTransaction,
    addWallet,
    categories,
    deleteTransaction,
    deleteWallet,
    error,
    isPending,
    isWalletPending,
    selectedWallet,
    selectWallet,
    updateWallet,
    wallets,
  } = useWallets();

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

      <main className="container max-w-screen-sm py-8">
        <section className="grid grid-cols-[1fr,_auto] gap-4">
          <Select onValueChange={(walletId) => selectWallet(walletId)}>
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

          <AddWalletDialog addWallet={addWallet} />
        </section>

        {isWalletPending && <Skeleton className="mt-8 h-96 bg-card" />}

        {!isWalletPending && selectedWallet && (
          <section className="mt-8 space-y-4">
            <TransactionTabs
              wallet={selectedWallet}
              updateWallet={updateWallet}
              deleteWallet={deleteWallet}
            />

            <AddTransactionDialog
              addTransaction={addTransaction}
              categories={categories}
            />

            {selectedWallet.transactions.length === 0 ? (
              <Alert variant="default">
                <MagnifyingGlassIcon />

                <AlertTitle>No transactions</AlertTitle>

                <AlertDescription>
                  No transactions found. Click the button below to add a new
                  transaction.
                </AlertDescription>
              </Alert>
            ) : (
              <DataTable
                columns={columns}
                data={selectedWallet.transactions.map((transaction) => ({
                  ...transaction,
                  deleteRow: () => deleteTransaction(transaction.id),
                }))}
              />
            )}
          </section>
        )}
      </main>
    </div>
  );
}
