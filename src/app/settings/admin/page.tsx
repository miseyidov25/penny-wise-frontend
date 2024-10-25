"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/hooks/auth";
import { axiosInstance } from "@/lib/axios";

export default function AdminSettings() {
  const [isPending, startTransition] = useTransition();

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    startTransition(async () => {
      try {
        const response = await axiosInstance.get<User[]>("/api/users");

        setUsers(response.data);
      } catch {
        toast.error("Failed to fetch users.");
      }
    });
  }, []);

  async function deleteUser(id: number) {
    setUsers((prev) => prev.filter((user) => user.id !== id));

    try {
      const response = await axiosInstance.delete<{ users: User[] }>(
        `/api/users/${id}`,
      );

      setUsers(response.data.users);
    } catch {
      setUsers(users);

      toast.error("Failed to delete user.");
    }
  }

  return (
    <div>
      {isPending ? (
        <Skeleton className="h-96 bg-card" />
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id} className="space-y-2">
              <span className="mr-2">
                {user.name} ({user.email})
              </span>

              <Button
                onClick={() => deleteUser(user.id)}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
