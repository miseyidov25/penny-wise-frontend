import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import useSWR from "swr";

import { axiosInstance } from "@/lib/axios";

interface User {
  id: number;
  name: string;
  email: string;
}

export async function fetchUser() {
  const response = await axiosInstance.get<User>("/api/user");

  return response.data;
}

export const useAuth = ({
  middleware,
}: { middleware?: "auth" | "guest" } = {}) => {
  const router = useRouter();

  const { data: user, error, mutate } = useSWR("/api/user", fetchUser);

  function csrf() {
    return axiosInstance.get("/sanctum/csrf-cookie");
  }

  async function register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      await csrf();

      const response = await axiosInstance.post<{ user: User }>(
        "/register",
        data,
      );

      mutate(response.data.user);

      router.push("/dashboard");

      return { success: true };
    } catch (error) {
      if (!(error instanceof AxiosError) || error.status !== 422) {
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }

      return { success: false, error: error.response?.data.message };
    }
  }

  async function login(data: {
    email: string;
    password: string;
  }): Promise<{ success: true } | { success: false; error: string }> {
    try {
      await csrf();

      const response = await axiosInstance.post<{ user: User }>("/login", data);

      mutate(response.data.user);

      router.push("/dashboard");

      return { success: true };
    } catch (error) {
      if (!(error instanceof AxiosError) || error.status !== 422) {
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }

      return { success: false, error: error.response?.data.message };
    }
  }

  const logout = useCallback(async () => {
    if (!error) {
      await axiosInstance.post("/logout");

      mutate(undefined);
    }

    router.push("/");
  }, [error, mutate, router]);

  useEffect(() => {
    if (middleware === "auth" && error) logout();

    if (middleware === "guest" && user) router.push("/dashboard");
  }, [user, error, middleware, logout, router]);

  return {
    user,
    register,
    login,
    logout,
  };
};
