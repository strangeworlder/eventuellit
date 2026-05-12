import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl, getAuthHeaders } from "./base-url";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UrgencyLevel = "kriittinen" | "normaali" | "joustava";

export interface VotingRound {
  id: number;
  title: string;
  status: "open" | "closed";
  deadline: string | null;
  createdBy: number;
  closedAt: string | null;
  createdAt: string;
}

export interface MissionOption {
  id: number;
  roundId: number;
  title: string;
  description: string | null;
  image: string | null;
  urgency: UrgencyLevel;
  orderIndex: number;
  createdAt: string;
}

export interface MissionVote {
  id: number;
  roundId: number;
  userId: number;
  primaryOptionId: number;
  secondaryOptionId: number | null;
  votedAt: string;
}

export interface ActiveRoundResponse {
  round: VotingRound | null;
  options: MissionOption[];
  myVote: MissionVote | null;
}

export interface VotingResult {
  optionId: number;
  title: string;
}

export interface FullVotingResult extends VotingResult {
  score: number;
  primaryCount: number;
  secondaryCount: number;
}

export interface MissionComment {
  id: number;
  content: string;
  anonymous: boolean;
  createdAt: string;
  author: string | null; // null when anonymous
}

// ─── Query Hooks ──────────────────────────────────────────────────────────────

export const useActiveVotingRound = (enabled = true) => {
  return useQuery<ActiveRoundResponse>({
    queryKey: ["voting", "active"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/voting/active`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch active voting round");
      return response.json();
    },
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
};

export const useVotingResults = (roundId: number | null) => {
  return useQuery<VotingResult[]>({
    queryKey: ["voting", "results", roundId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}/results`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch voting results");
      return response.json();
    },
    enabled: !!roundId,
    staleTime: 15_000,
    refetchOnWindowFocus: true,
  });
};

export const useVotingResultsFull = (roundId: number | null) => {
  return useQuery<FullVotingResult[]>({
    queryKey: ["voting", "results-full", roundId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}/results/full`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch full voting results");
      return response.json();
    },
    enabled: !!roundId,
    staleTime: 15_000,
  });
};

export const useMissionComments = (roundId: number | null, optionId: number | null) => {
  return useQuery<MissionComment[]>({
    queryKey: ["voting", "comments", roundId, optionId],
    queryFn: async () => {
      const response = await fetch(
        `${apiBaseUrl}/voting/${roundId}/options/${optionId}/comments`,
        { headers: getAuthHeaders(), credentials: "include" },
      );
      if (!response.ok) throw new Error("Failed to fetch comments");
      return response.json();
    },
    enabled: !!roundId && !!optionId,
    staleTime: 30_000,
  });
};

// ─── Mutation Hooks ───────────────────────────────────────────────────────────

export const useCastVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      roundId: number;
      primaryOptionId: number;
      secondaryOptionId?: number;
    }) => {
      const response = await fetch(`${apiBaseUrl}/voting/${data.roundId}/vote`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          primaryOptionId: data.primaryOptionId,
          secondaryOptionId: data.secondaryOptionId,
        }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).message || "Failed to cast vote");
      }
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["voting", "active"] });
      queryClient.invalidateQueries({
        queryKey: ["voting", "results", variables.roundId],
      });
    },
  });
};

export const useDeleteVote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roundId: number) => {
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}/vote`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).message || "Failed to remove vote");
      }
      return response.json();
    },
    onSuccess: (_data, roundId) => {
      queryClient.invalidateQueries({ queryKey: ["voting", "active"] });
      queryClient.invalidateQueries({ queryKey: ["voting", "results", roundId] });
    },
  });
};

export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      roundId: number;
      optionId: number;
      content: string;
      anonymous: boolean;
    }) => {
      const response = await fetch(
        `${apiBaseUrl}/voting/${data.roundId}/options/${data.optionId}/comments`,
        {
          method: "POST",
          headers: getAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({ content: data.content, anonymous: data.anonymous }),
        },
      );
      if (!response.ok) throw new Error("Failed to add comment");
      return response.json();
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["voting", "comments", variables.roundId, variables.optionId],
      });
    },
  });
};

// ─── GM Mutations ─────────────────────────────────────────────────────────────

export const useCreateVotingRound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; deadline?: string }) => {
      const response = await fetch(`${apiBaseUrl}/voting`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as any).message || "Failed to create voting round");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting"] });
    },
  });
};

export const useUpdateVotingRound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      roundId: number;
      title?: string;
      status?: "open" | "closed";
      deadline?: string | null;
    }) => {
      const { roundId, ...body } = data;
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to update voting round");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting"] });
    },
  });
};

export const useDeleteVotingRound = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (roundId: number) => {
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to delete voting round");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting"] });
    },
  });
};

export const useAddMissionOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      roundId: number;
      title: string;
      description?: string;
      image?: string;
      urgency?: UrgencyLevel;
      orderIndex?: number;
    }) => {
      const { roundId, ...body } = data;
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}/options`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to add mission option");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting", "active"] });
    },
  });
};

export const useUpdateMissionOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      roundId: number;
      optionId: number;
      title?: string;
      description?: string;
      image?: string | null;
      urgency?: UrgencyLevel;
      orderIndex?: number;
    }) => {
      const { roundId, optionId, ...body } = data;
      const response = await fetch(`${apiBaseUrl}/voting/${roundId}/options/${optionId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Failed to update mission option");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting", "active"] });
    },
  });
};

export const useDeleteMissionOption = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { roundId: number; optionId: number }) => {
      const response = await fetch(
        `${apiBaseUrl}/voting/${data.roundId}/options/${data.optionId}`,
        {
          method: "DELETE",
          headers: getAuthHeaders(),
          credentials: "include",
        },
      );
      if (!response.ok) throw new Error("Failed to delete mission option");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["voting", "active"] });
    },
  });
};
