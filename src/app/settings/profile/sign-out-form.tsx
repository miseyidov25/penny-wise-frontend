"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SignOutForm({
  logout,
}: {
  logout: () => Promise<{ error?: string }>;
}) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout();

      if (result.error) {
        alert(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logout</CardTitle>
        <CardDescription>
          You will need to log in again to access your account.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button
          disabled={isPending}
          onClick={handleLogout}
          className="w-full"
          variant="secondary"
        >
          {isPending && <ReloadIcon className="mr-2 animate-spin" />}
          <span>Log out</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
