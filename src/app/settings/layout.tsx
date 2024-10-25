"use client";

import { GearIcon } from "@radix-ui/react-icons";
import {
  LockOpen1Icon,
  MixerHorizontalIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { useAuth } from "@/hooks/auth";
import { cn } from "@/lib/utils";

export default function ProfileSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth({ middleware: "auth" });

  const pathname = usePathname();

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header isAuthorized>
        <Link
          href="/settings/profile"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <GearIcon />
        </Link>
      </Header>

      <div className="container max-w-screen-md py-8">
        <div className="mb-4 border-b pb-4">
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-[9rem,_1fr]">
          <aside className="flex gap-2 sm:flex-col">
            <Link
              href="/settings/profile"
              className={cn(
                buttonVariants({
                  variant: pathname.includes("/settings/profile")
                    ? "secondary"
                    : "ghost",
                }),
                "justify-start",
              )}
            >
              <PersonIcon />
              <span className="ml-2">Profile</span>
            </Link>

            <Link
              href="/settings/advanced"
              className={cn(
                buttonVariants({
                  variant: pathname.includes("/settings/advanced")
                    ? "secondary"
                    : "ghost",
                }),
                "justify-start",
              )}
            >
              <MixerHorizontalIcon />
              <span className="ml-2">Advanced</span>
            </Link>

            {user?.role === "admin" && (
              <Link
                href="/settings/admin"
                className={cn(
                  buttonVariants({
                    variant: pathname.includes("/settings/admin")
                      ? "secondary"
                      : "ghost",
                  }),
                  "justify-start",
                )}
              >
                <LockOpen1Icon />
                <span className="ml-2">Admin</span>
              </Link>
            )}
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
