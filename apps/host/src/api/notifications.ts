import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl, getAuthHeaders } from "./base-url";

export interface PlayerNotification {
  id: number;
  userId: number;
  type: string;
  referenceId: string | null;
  message: string | null;
  dismissedAt: string | null;
  createdAt: string;
}

export interface NotificationsResponse {
  notifications: PlayerNotification[];
  count: number;
}

export const useNotifications = (enabled = true) => {
  return useQuery<NotificationsResponse>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/notifications`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch notifications");
      return response.json();
    },
    enabled,
    staleTime: 15_000,
  });
};

export const useNotificationCount = (enabled = true) => {
  const { data, ...rest } = useNotifications(enabled);
  return { count: data?.count ?? 0, ...rest };
};

export const useDismissNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${apiBaseUrl}/notifications/${id}/dismiss`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to dismiss notification");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
