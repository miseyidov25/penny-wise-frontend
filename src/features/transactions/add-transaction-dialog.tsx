"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { PlusIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";

import { addTransactionSchema } from "./schemas";
import type { AddTransactionPayload } from "./types";

export function AddTransactionDialog({
  addTransaction,
  categories,
}: {
  addTransaction: (
    payload: AddTransactionPayload,
  ) => Promise<{ error: string } | undefined>;

  categories: string[];
}) {
  const form = useForm<AddTransactionPayload>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      category_name: "",
      amount: "0.00",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  const [isPending, startTransaction] = useTransition();

  function onSubmit(values: AddTransactionPayload) {
    startTransaction(async () => {
      const result = await addTransaction(values);

      if (result?.error) {
        toast.error(result.error);
      } else {
        form.reset();
      }
    });
  }

  return (
    <Dialog>
      <DialogTrigger className={buttonVariants()}>
        <PlusIcon />
        <span className="ml-2">Add transaction</span>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add transaction</DialogTitle>

          <DialogDescription>
            Add a new transaction to this wallet.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="29.99"
                        type="number"
                        step=".01"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Amount of money spent or earned. Use a negative value for
                      expenses.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_name"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Category</FormLabel>

                    <AutocompleteInput
                      setValue={(value) =>
                        form.setValue("category_name", value)
                      }
                      value={field.value}
                      options={categories}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>

                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>

                    <FormControl>
                      <Textarea
                        placeholder="Paid for a gym membership for April"
                        {...field}
                      />
                    </FormControl>

                    <FormDescription>
                      Optional description of the transaction.
                    </FormDescription>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="mt-8" disabled={isPending}>
              {isPending && <ReloadIcon className="mr-2 animate-spin" />}
              <span>Add transaction</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
