import { AxiosError } from "axios";
import { useEffect, useState, useTransition } from "react";

import { axiosInstance } from "@/lib/axios";

import type { AddWalletPayload, UpdateWalletPayload, Wallet } from "./types";

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isPending, startTransaction] = useTransition();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setError(null);

    startTransaction(async () => {
      try {
        const response = await axiosInstance.get<{ wallets: Wallet[] }>(
          "/api/wallets",
          { signal },
        );

        setWallets(response.data.wallets);
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        setError("Failed to fetch wallets.");
      }
    });

    return () => controller.abort();
  }, []);

  async function updateWallet(walletId: number, payload: UpdateWalletPayload) {
    const selectedWallet = wallets.find((wallet) => wallet.id === walletId);

    if (!selectedWallet) {
      return { error: "Wallet not found" };
    }

    const optimisticWallet: Wallet = {
      ...selectedWallet,
      name: payload.name,
      currency: payload.currency,
    };

    setWallets(
      wallets.map((wallet) =>
        wallet.id === walletId ? optimisticWallet : wallet,
      ),
    );

    try {
      const response = await axiosInstance.put<{ wallet: Wallet }>(
        `/api/wallets/${walletId}`,
        payload,
      );

      setWallets(
        wallets.map((wallet) =>
          wallet.id === response.data.wallet.id ? response.data.wallet : wallet,
        ),
      );
    } catch {
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

  async function deleteWallet(walletId: number) {
    setWallets(wallets.filter((wallet) => wallet.id !== walletId));

    try {
      const response = await axiosInstance.delete<{ wallets: Wallet[] }>(
        `/api/wallets/${walletId}`,
      );

      setWallets(response.data.wallets);
    } catch {
      setWallets(wallets);

      return { error: "Failed to delete wallet." };
    }
  }

  return {
    addWallet,
    deleteWallet,
    error,
    isPending,
    updateWallet,
    wallets,
  };
}
