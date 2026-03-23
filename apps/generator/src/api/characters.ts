import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

const API_URL = `${apiBaseUrl}/characters`;

export interface CreateCharacterDto {
  name: string;
  archetype: "soldier" | "expert";
  episodeId: number;
  sex?: string;
  motivation?: string;
  notes?: string;
  keho: number;
  mieli: number;
  tera: number;
  sisuDie: "n6" | "n8";
  sisuCount: number;
  skills: { name: string; isCustom?: boolean }[];
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newCharacter: CreateCharacterDto) => {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
