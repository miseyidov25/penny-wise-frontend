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
import { useAuth } from "@/hooks/auth";

const formSchema = z.object({
  email: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth({ middleware: "guest" });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const [isPending, startTransition] = useTransition();

  function handleSubmit(data: FormValues) {
    startTransition(async () => {
      const result = await forgotPassword(data.email);

      if (!result.success) {
        toast.error(result.error);
      } else {
        toast.success(
          "Check your email for instructions to reset your password.",
        );
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Forgot password</CardTitle>

            <CardDescription>
              You will receive an email with instructions on how to reset your
              password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="example@mail.com"
                      type="email"
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
              Forgot password
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
