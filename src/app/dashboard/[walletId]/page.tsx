"use client";

import {
  GearIcon,
  MagnifyingGlassIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddTransactionDialog } from "@/features/transactions/add-transaction-dialog";
import { columns } from "@/features/transactions/columns";
import { DataTable } from "@/features/transactions/data-table";
import { DeleteWalletDialog } from "@/features/transactions/delete-wallet-dialog";
import { TransactionTabs } from "@/features/transactions/transaction-tabs";
import { UpdateWalletDialog } from "@/features/transactions/update-wallet-dialog";
import { useWallet } from "@/features/transactions/use-wallet";
import { useAuth } from "@/hooks/auth";

export default function Wallet({ params }: { params: { walletId: string } }) {
  useAuth({ middleware: "auth" });

  const {
    addTransaction,
    categories,
    deleteTransaction,
    deleteWallet,
    error,
    isPending,
    updateWallet,
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
        <div className="mb-8 flex items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold tracking-tight">
            {wallet?.name}
          </h1>

          {wallet && (
            <div className="flex items-center gap-2">
              <HoverCard>
                <HoverCardTrigger className="inline-flex h-9 w-9 items-center justify-center">
                  <QuestionMarkIcon />
                </HoverCardTrigger>

                <HoverCardContent>
                  <h3 className="font-medium">How does it work?</h3>

                  <p className="mt-2 text-sm">
                    This is your wallet. Here you can add, update, or delete
                    transactions.
                  </p>

                  <p className="mt-2 text-sm">
                    Get a clear picture of your financial situation by comparing
                    your income and expenses, or by category.
                  </p>

                  <p className="mt-2 text-sm">
                    View all transactions for this wallet, and sort them by date
                    or amount.
                  </p>
                </HoverCardContent>
              </HoverCard>

              <UpdateWalletDialog wallet={wallet} updateWallet={updateWallet} />
              <DeleteWalletDialog wallet={wallet} deleteWallet={deleteWallet} />
            </div>
          )}
        </div>

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
