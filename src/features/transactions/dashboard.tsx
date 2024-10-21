"use client";

import { useEffect, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";

import { AddTransactionForm } from "./add-transaction-form";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useWallet } from "./use-wallet";

const chartConfig = {
  category: {
    label: "Categories",
  },
  first: {
    color: "hsl(var(--chart-1))",
  },
  second: {
    color: "hsl(var(--chart-2))",
  },
  third: {
    color: "hsl(var(--chart-3))",
  },
  fourth: {
    color: "hsl(var(--chart-4))",
  },
  other: {
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export function Dashboard({
  walletId,
  className,
}: {
  walletId: number;
  className?: string;
}) {
  const { wallet, categories, error, addTransaction, isPending } =
    useWallet(walletId);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const chartData = useMemo(() => {
    const x = wallet?.transactions.reduce(
      (acc, transaction) => {
        const category = categories.find(
          (category) => category.id === transaction.category_id,
        );

        if (!category) {
          return acc;
        }

        const existingCategory = acc.find(
          (item) => item.category === category.name,
        );

        if (existingCategory) {
          existingCategory.amount += Number(transaction.amount);
        } else {
          acc.push({
            category: category.name,
            amount: Number(transaction.amount),
          });
        }

        return acc;
      },
      [] as { category: string; amount: number; fill?: string }[],
    );

    x?.sort((a, b) => b.amount - a.amount);

    if (x === undefined) {
      return [];
    }

    if (x.length >= 1) {
      x[0].fill = "var(--color-first)";
    }

    if (x.length >= 2) {
      x[1].fill = "var(--color-second)";
    }

    if (x.length >= 3) {
      x[2].fill = "var(--color-third)";
    }

    if (x.length >= 4) {
      x[3].fill = "var(--color-fourth)";
    }

    if (x.length >= 5) {
      x[4] = {
        fill: "var(--color-other)",
        category: "Other",
        amount: x.slice(4).reduce((acc, item) => acc + item.amount, 0),
      };
    }

    return x.slice(0, 5);
  }, [categories, wallet?.transactions]);

  const totalAmount = useMemo(() => {
    return wallet?.transactions.reduce(
      (acc, transaction) => acc + Number(transaction.amount),
      0,
    );
  }, [wallet?.transactions]);

  return (
    <section className={className}>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-96"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />

          <Pie
            data={chartData}
            dataKey="amount"
            nameKey="category"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-lg font-bold"
                      >
                        {totalAmount?.toLocaleString()} {wallet?.currency}
                      </tspan>

                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Total
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="mt-8">
        <AddTransactionForm
          onSubmit={(values) => addTransaction(values)}
          categories={categories.map((category) => category.name)}
          isPending={isPending}
          className={cn(buttonVariants({ variant: "outline" }))}
        />

        <DataTable columns={columns} data={wallet?.transactions || []} />
      </div>
    </section>
  );
}
