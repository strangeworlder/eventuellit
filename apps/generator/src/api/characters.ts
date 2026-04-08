import { useMutation, useQueryClient } from "@tanstack/react-query";
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
