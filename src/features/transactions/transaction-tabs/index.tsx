import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type { UpdateWalletPayload, Wallet } from "../types";
import { UpdateWalletDialog } from "../update-wallet-dialog";
import { AllTab } from "./all-tab";
import { ExpenseTab } from "./expense-tab";
import { IncomeTab } from "./income-tab";

export function TransactionTabs({
  wallet,
  updateWallet,
  deleteWallet,
}: {
  wallet: Wallet;
  updateWallet(
    payload: UpdateWalletPayload,
  ): Promise<{ error: string } | undefined>;
  deleteWallet(): Promise<{ error: string } | undefined>;
}) {
  return (
    <Tabs defaultValue="all">
      <div className="flex justify-between">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
          <TabsTrigger value="expense">Expense</TabsTrigger>
        </TabsList>

        <UpdateWalletDialog
          wallet={wallet}
          updateWallet={updateWallet}
          deleteWallet={deleteWallet}
        />
      </div>

      <TabsContent value="all">
        {wallet.transactions.length > 0 ? (
          <AllTab wallet={wallet} />
        ) : (
          <div className="mt-2 grid h-96 place-items-center">
            No data on transactions.
          </div>
        )}
      </TabsContent>

      <TabsContent value="income">
        {wallet.transactions.some(
          (transaction) => Number(transaction.amount) > 0,
        ) ? (
          <IncomeTab wallet={wallet} />
        ) : (
          <div className="mt-2 grid h-96 place-items-center">
            No data on incomes.
          </div>
        )}
      </TabsContent>

      <TabsContent value="expense">
        {wallet.transactions.some(
          (transaction) => Number(transaction.amount) < 0,
        ) ? (
          <ExpenseTab wallet={wallet} />
        ) : (
          <div className="mt-2 grid h-96 place-items-center">
            No data on expenses.
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
