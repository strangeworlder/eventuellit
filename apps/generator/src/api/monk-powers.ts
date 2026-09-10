import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

export interface MonkPower extends Record<string, unknown> {
  id: number;
  name: string;
  tier: number;
  description: string | null;
  properties: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  acquiredAt?: string;
}

export interface CreateMonkPowerInput {
  name: string;
  tier: number;
  description?: string;
  properties?: Record<string, unknown>;
}

export interface UpdateMonkPowerInput {
  id: number;
  name?: string;
  tier?: number;
  description?: string | null;
  properties?: Record<string, unknown>;
}

export function useMonkPowers(tier?: number) {
  return useQuery<MonkPower[]>({
    queryKey: ["monk-powers", tier],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const url = new URL(`${apiBaseUrl}/monk-powers`);
      if (tier !== undefined) {
        url.searchParams.set("tier", String(tier));
      }
      const res = await fetch(url.toString(), {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch monk powers");
      return res.json();
    },
  });
}

export function useMonkPower(id: number) {
  return useQuery<MonkPower>({
    queryKey: ["monk-powers", id],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/monk-powers/${id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch monk power");
      return res.json();
    },
    enabled: Boolean(id),
  });
}

export function useCreateMonkPower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMonkPowerInput) => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/monk-powers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Munkin voiman luonti epäonnistui");
      }
      return res.json() as Promise<MonkPower>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monk-powers"] });
    },
  });
}

export function useUpdateMonkPower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...dto }: UpdateMonkPowerInput) => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/monk-powers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(dto),
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Munkin voiman päivitys epäonnistui");
      }
      return res.json() as Promise<MonkPower>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monk-powers"] });
    },
  });
}

export function useDeleteMonkPower() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/monk-powers/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => null);
        throw new Error(errorData?.message || "Munkin voiman poisto epäonnistui");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["monk-powers"] });
    },
  });
}
