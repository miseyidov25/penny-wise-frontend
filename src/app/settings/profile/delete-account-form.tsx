"use client";

import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
        <Dialog>
          <DialogTrigger
            disabled={isPending}
            className={cn(buttonVariants({ variant: "destructive" }), "w-full")}
          >
            {isPending && <ReloadIcon className="mr-2 animate-spin" />}
            <span>Delete account</span>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>

              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <DialogClose asChild>
                <Button onClick={handleDelete} variant="destructive">
                  Delete account
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
