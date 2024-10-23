"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/auth";

import { ChangePasswordForm } from "./change-password-form";
import { DeleteAccountForm } from "./delete-account-form";
import { SignOutForm } from "./sign-out-form";
import { UpdateProfileForm } from "./update-profile-form";

export default function ProfileSettings() {
  const { user, update, logout, deleteAccount } = useAuth({
    middleware: "auth",
  });

  if (!user) {
    return <Skeleton className="h-[16.375rem] rounded-xl bg-card" />;
  }

  return (
    <div className="space-y-8">
      <UpdateProfileForm user={user} update={update} />

      <ChangePasswordForm update={update} />

      <SignOutForm logout={logout} />

      <DeleteAccountForm deleteAccount={deleteAccount} />
    </div>
  );
}
