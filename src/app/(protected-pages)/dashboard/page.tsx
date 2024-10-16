"use client";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";

export default function Dashboard() {
  const { logout } = useAuth({ middleware: "auth" });

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
        <Button onClick={() => logout()} variant="secondary">
          Log out
        </Button>
      </Header>

      <main className="container py-8"></main>
    </div>
  );
}
