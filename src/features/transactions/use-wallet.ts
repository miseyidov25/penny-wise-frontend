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
  const [error, setError] = useState<string | undefined>();
  const [isPending, setIsPending] = useState(false);

  async function addTransaction(values: AddTransactionPayload) {
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
      setIsPending(true);

      try {
        const [walletResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get<Wallet>(`/api/wallets/${walletId}`, { signal }),
          axiosInstance.get<Category[]>("/api/categories", { signal }),
        ]);

        setWallet(walletResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        setError("Failed to fetch transactions");
      } finally {
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

  return { wallet, categories, error, isPending, addTransaction };
}
