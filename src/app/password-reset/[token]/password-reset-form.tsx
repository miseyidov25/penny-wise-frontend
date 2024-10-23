"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
import { useAuth } from "@/hooks/auth";

const formSchema = z
  .object({
    password: z.string().min(8),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords don't match",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof formSchema>;

export function PasswordResetForm() {
  const { resetPassword } = useAuth({ middleware: "guest" });

  const searchParams = useSearchParams();
  const router = useRouter();
  const { token } = useParams<{ token: string }>();

  const email = searchParams.get("email");

  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function handleSubmit({ password, password_confirmation }: FormValues) {
    startTransition(async () => {
      const result = await resetPassword({
        token,
        email: email!,
        password,
        password_confirmation,
      });

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success("Your password has been reset.");
        router.push("/login");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Reset your password</CardTitle>

            <CardDescription>
              Enter your new password, and please try to remember it this time.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>

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
            <Button className="w-full" disabled={isPending}>
              {isPending && <ReloadIcon className="mr-2 animate-spin" />}
              Reset password
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
