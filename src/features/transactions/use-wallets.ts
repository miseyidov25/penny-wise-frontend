import { AxiosError } from "axios";
import { useEffect, useState, useTransition } from "react";

import { axiosInstance } from "@/lib/axios";

import type {
  AddTransactionPayload,
  AddWalletPayload,
  Category,
  UpdateWalletPayload,
  Wallet,
} from "./types";

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isPending, startTransaction] = useTransition();

  const [error, setError] = useState<string | null>(null);

  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);

  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setError(null);

    startTransaction(async () => {
      try {
        const [walletsResponse, categoriesResponse] = await Promise.all([
          axiosInstance.get<{ wallets: Wallet[] }>("/api/wallets", { signal }),
          axiosInstance.get<Category[]>("/api/categories", {
            signal,
          }),
        ]);

        setWallets(walletsResponse.data.wallets);
        setCategories(categoriesResponse.data.map((category) => category.name));
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        setError("Failed to fetch wallets.");
      }
    });

    return () => controller.abort();
  }, []);

  async function selectWallet(walletId: string) {
    try {
      const response = await axiosInstance.get<Wallet>(
        `/api/wallets/${walletId}`,
      );

      setSelectedWallet(response.data);
    } catch {
      return { error: "Failed to fetch wallet." };
    }
  }

  async function updateWallet(payload: UpdateWalletPayload) {
    if (!selectedWallet) {
      return { error: "No wallet selected." };
    }

    const optimisticWallet = {
      ...selectedWallet,
      name: payload.name,
      currency: payload.currency,
      transactions: selectedWallet.transactions.map((transaction) => ({
        ...transaction,
        currency: payload.currency,
      })),
    };

    setSelectedWallet(optimisticWallet);

    setWallets(
      wallets.map((wallet) =>
        wallet.id === selectedWallet.id ? optimisticWallet : wallet,
      ),
    );

    try {
      const response = await axiosInstance.put<{ wallet: Wallet }>(
        `/api/wallets/${selectedWallet.id}`,
        payload,
      );

      setSelectedWallet(response.data.wallet);

      setWallets(
        wallets.map((wallet) =>
          wallet.id === response.data.wallet.id ? response.data.wallet : wallet,
        ),
      );
    } catch {
      setSelectedWallet(selectedWallet);
      setWallets(wallets);

      return { error: "Failed to update wallet." };
    }
  }

  async function addWallet(payload: AddWalletPayload) {
    try {
      const response = await axiosInstance.post<{ wallets: Wallet[] }>(
        "/api/wallets",
        payload,
      );

      setWallets(response.data.wallets);
    } catch {
      return { error: "Failed to add wallet." };
    }
  }

  async function deleteWallet() {
    if (!selectedWallet) {
      return { error: "No wallet selected." };
    }

    setSelectedWallet(null);

    setWallets(wallets.filter((wallet) => wallet.id !== selectedWallet.id));

    try {
      const response = await axiosInstance.delete<{ wallets: Wallet[] }>(
        `/api/wallets/${selectedWallet.id}`,
      );

      setWallets(response.data.wallets);
    } catch {
      setWallets(wallets);

      return { error: "Failed to delete wallet." };
    }
  }

  async function addTransaction(payload: AddTransactionPayload) {
    if (!selectedWallet) {
      return { error: "No wallet selected." };
    }

    try {
      const response = await axiosInstance.post<{ wallet: Wallet }>(
        `/api/transactions`,
        {
          wallet_id: selectedWallet.id,
          ...payload,
        },
      );

      setSelectedWallet(response.data.wallet);

      setWallets(
        wallets.map((wallet) =>
          wallet.id === response.data.wallet.id ? response.data.wallet : wallet,
        ),
      );
    } catch {
      return { error: "Failed to add transaction." };
    }
  }

  async function deleteTransaction(transactionId: number) {
    if (!selectedWallet) {
      return { error: "No wallet selected." };
    }

    const optimisticWallet: Wallet = {
      ...selectedWallet,
      balance: (
        Number(selectedWallet.balance) -
        Number(
          selectedWallet.transactions.find(
            (transaction) => transaction.id === transactionId,
          )?.amount,
        )
      ).toString(),
      transactions: selectedWallet.transactions.filter(
        (transaction) => transaction.id !== transactionId,
      ),
    };

    setSelectedWallet(optimisticWallet);

    setWallets(
      wallets.map((wallet) =>
        wallet.id === selectedWallet.id ? optimisticWallet : wallet,
      ),
    );

    try {
      const response = await axiosInstance.delete<{ wallet: Wallet }>(
        `/api/transactions/${transactionId}`,
      );
      setWallets((wallets) =>
        wallets.map((wallet) => {
          if (wallet.id === response.data.wallet.id) {
            return response.data.wallet;
          }

          return wallet;
        }),
      );

      setSelectedWallet(response.data.wallet);
    } catch {
      setWallets(wallets);
      setSelectedWallet(selectedWallet);

      return { error: "Failed to delete transaction." };
    }
  }

  return {
    addTransaction,
    addWallet,
    categories,
    deleteTransaction,
    deleteWallet,
    error,
    isPending,
    selectedWallet,
    selectWallet,
    updateWallet,
    wallets,
  };
}
