"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  DotsHorizontalIcon,
  ReloadIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import { useTransition } from "react";
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

import { currencies } from "./constants";
import { updateWalletSchema } from "./schemas";
import type { UpdateWalletPayload } from "./types";

export function UpdateWalletDialog({
  wallet,
  updateWallet,
  deleteWallet,
}: {
  wallet: { name: string; currency: string };
  updateWallet(
    payload: UpdateWalletPayload,
  ): Promise<{ error: string } | undefined>;
  deleteWallet(): Promise<{ error: string } | undefined>;
}) {
  const form = useForm<UpdateWalletPayload>({
    resolver: zodResolver(updateWalletSchema),
    defaultValues: wallet,
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(payload: UpdateWalletPayload) {
    startTransition(async () => {
      const response = await updateWallet(payload);

      if (response?.error) {
        toast.error(response.error);
      }
    });
  }

  function onDelete() {
    startTransition(async () => {
      const response = await deleteWallet();

      if (response?.error) {
        toast.error(response.error);
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ variant: "ghost", size: "icon" })}
      >
        <DotsHorizontalIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update {wallet.name}</DialogTitle>

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

            <div className="mt-8 grid grid-cols-[1fr,_auto] gap-4">
              <Button type="submit" disabled={isPending}>
                {isPending && <ReloadIcon className="mr-2 animate-spin" />}
                Update
              </Button>

              <Button
                type="button"
                disabled={isPending}
                variant="ghost"
                onClick={onDelete}
                size="icon"
              >
                {isPending ? (
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
