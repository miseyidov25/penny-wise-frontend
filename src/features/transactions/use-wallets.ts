import { AxiosError } from "axios";
import { useEffect, useState, useTransition } from "react";

import { axiosInstance } from "@/lib/axios";

import type { AddWalletPayload, Wallet } from "./types";

export function useWallets() {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [balance, setBalance] = useState<string | null>();
  const [isPending, startTransaction] = useTransition();

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    setError(null);

    startTransaction(async () => {
      try {
        const response = await axiosInstance.get<{
          wallets: Wallet[];
          total_balance: number;
          currency: string;
        }>("/api/wallets", { signal });

        setWallets(response.data.wallets);
        setBalance(
          new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: response.data.currency,
          }).format(response.data.total_balance),
        );
      } catch (error) {
        if (error instanceof AxiosError && error.name === "CanceledError") {
          return;
        }

        setError("Failed to fetch wallets.");
      }
    });

    return () => controller.abort();
  }, []);

  async function addWallet(payload: AddWalletPayload) {
    try {
      const response = await axiosInstance.post<Wallet>(
        "/api/wallets",
        payload,
      );

      return { data: response.data, error: null };
    } catch {
      return { error: "Failed to add wallet." };
    }
  }

  return {
    addWallet,
    balance,
    error,
    isPending,
    wallets,
  };
}
