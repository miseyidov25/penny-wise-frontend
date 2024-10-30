"use client";

import { GearIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionDialog } from "@/features/transactions/add-transaction-dialog";
import { columns } from "@/features/transactions/columns";
import { DataTable } from "@/features/transactions/data-table";
import { TransactionTabs } from "@/features/transactions/transaction-tabs";
import { useWallet } from "@/features/transactions/use-wallet";
import { useAuth } from "@/hooks/auth";

export default function Wallet({ params }: { params: { walletId: string } }) {
  useAuth({ middleware: "auth" });

  const {
    addTransaction,
    categories,
    deleteTransaction,
    error,
    isPending,
    wallet,
  } = useWallet(params.walletId);

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
        {isPending && <Skeleton className="h-96 bg-card" />}

        {!isPending && wallet && (
          <section className="space-y-4">
            <TransactionTabs wallet={wallet} />

            <AddTransactionDialog
              addTransaction={addTransaction}
              categories={categories}
            />

            {wallet.transactions.length === 0 ? (
              <Alert variant="default">
                <MagnifyingGlassIcon />

                <AlertTitle>No transactions</AlertTitle>

                <AlertDescription>
                  No transactions found. Click the button below to add a new
                  transaction.
                </AlertDescription>
              </Alert>
            ) : (
              <div className="max-w-[calc(100vw-2rem)] overflow-x-auto whitespace-nowrap">
                <DataTable
                  columns={columns}
                  data={wallet.transactions.map((transaction) => ({
                    ...transaction,
                    deleteRow: () => deleteTransaction(transaction.id),
                  }))}
                />
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
