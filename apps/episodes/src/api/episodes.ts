import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { API_BASE_URL } from "./base-url";

export interface Episode {
  id: number;
  slug: string;
  title: string;
  order: number;
  status: string;
  description: string | null;
  content: string | null;
  players: string | null;
  sessionDates: string | null;
  location: string | null;
  locationLink: string | null;
  image: string | null;
  imageAlt: string | null;
  mechanicalAdditions: string | null;
  summary: string | null;
  gmId: number;
  createdAt: string;
  updatedAt: string;
}

export interface EpisodeSkill {
  id: number;
  episodeId: number;
  name: string;
  createdAt: string;
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("auth_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ========================
// EPISODES
// ========================

export const useEpisodes = (status?: string) => {
  return useQuery<Episode[]>({
    queryKey: ["episodes", status],
    queryFn: async () => {
      const url = status ? `${API_BASE_URL}/episodes?status=${status}` : `${API_BASE_URL}/episodes`;
      const response = await fetch(url, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch episodes");
      }
      return response.json();
    },
  });
};

export const useEpisode = (id: number) => {
  return useQuery<Episode>({
    queryKey: ["episode", id],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/episodes/${id}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch episode");
      }
      return response.json();
    },
    enabled: !!id,
  });
};

export const useCreateEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<Episode>) => {
      const response = await fetch(`${API_BASE_URL}/episodes`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to create episode");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
};

export const useUpdateEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Episode> & { id: number }) => {
      const response = await fetch(`${API_BASE_URL}/episodes/${id}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update episode");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
      queryClient.invalidateQueries({ queryKey: ["episode", variables.id] });
    },
  });
};

export const useDeleteEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`${API_BASE_URL}/episodes/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete episode");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["episodes"] });
    },
  });
};

// ========================
// EPISODE SKILLS
// ========================

export const useEpisodeSkills = (episodeId: number) => {
  return useQuery<EpisodeSkill[]>({
    queryKey: ["episodeSkills", episodeId],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/skills`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch episode skills");
      }
      return response.json();
    },
    enabled: !!episodeId,
  });
};

export const useCreateEpisodeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ episodeId, name }: { episodeId: number; name: string }) => {
      const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/skills`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to create episode skill");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodeSkills", variables.episodeId] });
    },
  });
};

export const useUpdateEpisodeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      episodeId,
      skillId,
      name,
    }: {
      episodeId: number;
      skillId: number;
      name: string;
    }) => {
      const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/skills/${skillId}`, {
        method: "PATCH",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      if (!response.ok) {
        throw new Error("Failed to update episode skill");
      }
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodeSkills", variables.episodeId] });
    },
  });
};

export const useDeleteEpisodeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ episodeId, skillId }: { episodeId: number; skillId: number }) => {
      const response = await fetch(`${API_BASE_URL}/episodes/${episodeId}/skills/${skillId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to delete episode skill");
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["episodeSkills", variables.episodeId] });
    },
  });
};
