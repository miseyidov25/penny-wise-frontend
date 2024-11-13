import { AxiosError } from "axios";
import { useEffect, useState, useTransition } from "react";

import { axiosInstance } from "@/lib/axios";

import type {
  AddTransactionPayload,
  Category,
  UpdateWalletPayload,
  Wallet,
} from "./types";

export function useWallet(walletId: string) {
  const [wallet, setWallet] = useState<Wallet | null>();
  const [isPending, startTransaction] = useTransition();

  const [error, setError] = useState<string | null>();

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setError(null);

    startTransaction(async () => {
      try {
        const [walletsResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get<Wallet>(`/api/wallets/${walletId}`, {
            signal,
          }),
          axiosInstance.get<Category[]>("/api/categories", {
            signal,
          }),
        ]);

        setWallet(walletsResponse.data);
        setCategories(categoriesResponse.data.map((category) => category.name));
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        setError("Failed to fetch wallet.");
      }
    });

    return () => controller.abort();
  }, [walletId]);

  async function addTransaction(payload: AddTransactionPayload) {
    try {
      const response = await axiosInstance.post<{ wallet: Wallet }>(
        `/api/transactions`,
        {
          wallet_id: walletId,
          ...payload,
        },
      );

      setWallet(response.data.wallet);
      setCategories([...categories, payload.category_name]);
    } catch {
      return { error: "Failed to add transaction." };
    }
  }

  async function deleteTransaction(transactionId: number) {
    if (!wallet) {
      return { error: "No wallet selected." };
    }

    const optimisticWallet: Wallet = {
      ...wallet,
      balance: (
        Number(wallet.balance) -
        Number(
          wallet.transactions.find(
            (transaction) => transaction.id === transactionId,
          )?.amount,
        )
      ).toString(),
      transactions: wallet.transactions.filter(
        (transaction) => transaction.id !== transactionId,
      ),
    };

    setWallet(optimisticWallet);

    try {
      const response = await axiosInstance.delete<{ wallet: Wallet }>(
        `/api/transactions/${transactionId}`,
      );

      setWallet(response.data.wallet);
    } catch {
      setWallet(wallet);

      return { error: "Failed to delete transaction." };
    }
  }

  async function updateWallet(payload: UpdateWalletPayload) {
    if (!wallet) {
      return { error: "Wallet not found." };
    }

    try {
      const response = await axiosInstance.put<{ wallet: Wallet }>(
        `/api/wallets/${wallet.id}`,
        payload,
      );

      setWallet(response.data.wallet);
    } catch {
      return { error: "Failed to update wallet." };
    }
  }

  async function deleteWallet() {
    try {
      await axiosInstance.delete<{ wallets: Wallet[] }>(
        `/api/wallets/${wallet?.id}`,
      );
    } catch {
      return { error: "Failed to delete wallet." };
    }
  }

  return {
    addTransaction,
    categories,
    deleteTransaction,
    deleteWallet,
    error,
    isPending,
    updateWallet,
    wallet,
  };
}
