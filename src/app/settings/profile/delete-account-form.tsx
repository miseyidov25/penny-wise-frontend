import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function DeleteAccountForm({
  deleteAccount,
}: {
  deleteAccount: () => Promise<
    { success: true } | { success: false; error: string }
  >;
}) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAccount();

      if (!result.success) {
        toast.error(result.error);
      }
    });
  }
  return (
    <Card className="border-destructive bg-destructive/20">
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription className="text-foreground">
          Once you delete your account, there is no going back. Please be
          certain.
        </CardDescription>
      </CardHeader>

      <CardFooter>
        <Button
          disabled={isPending}
          onClick={handleDelete}
          className="w-full"
          variant="destructive"
        >
          {isPending && <ReloadIcon className="mr-2 animate-spin" />}
          <span>Delete account</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
