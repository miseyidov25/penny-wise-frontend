"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil1Icon, ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { axiosInstance } from "@/lib/axios";

import { currencies } from "./constants";
import { updateWalletSchema } from "./schemas";
import type { UpdateWalletPayload, Wallet } from "./types";

export function UpdateWalletDialog({
  setWallets,
  wallets,
  walletId,
}: {
  setWallets: (wallets: Wallet[]) => void;
  wallets: Wallet[];
  walletId: number;
}) {
  const [defaultValues, setDefaultValues] = useState<UpdateWalletPayload>({
    name: "",
    currency: "",
  });

  useEffect(() => {
    const wallet = wallets.find((wallet) => wallet.id === walletId);

    setDefaultValues(wallet || { name: "", currency: "" });
  }, [walletId, wallets]);

  const form = useForm<UpdateWalletPayload>({
    resolver: zodResolver(updateWalletSchema),
    defaultValues,
  });

  const [isPending, startTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();

  function onSubmit(values: UpdateWalletPayload) {
    startTransition(async () => {
      try {
        const response = await axiosInstance.put<{ wallets: Wallet[] }>(
          `/api/wallets/${walletId}`,
          values,
        );

        setWallets(response.data.wallets);

        toast.success("Wallet updated successfully");
      } catch {
        toast.error("Failed to update wallet");
      }
    });
  }

  function onDelete() {
    startDeleteTransition(async () => {
      try {
        const response = await axiosInstance.delete<{ wallets: Wallet[] }>(
          `/api/wallets/${walletId}`,
        );

        setWallets(response.data.wallets);

        toast.success("Wallet deleted successfully");
      } catch {
        toast.error("Failed to delete wallet");
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "outline", size: "icon" })}
        disabled={!walletId}
      >
        <Pencil1Icon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {defaultValues.name}</DialogTitle>

          <DialogDescription>
            Enter the new details for the wallet.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>

                    <FormControl>
                      <Input placeholder="My Wallet" {...field} />
                    </FormControl>

                    <FormDescription>
                      The name to identify the wallet.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>

                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a currency" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {currencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormDescription>
                      The currency for the wallet.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-8 flex gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending && <ReloadIcon className="mr-2 animate-spin" />}
                Update
              </Button>

              <Button
                type="button"
                disabled={isDeletePending}
                variant="destructive"
                onClick={onDelete}
                size="icon"
              >
                {isDeletePending ? (
                  <ReloadIcon className="animate-spin" />
                ) : (
                  <TrashIcon />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
