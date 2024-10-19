import type { Category, Wallet } from "./types";

export function Wallet({
  wallet,
  categories,
}: {
  wallet: Wallet;
  categories: Category[];
}) {
  const transactions = wallet.transactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div>
      <section>
        <ul className={"space-y-2"}>
          {transactions.map((transaction) => (
            <li
              key={transaction.id}
              className="grid grid-cols-[1fr,_auto] rounded-md border bg-card px-4 py-2 text-card-foreground"
            >
              <div>
                {
                  categories.find(
                    (category) => category.id === transaction.category_id,
                  )?.name
                }

                <h3 className="pt-2 text-sm">{transaction.description}</h3>
              </div>

              <div className="flex w-full flex-col items-end justify-between gap-2 font-medium">
                <div className="rounded-sm bg-primary px-2 py-1 text-sm text-primary-foreground">
                  {transaction.amount} {wallet.currency}
                </div>

                <p className="text-sm text-muted-foreground">
                  {transaction.date}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
