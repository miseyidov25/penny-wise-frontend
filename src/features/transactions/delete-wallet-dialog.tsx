"use client";

import { ReloadIcon, TrashIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function DeleteWalletDialog({
  wallet,
  deleteWallet,
}: {
  wallet: { name: string; currency: string };
  deleteWallet(): Promise<{ error: string } | undefined>;
}) {
  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  function onSubmit() {
    startTransition(async () => {
      const response = await deleteWallet();

      if (response?.error) {
        toast.error(response.error);
        return;
      }

      router.push("/dashboard");
    });
  }

  return (
    <Dialog>
      <DialogTrigger
        className={buttonVariants({ size: "icon", variant: "outline" })}
      >
        <TrashIcon />
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete {wallet.name}?</DialogTitle>

          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="destructive" disabled={isPending} onClick={onSubmit}>
            {isPending && <ReloadIcon className="mr-2 animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
