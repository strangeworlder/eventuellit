import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface MyEnrollment {
  id: number;
  episodeId: number;
  userId: number;
  username: string | null;
  createdAt: string;
}

/**
 * Returns the current player's own enrollment row for the given episode (or empty array).
 * When the server has zero enrollments configured, it also returns empty -- caller treats
 * empty-with-zero-total as "open access" and shows prep normally.
 */
export const useMyEnrollment = (episodeId: number | null) => {
  return useQuery<MyEnrollment[]>({
    queryKey: ["myEnrollment", episodeId],
    queryFn: async () => {
      if (!episodeId) return [];
      const response = await fetch(`${apiBaseUrl}/episode-players?episodeId=${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (response.status === 403) {
        return [];
      }
      if (!response.ok) throw new Error("Failed to fetch enrollment");
      return response.json();
    },
    enabled: !!episodeId,
  });
};
