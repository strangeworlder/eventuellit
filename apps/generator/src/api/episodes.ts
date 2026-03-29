import { useQuery } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem("auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export interface Episode {
  id: number;
  slug: string;
  title: string;
  order: number;
  status: string;
  description: string | null;
  players: string | null;
  sessionDates: string | null;
  location: string | null;
  locationLink: string | null;
  image: string | null;
  imageAlt: string | null;
  mechanicalAdditions: string | null;
}

export interface EpisodeSkill {
  id: number;
  episodeId: number;
  name: string;
}

export const useActiveEpisodes = () => {
  return useQuery<Episode[]>({
    queryKey: ["episodes", "active"],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/episodes?status=active`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch episodes");
      return response.json();
    },
  });
};

export const useEpisode = (episodeId: number | null) => {
  return useQuery<Episode>({
    queryKey: ["episode", episodeId],
    queryFn: async () => {
      const response = await fetch(`${apiBaseUrl}/episodes/${episodeId}`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch episode");
      return response.json();
    },
    enabled: !!episodeId,
  });
};

export const useEpisodeSkills = (episodeId?: number) => {
  return useQuery<EpisodeSkill[]>({
    queryKey: ["episodeSkills", episodeId],
    queryFn: async () => {
      if (!episodeId) return [];
      const response = await fetch(`${apiBaseUrl}/episodes/${episodeId}/skills`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch skills");
      return response.json();
    },
    enabled: !!episodeId,
  });
};
