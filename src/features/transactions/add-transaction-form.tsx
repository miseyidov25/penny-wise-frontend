"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { Button } from "@/components/ui/button";
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

import { addTransactionSchema, type AddTransactionValues } from "./schemas";

export function AddTransactionForm({
  onSubmit,
  categories,
}: {
  onSubmit: (values: AddTransactionValues) => void;
  categories: string[];
}) {
  const form = useForm<AddTransactionValues>({
    resolver: zodResolver(addTransactionSchema),
    defaultValues: {
      category_name: "",
      amount: "0",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  return (
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

          <FormField
            control={form.control}
            name="category_name"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Category</FormLabel>

                <AutocompleteInput
                  setValue={(value) => form.setValue("category_name", value)}
                  value={field.value}
                  options={categories}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="mt-8">
          Submit
        </Button>
      </form>
    </Form>
  );
}
