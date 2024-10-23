import { useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { chartConfig } from "../constants";
import type { Wallet } from "../types";

export function AllTab({ wallet }: { wallet: Wallet }) {
  const chartData = useMemo(() => {
    const result = wallet.transactions.reduce(
      (acc, transaction) => {
        const amount = parseFloat(transaction.amount);

        if (amount > 0) {
          acc.income += amount;
        } else {
          acc.outcome += -amount;
        }

        return acc;
      },
      { income: 0, outcome: 0 },
    );

    return [
      {
        category: "Income",
        amount: result.income,
        fill: "#10B981",
      },
      {
        category: "Outcome",
        amount: result.outcome,
        fill: "#EF4444",
      },
    ];
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
                      }).format(Number(wallet.balance))}
                    </tspan>

                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Balance
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
