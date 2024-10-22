import { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";

import { axiosInstance } from "@/lib/axios";

import type {
  AddTransactionPayload,
  Category,
  Transaction,
  Wallet,
} from "./types";

export function useWallet(walletId: number) {
  const [wallet, setWallet] = useState<Wallet | undefined>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function deleteTransaction(id: number) {
    setError(null);

    try {
      setWallet((prevWallet) => {
        if (!prevWallet) {
          return prevWallet;
        }

        return {
          ...prevWallet,
          transactions: prevWallet.transactions.filter(
            (transaction) => transaction.id !== id,
          ),
        };
      });

      await axiosInstance.delete<Wallet>(`/api/transactions/${id}`);

      // TODO: Update wallet with response data
    } catch {
      setError("Failed to delete transaction");
    }
  }

  async function addTransaction(values: AddTransactionPayload) {
    setError(null);

    setIsPending(true);

    try {
      await axiosInstance.post<Transaction>(`/api/transactions`, {
        ...values,
        wallet_id: walletId,
      });

      await fetchTransactions();
    } catch {
      setError("Failed to add transaction");
    } finally {
      setIsPending(false);
    }
  }

  const fetchTransactions = useCallback(
    async (signal?: AbortSignal) => {
      setError(null);

      setIsPending(true);

      try {
        const [walletResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get<Wallet>(`/api/wallets/${walletId}`, { signal }),
          axiosInstance.get<Category[]>("/api/categories", { signal }),
        ]);

        setWallet(walletResponse.data);
        setCategories(categoriesResponse.data);
        setIsPending(false);
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        setError("Failed to fetch transactions");
        setIsPending(false);
      }
    },
    [walletId],
  );

  useEffect(() => {
    const controller = new AbortController();

    fetchTransactions(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchTransactions]);

  return {
    wallet,
    categories,
    error,
    isPending,
    addTransaction,
    deleteTransaction,
  };
}
