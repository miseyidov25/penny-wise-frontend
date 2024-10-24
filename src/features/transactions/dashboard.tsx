"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

import { Skeleton } from "@/components/ui/skeleton";

import { AddTransactionDialog } from "./add-transaction-dialog";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { AllTab, ExpenseTab, IncomeTab } from "./transaction-tabs";
import type { AddTransactionPayload, Wallet } from "./types";

export function Dashboard({
  wallet,
  className,
}: {
  wallet: Wallet;
  className?: string;
}) {
  return (
    <div className={className}>
      <section>
        {isPending ? (
          <Skeleton className="h-[26.75rem] bg-secondary" />
        ) : wallet && wallet.transactions.length > 0 ? (
          
        ) : (

        )}
      </section>

      <section className="mt-8 space-y-4">
        {isPending ? (
          <Skeleton className="h-[26.75rem] bg-secondary" />
        ) : (
          wallet && (
            
          )
        )}
      </section>
    </div>
  );
}
