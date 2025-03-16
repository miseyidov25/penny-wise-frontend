"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User } from "@/hooks/auth";
import { axiosInstance } from "@/lib/axios";

export default function AdminSettings() {
  const [isPending, startTransition] = useTransition();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setDialogOpen] = useState(false);

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
      toast.success("User deleted successfully.");
    } catch {
      setUsers(users);

      toast.error("Failed to delete user.");
    } finally {
      setDialogOpen(false);
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
                onClick={() => {
                  setSelectedUser(user);
                  setDialogOpen(true);
                }}
                variant="destructive"
                size="sm"
              >
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <b>{selectedUser?.name}</b>?</p>
          <DialogFooter>
            <Button onClick={() => setDialogOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button
              onClick={() => selectedUser && deleteUser(selectedUser.id)}
              variant="destructive"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
