import { ColumnDef } from "@tanstack/react-table";

import { Transaction } from "./types";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "category_name",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: row.original.currency,
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return date.toLocaleDateString();
    },
  },
];
