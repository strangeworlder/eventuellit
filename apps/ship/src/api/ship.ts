import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Occupant {
  characterId: number;
  characterName: string;
  archetype: string;
  userId: number;
}

export interface ShipRoom {
  id: number;
  shipId: number;
  svgElementId: string;
  name: string;
  function: string | null;
  contents: string | null;
  ownerId: number | null;
  claimantId: number | null;
  isLocked: boolean;
  ownerName: string | null;
  occupants: Occupant[];
  createdAt: string;
  updatedAt: string;
}

export interface Ship {
  id: number;
  name: string;
  rooms: ShipRoom[];
}

export interface Character {
  id: number;
  name: string;
  archetype: string;
  userId: number;
  ownerName: string | null;
}

// ─── Query hooks ────────────────────────────────────────────────────────────

export function useShipData() {
  return useQuery<Ship>({
    queryKey: ["ship"],
    queryFn: () => apiFetch<Ship>("/ship"),
  });
}

export function useRoom(id: number) {
  return useQuery<ShipRoom>({
    queryKey: ["ship", "room", id],
    queryFn: () => apiFetch<ShipRoom>(`/ship/rooms/${id}`),
  });
}

export function useCharacters() {
  return useQuery<Character[]>({
    queryKey: ["characters"],
    queryFn: () => apiFetch<Character[]>("/characters"),
  });
}

// ─── Mutation hooks ─────────────────────────────────────────────────────────

export function useUpdateRoom(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { function?: string; contents?: string }) =>
      apiFetch<ShipRoom>(`/ship/rooms/${roomId}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["ship"] });
      void qc.invalidateQueries({ queryKey: ["ship", "room", roomId] });
    },
  });
}

export function useAddOccupant(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (characterId: number) =>
      apiFetch(`/ship/rooms/${roomId}/occupants`, {
        method: "POST",
        body: JSON.stringify({ characterId }),
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["ship"] });
      void qc.invalidateQueries({ queryKey: ["ship", "room", roomId] });
    },
  });
}

export function useRemoveOccupant(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (characterId: number) =>
      apiFetch(`/ship/rooms/${roomId}/occupants/${characterId}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["ship"] });
      void qc.invalidateQueries({ queryKey: ["ship", "room", roomId] });
    },
  });
}

export function useSuggestClaim(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/ship/rooms/${roomId}/claim`, { method: "POST" }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["ship"] }),
  });
}

export function useApproveClaim(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/ship/rooms/${roomId}/approve-claim`, { method: "POST" }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["ship"] }),
  });
}

export function useRejectClaim(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/ship/rooms/${roomId}/reject-claim`, { method: "POST" }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["ship"] }),
  });
}

export function useToggleLock(roomId: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () =>
      apiFetch(`/ship/rooms/${roomId}/lock`, { method: "PATCH" }),
    onSuccess: () => void qc.invalidateQueries({ queryKey: ["ship"] }),
  });
}
