import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";

import { axiosInstance } from "@/lib/axios";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  currency: string;
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
      if (!(error instanceof AxiosError)) {
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
      if (!(error instanceof AxiosError)) {
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }

      return { success: false, error: error.response?.data.message };
    }
  }

  async function update(data: {
    email?: string;
    name?: string;
    password?: string;
    current_password?: string;
    currency?: string;
  }): Promise<{ success: true } | { success: false; error: string }> {
    try {
      await csrf();

      const response = await axiosInstance.put<{ user: User }>(
        "/api/user",
        data,
      );

      mutate(response.data.user);

      return { success: true };
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }

      return {
        success: false,
        error:
          error.response?.data.message ||
          error.response?.data.email[0] ||
          error.response?.data.name[0],
      };
    }
  }

  async function logout() {
    try {
      await axiosInstance.post("/logout");

      mutate(undefined);

      router.push("/");

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  }

  async function deleteAccount(): Promise<
    { success: true } | { success: false; error: string }
  > {
    try {
      await axiosInstance.delete("/api/user");

      mutate(undefined);

      router.push("/");

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  }

  async function forgotPassword(email: string) {
    try {
      await csrf();

      await axiosInstance.post("/forgot-password", { email });

      router.push("/login");

      return { success: true };
    } catch {
      return {
        success: false,
        error: "Something went wrong. Please try again.",
      };
    }
  }

  async function resetPassword(values: {
    token: string;
    password: string;
    password_confirmation: string;
    email: string;
  }) {
    try {
      await axiosInstance.post("/reset-password", values);
      return { success: true };
    } catch (error) {
      if (!(error instanceof AxiosError)) {
        return {
          success: false,
          error: "Something went wrong. Please try again.",
        };
      }

      return { success: false, error: error.response?.data.message };
    }
  }

  useEffect(() => {
    if (middleware === "auth" && error) {
      router.push("/");

      return;
    }

    if (middleware === "guest" && user) router.push("/dashboard");
  }, [user, error, middleware, router]);

  return {
    user,
    register,
    login,
    logout,
    update,
    deleteAccount,
    forgotPassword,
    resetPassword,
  };
};
