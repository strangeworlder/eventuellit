import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl, getAuthHeaders } from "./base-url";

export interface Episode {
  id: number;
  slug: string;
  title: string;
  order: number;
  status: string;
  description: string | null;
}

export const useEpisodes = (status?: string) => {
  return useQuery<Episode[]>({
    queryKey: ["episodes", status],
    queryFn: async () => {
      const url = status ? `${apiBaseUrl}/episodes?status=${status}` : `${apiBaseUrl}/episodes`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch episodes");
      return response.json();
    },
  });
};
