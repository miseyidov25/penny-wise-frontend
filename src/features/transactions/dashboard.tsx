"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { AddTransactionDialog } from "./add-transaction-dialog";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AllTab, ExpenseTab, IncomeTab } from "./tabs";
import { useWallet } from "./use-wallet";

export function Dashboard({
  walletId,
  className,
}: {
  walletId: number;
  className?: string;
}) {
  const {
    wallet,
    error,
    addTransaction,
    isPending,
    categories,
    deleteTransaction,
  } = useWallet(walletId);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className={className}>
      <section>
        {isPending ? (
          <Skeleton className="h-[26.75rem] bg-secondary" />
        ) : wallet && wallet.transactions.length > 0 ? (
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="income">Income</TabsTrigger>
              <TabsTrigger value="expense">Expense</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <AllTab wallet={wallet} />
            </TabsContent>

            <TabsContent value="income">
              <IncomeTab wallet={wallet} />
            </TabsContent>

            <TabsContent value="expense">
              <ExpenseTab wallet={wallet} />
            </TabsContent>
          </Tabs>
        ) : (
          <Alert variant="destructive">
            <MagnifyingGlassIcon />
            <AlertTitle>No transactions</AlertTitle>

            <AlertDescription>
              No transactions found. Click the button below to add a new
              transaction.
            </AlertDescription>
          </Alert>
        )}
      </section>

      <section className="mt-8 space-y-4">
        <AddTransactionDialog
          addTransaction={addTransaction}
          categories={categories.map((category) => category.name)}
          isPending={isPending}
        />

        {isPending ? (
          <Skeleton className="h-[26.75rem] bg-secondary"></Skeleton>
        ) : (
          wallet && (
            <DataTable
              columns={columns}
              data={wallet.transactions.map((t) => ({
                ...t,
                deleteRow: () => deleteTransaction(t.id),
              }))}
            />
          )
        )}
      </section>
    </div>
  );
}
