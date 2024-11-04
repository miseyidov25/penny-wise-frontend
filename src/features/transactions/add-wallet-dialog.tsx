"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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

import { currencies } from "./constants";
import { addWalletSchema } from "./schemas";
import type { AddWalletPayload, Wallet } from "./types";

export function AddWalletDialog({
  addWallet,
}: {
  addWallet: (
    payload: AddWalletPayload,
  ) => Promise<
    { data: Wallet; error: null } | { error: string; data?: undefined }
  >;
}) {
  const form = useForm<AddWalletPayload>({
    resolver: zodResolver(addWalletSchema),
    defaultValues: {
      name: "",
      currency: "EUR",
      balance: "0.00",
    },
  });

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function onSubmit(payload: AddWalletPayload) {
    startTransition(async () => {
      const result = await addWallet(payload);

      if (result.error !== null) {
        toast.error(result.error);
        return;
      }

      form.reset();
      router.push(`/dashboard/${result.data.id}`);
    });
  }

  return (
    <Dialog>
      <DialogTrigger className="grid h-64 w-96 place-content-center rounded-xl border border-input bg-background text-foreground/60 shadow hover:bg-accent hover:text-accent-foreground">
        <PlusIcon className="size-24" />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new wallet</DialogTitle>

          <DialogDescription>
            You can create a new wallet by entering the name, the currency and
            the initial balance.
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
                name="balance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Balance</FormLabel>

                    <FormControl>
                      <Input placeholder="0.00" {...field} />
                    </FormControl>

                    <FormDescription>
                      The initial balance for the wallet.
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

            <Button type="submit" className="mt-8" disabled={isPending}>
              {isPending && <ReloadIcon className="mr-2 animate-spin" />}
              Create wallet
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
