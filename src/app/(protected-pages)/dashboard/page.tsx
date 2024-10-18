"use client";

import { AddTransactionForm } from "@/features/transactions/add-transaction-form";
import { type AddTransactionValues } from "@/features/transactions/schemas";
import { axiosInstance } from "@/lib/axios";

const categories = ["Food", "Transport", "Entertainment", "Health", "Shopping"];

export default function Dashboard() {
  async function onSubmit(values: AddTransactionValues) {
    const response = await axiosInstance.post("api/transactions", values);
    console.log(response.data);
  }

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <main className="container max-w-screen-sm py-8">
        <AddTransactionForm onSubmit={onSubmit} categories={categories} />
      </main>
    </div>
  );
}
