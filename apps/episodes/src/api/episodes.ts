import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@repo/auth/client";
import { queryKeys } from "./query-keys";

export type EpisodeStatus = "active" | "completed" | "planned";

export interface Episode {
  id: number;
  title: string;
  slug: string;
  order: number;
  status: EpisodeStatus;
  description: string | null;
  content: string | null;
  location: string | null;
  locationLink: string | null;
  image: string | null;
  imageAlt: string | null;
  theme: string | null;
  mechanicalAdditions: string | null;
  summary: string | null;
  tyrannyRoll: number | null;
  gmId: number;
  createdAt: string;
  updatedAt: string;
}

export interface EpisodeSkill {
  id: number;
  episodeId: number;
  name: string;
}

export const useEpisodes = (status?: string) => {
  return useQuery<Episode[]>({
    queryKey: queryKeys.episodes.list(status),
    queryFn: () => {
      const params = status ? `?status=${status}` : "";
      return apiFetch<Episode[]>(`/episodes${params}`);
    },
  });
};

export const useEpisode = (id: number) => {
  return useQuery<Episode>({
    queryKey: queryKeys.episodes.detail(id),
    queryFn: () => apiFetch<Episode>(`/episodes/${id}`),
    enabled: !!id,
  });
};

export const useCreateEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Episode>) =>
      apiFetch<Episode>("/episodes", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.all });
    },
  });
};

export const useUpdateEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Episode> & { id: number }) =>
      apiFetch<Episode>(`/episodes/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.all });
    },
  });
};

export const useDeleteEpisode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch(`/episodes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.all });
    },
  });
};

export const useEpisodeSkills = (episodeId: number) => {
  return useQuery<EpisodeSkill[]>({
    queryKey: queryKeys.episodes.skills(episodeId),
    queryFn: () => apiFetch<EpisodeSkill[]>(`/episodes/${episodeId}/skills`),
    enabled: !!episodeId,
  });
};

export const useCreateEpisodeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ episodeId, name }: { episodeId: number; name: string }) =>
      apiFetch<EpisodeSkill>(`/episodes/${episodeId}/skills`, {
        method: "POST",
        body: JSON.stringify({ name }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.skills(variables.episodeId) });
    },
  });
};

export const useUpdateEpisodeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ episodeId, skillId, name }: { episodeId: number; skillId: number; name: string }) =>
      apiFetch<EpisodeSkill>(`/episodes/${episodeId}/skills/${skillId}`, {
        method: "PATCH",
        body: JSON.stringify({ name }),
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.skills(variables.episodeId) });
    },
  });
};

export const useDeleteEpisodeSkill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ episodeId, skillId }: { episodeId: number; skillId: number }) =>
      apiFetch(`/episodes/${episodeId}/skills/${skillId}`, { method: "DELETE" }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.episodes.skills(variables.episodeId) });
    },
  });
};
