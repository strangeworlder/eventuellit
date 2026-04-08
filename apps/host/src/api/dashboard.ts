import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl, getAuthHeaders } from "./base-url";

export interface DashboardAction {
  type:
    | "create_character"
    | "link_character"
    | "update_character"
    | "update_names"
    | "reading"
    | "task"
    | "write_recap";
  label: string;
  description: string;
  priority: number;
  url: string;
  meta?: Record<string, unknown>;
}

export interface DashboardEpisode {
  episodeId: number;
  episodeTitle: string;
  episodeSlug: string;
  episodeStatus: string;
  actions: DashboardAction[];
}

export interface PendingInvite {
  id: number;
  episodeId: number;
  episodeTitle: string | null;
  episodeStatus: string | null;
  message: string | null;
  invitedByUsername: string | null;
  createdAt: string;
}

export interface DashboardResponse {
  pendingInvites: PendingInvite[];
  episodes: DashboardEpisode[];
  notificationCount: number;
}

export interface GmOverviewPlayer {
  userId: number;
  username: string | null;
  hasCharacterLinked: boolean;
  characterName: string | null;
  readingProgress: { completed: number; total: number };
  pendingRecaps: number;
  inviteStatus: "enrolled" | "pending" | "declined" | null;
}

export interface GmOverviewResponse {
  players: GmOverviewPlayer[];
}

export interface EpisodeInvite {
  id: number;
  episodeId: number;
  userId: number;
  username: string | null;
  status: string;
  message: string | null;
  invitedBy: number;
  createdAt: string;
  respondedAt: string | null;
}

export const useDashboard = (enabled = true) => {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/dashboard`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch dashboard");
      return response.json();
    },
    enabled,
    staleTime: 30_000,
  });
};

export const useGmOverview = (episodeId: number | null) => {
  return useQuery<GmOverviewResponse>({
    queryKey: ["gm-overview", episodeId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/dashboard/gm-overview?episodeId=${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch GM overview");
      return response.json();
    },
    enabled: !!episodeId,
    staleTime: 30_000,
  });
};

export const useEpisodeInvitesByEpisode = (episodeId: number | null) => {
  return useQuery<EpisodeInvite[]>({
    queryKey: ["episode-invites", episodeId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/episode-invites?episodeId=${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch invites");
      return response.json();
    },
    enabled: !!episodeId,
  });
};

export const useSendInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { episodeId: number; userId: number; message?: string }) => {
      const response = await fetch(`${apiBaseUrl}/episode-invites`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to send invite");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episode-invites", variables.episodeId] });
      queryClient.invalidateQueries({ queryKey: ["gm-overview", variables.episodeId] });
    },
  });
};

export const useRespondToInvite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { id: number; status: "accepted" | "declined" }) => {
      const response = await fetch(`${apiBaseUrl}/episode-invites/${data.id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ status: data.status }),
      });
      if (!response.ok) throw new Error("Failed to respond to invite");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};
