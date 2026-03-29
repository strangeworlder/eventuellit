import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface Session {
  id: number;
  episodeId: number;
  sessionNumber: number;
  date: string | null;
  status: "planned" | "next" | "played";
  label: string | null;
  createdAt: string;
}

export class EnrollmentError extends Error {
  constructor() {
    super("not_enrolled");
    this.name = "EnrollmentError";
  }
}

export const useSessions = (episodeId: number | null) => {
  return useQuery<Session[], Error>({
    queryKey: ["sessions", episodeId],
    queryFn: async () => {
      if (!episodeId) return [];
      const response = await fetch(`${apiBaseUrl}/sessions?episodeId=${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (response.status === 403) throw new EnrollmentError();
      if (!response.ok) throw new Error("Failed to fetch sessions");
      return response.json();
    },
    enabled: !!episodeId,
    retry: (failureCount, error) => {
      if (error instanceof EnrollmentError) return false;
      return failureCount < 3;
    },
  });
};

export const useMigrateSessionDates = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (episodeId: number) => {
      const response = await fetch(`${apiBaseUrl}/sessions/migrate/${episodeId}`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to migrate session dates");
      return response.json();
    },
    onSuccess: (_, episodeId) => {
      queryClient.invalidateQueries({ queryKey: ["sessions", episodeId] });
    },
  });
};
