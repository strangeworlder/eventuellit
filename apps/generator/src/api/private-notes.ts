import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiBaseUrl } from "./base-url";

export interface CharacterPrivateNote {
  id: number;
  characterId: number;
  episodeId: number | null;
  episodeTitle: string | null;
  title: string | null;
  content: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrivateNotePayload {
  title?: string | null;
  content: string;
  episodeId?: number | null;
  isPinned?: boolean;
}

export interface UpdatePrivateNotePayload {
  noteId: number;
  title?: string | null;
  content?: string;
  episodeId?: number | null;
  isPinned?: boolean;
}

function getAuthHeaders(withJson = false): Record<string, string> {
  const token = localStorage.getItem("auth_token");
  return {
    ...(withJson ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function privateNotesQueryKey(characterId: number) {
  return ["character-private-notes", characterId] as const;
}

export function useCharacterPrivateNotes(characterId: number, enabled: boolean) {
  return useQuery<CharacterPrivateNote[]>({
    queryKey: privateNotesQueryKey(characterId),
    enabled,
    queryFn: async () => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}/private-notes`, {
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("Yksityisten muistiinpanojen lataaminen epäonnistui");
      }
      return res.json();
    },
  });
}

export function useCreatePrivateNote(characterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreatePrivateNotePayload) => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}/private-notes`, {
        method: "POST",
        headers: getAuthHeaders(true),
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || "Muistiinpanon tallentaminen epäonnistui");
      }
      return res.json() as Promise<CharacterPrivateNote>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privateNotesQueryKey(characterId) });
    },
  });
}

export function useUpdatePrivateNote(characterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ noteId, ...updates }: UpdatePrivateNotePayload) => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}/private-notes/${noteId}`, {
        method: "PATCH",
        headers: getAuthHeaders(true),
        credentials: "include",
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || "Muistiinpanon päivittäminen epäonnistui");
      }
      return res.json() as Promise<CharacterPrivateNote>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privateNotesQueryKey(characterId) });
    },
  });
}

export function useDeletePrivateNote(characterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (noteId: number) => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}/private-notes/${noteId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || "Muistiinpanon poistaminen epäonnistui");
      }
      return res.json() as Promise<{ deleted: boolean }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: privateNotesQueryKey(characterId) });
    },
  });
}

export function useMigratePublicNotes(characterId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(`${apiBaseUrl}/characters/${characterId}/migrate-public-notes`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(err.message || "Julkisen kuvauksen siirtäminen epäonnistui");
      }
      return res.json() as Promise<{ migrated: boolean; note: CharacterPrivateNote }>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character", characterId] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: privateNotesQueryKey(characterId) });
    },
  });
}
