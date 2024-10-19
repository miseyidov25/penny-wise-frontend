import { Dashboard } from "@/features/transactions/dashboard";

export default function Page({ params }: { params: { id: string } }) {
  return <Dashboard walletId={+params.id} />;
}
