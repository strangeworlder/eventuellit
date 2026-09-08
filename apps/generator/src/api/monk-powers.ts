import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

export interface MonkPower {
  id: number;
  name: string;
  tier: number;
  description: string | null;
  properties: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
  acquiredAt?: string;
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
