"use client";

import { GearIcon } from "@radix-ui/react-icons";
import { MixerHorizontalIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Header } from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProfileSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen grid-rows-[auto,_1fr,_auto]">
      <Header>
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

        <div className="grid gap-4 sm:grid-cols-[auto,_1fr]">
          <aside className="flex gap-2 sm:flex-col">
            <Link
              href="/settings/profile"
              className={cn(
                buttonVariants({
                  variant: pathname.includes("/settings/profile")
                    ? "secondary"
                    : "ghost",
                }),
                "justify-start pr-12",
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
                "justify-start pr-12",
              )}
            >
              <MixerHorizontalIcon />
              <span className="ml-2">Advanced</span>
            </Link>
          </aside>

          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
