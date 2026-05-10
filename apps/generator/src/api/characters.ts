import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const API_URL = `${apiBaseUrl}/characters`;

export interface CreateCharacterDto {
  name: string;
  archetype: string;
  episodeId: number;
  sex?: string;
  motivation?: string;
  notes?: string;
  nicknames?: string[];
  keho: number;
  mieli: number;
  tera: number;
  sisuDice: Array<{ id: string; faces: number }>;
  skills: { name: string; isCustom?: boolean }[];
  fysiikka?: number;
  nopeus?: number;
  ymmarrys?: number;
  persoona?: number;
  nakemys?: number;
  napparyys?: number;
}

export interface CharacterEpisodeLink {
  id: number;
  title: string;
  status: string;
  refreshedAt?: string | null;
  advancedAt?: string | null;
}

export interface CharacterListItem {
  id: number;
  userId: number;
  name: string;
  archetype: string;
  ownerName?: string;
  harmit?: Array<{ text: string; healed: boolean }>;
  sisuDice?: Array<{ id: string; faces: number }>;
  removedSisuIds?: string[];
  episodes?: CharacterEpisodeLink[];
  hasPlayedSessions?: boolean;
  [key: string]: unknown;
}

export function useCharacters() {
  return useQuery<CharacterListItem[]>({
    queryKey: ["characters"],
    queryFn: async () => {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(`${apiBaseUrl}/characters`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch characters");
      return res.json();
    },
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCharacter: CreateCharacterDto) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify(newCharacter),
      });

      if (!response.ok) {
        throw new Error("Failed to create character");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch if we had a query list
      queryClient.invalidateQueries({ queryKey: ["characters"] });
    },
  });
}

export function useLinkCharacterEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ characterId, episodeId }: { characterId: number; episodeId: number }) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/${characterId}/link-episode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ episodeId }),
      });

      if (!response.ok) {
        throw new Error("Failed to link character to episode");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useRefreshCharacterForEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      episodeId,
      healedHarmitIndexes,
    }: {
      characterId: number;
      episodeId: number;
      healedHarmitIndexes?: number[];
    }) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/${characterId}/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ episodeId, healedHarmitIndexes }),
      });

      if (!response.ok) {
        throw new Error("Failed to refresh character");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useAdvanceCharacterForEpisode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      characterId,
      episodeId,
      attribute,
      reward,
      newSkills,
    }: {
      characterId: number;
      episodeId: number;
      attribute: "fysiikka" | "nopeus" | "ymmarrys" | "persoona" | "nakemys" | "napparyys";
      reward: "skills_plus_n6" | "skill_plus_n8";
      newSkills: string[];
    }) => {
      const token = localStorage.getItem("auth_token");
      const response = await fetch(`${API_URL}/${characterId}/advance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
        body: JSON.stringify({ episodeId, attribute, reward, newSkills }),
      });

      if (!response.ok) {
        throw new Error("Failed to advance character");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}
