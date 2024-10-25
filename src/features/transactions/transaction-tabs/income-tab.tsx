import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { chartConfig } from "../constants";
import type { Wallet } from "../types";

export function IncomeTab({ wallet }: { wallet: Wallet }) {
  const chartData = useMemo(() => {
    const result = wallet.transactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount);

        if (amount < 0) {
          return acc;
        }

        const categoryIndex = acc.findIndex(
          ({ category }) => category === transaction.category_name,
        );

        if (categoryIndex !== -1) {
          acc[categoryIndex].amount += amount;
        } else {
          acc.push({
            amount,
            category: transaction.category_name,
          });
        }

        return acc;
      },
      [] as { amount: number; category: string; fill?: string }[],
    );

    result.sort((a, b) => b.amount - a.amount);

    if (result.length > 0) {
      result[0].fill = "var(--color-first)";
    }

    if (result.length > 1) {
      result[1].fill = "var(--color-second)";
    }

    if (result.length > 2) {
      result[2].fill = "var(--color-third)";
    }

    if (result.length > 3) {
      result[3].fill = "var(--color-fourth)";
    }

    if (result.length > 4) {
      result[4].amount = result
        .slice(4)
        .reduce((acc, { amount }) => acc + amount, 0);

      result[4].fill = "var(--color-other)";
    }

    return result.slice(0, 5);
  }, [wallet.transactions]);

  return (
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
                      {new Intl.NumberFormat("de-DE", {
                        style: "currency",
                        currency: wallet.currency,
                      }).format(
                        chartData.reduce((acc, { amount }) => acc + amount, 0),
                      )}
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Income
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
