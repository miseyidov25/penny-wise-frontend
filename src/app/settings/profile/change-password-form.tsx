"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = z
  .object({
    password: z.string().min(8),
    password_confirmation: z.string(),
    current_password: z.string().min(1),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

export function ChangePasswordForm({
  update,
}: {
  update: (
    values: FormValues,
  ) => Promise<{ success: true } | { success: false; error: string }>;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      current_password: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function onSubmit(values: FormValues) {
    startTransition(async () => {
      const result = await update(values);

      if (!result.success) {
        toast.error(result.error || "Incorrect password");
      } else {
        toast.success("Password updated successfully");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>

            <CardDescription>
              Enter your current password and a new password to change your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current password</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="••••••••••••"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="••••••••••••"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password confirmation</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="••••••••••••"
                      type="password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button className="w-full" disabled={isPending} variant="secondary">
              {isPending && <ReloadIcon className="mr-2 animate-spin" />}
              Change password
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
