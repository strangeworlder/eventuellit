import { ApiError, apiFetch } from "@repo/auth/client";
import type {
  DowntimeDraftAllocation,
  DowntimeHarmiItem,
} from "@repo/ui/components/DowntimeAllocator";
import type { ProgressClockSegments } from "@repo/ui/components/ProgressClock";
import type { Theme } from "@repo/ui/components/Theme";
import { requestToast } from "@repo/ui/components/Toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ShipRoomKind = "facility" | "cabin" | "sealed";
export type ShipRoomStatusTone = "normal" | "warning" | "critical" | "locked";

export interface ShipConfig {
  id: number;
  name: string;
  callsign: string;
  theme: Theme;
  statusBanner: string;
  hullNotes: string | null;
  updatedAt: string;
}

export interface ShipRoomOccupant {
  characterId: number;
  name: string;
  archetype: string;
  userId: number;
  ownerName: string;
  isOwn: boolean;
}

export interface ShipRoom {
  id: number;
  key: string;
  deckNumber: number;
  kind: ShipRoomKind;
  svgZoneId: string;
  name: string;
  subtitle: string | null;
  description: string;
  statusLabel: string;
  statusTone: ShipRoomStatusTone;
  isLocked: boolean;
  claimedByCharacterId: number | null;
  cabinCustomTitle: string | null;
  cabinDecoration: string | null;
  gmRoomNotes: string | null;
  orderIndex: number;
  occupant: ShipRoomOccupant | null;
}

export interface ShipClock {
  id: number;
  category: "tutkimus" | "projekti";
  scope: "ship" | "character";
  characterId: number | null;
  characterName: string | null;
  characterUserId: number | null;
  roomKey: string | null;
  title: string;
  description: string;
  segmentsTotal: ProgressClockSegments | null;
  segmentsFilled: number;
  status: "active" | "completed" | "archived";
  completionNotes: string | null;
  createdByUserId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MyShipCharacter {
  id: number;
  name: string;
  archetype: string;
  activeHarmitCount: number;
  availableDice: number;
  claimedRoom: { key: string; name: string; deckNumber: number } | null;
}

export interface CrewShipCharacter {
  id: number;
  name: string;
  archetype: string;
  userId: number;
  claimedRoom: { key: string; name: string; deckNumber: number } | null;
}

export interface UpcomingPrepEntry {
  turnId: number;
  characterId: number;
  characterName: string;
  episodeId: number | null;
  episodeTitle: string;
  episodeStatus: string;
  diceCount: number;
  description: string;
  rolls: number[];
  hits: number;
  hasDoubles: boolean;
  isCritical: boolean;
  resolvedAt: string | null;
}

export interface ShipOverviewResponse {
  config: ShipConfig;
  rooms: ShipRoom[];
  clocks: ShipClock[];
  myCharacters: MyShipCharacter[];
  crewCharacters: CrewShipCharacter[];
  upcomingPreps: UpcomingPrepEntry[];
}

export interface CabinPossession {
  id: number;
  characterId: number;
  name: string;
  description: string;
  gmMechanicalNotes: string | null;
  isLockedByGm: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface CabinDetailsResponse {
  character: {
    id: number;
    userId: number;
    name: string;
    archetype: string;
    ownerName: string;
    isOwn: boolean;
  };
  claimedRoom: ShipRoom | null;
  possessions: CabinPossession[];
  canEditInterior: boolean;
  isGm: boolean;
}

export interface DowntimeEpisodeRef {
  episodeId: number;
  title: string;
  slug: string;
  status: string;
  order: number;
}

export interface DowntimeResolutionPayload {
  availableDice: number;
  healedHarmit: Array<{ index: number; text: string }>;
  clockResults: Array<{
    clockId: number;
    title: string;
    category: "tutkimus" | "projekti";
    diceCount: number;
    rolls: number[];
    hits: number;
    hasDoubles: boolean;
    isCritical: boolean;
    ticksAdded: number;
    segmentsFilledAfter: number;
    segmentsTotal: number | null;
    completedNow: boolean;
  }>;
  prepResult: {
    diceCount: number;
    description: string;
    rolls: number[];
    hits: number;
    hasDoubles: boolean;
    isCritical: boolean;
  } | null;
}

export interface ResolvedDowntimeTurn {
  id: number;
  sourceEpisodeId: number;
  sourceEpisodeTitle: string;
  lockedEpisodeId: number | null;
  lockedEpisodeTitle: string | null;
  resolvedAt: string | null;
  resolution: DowntimeResolutionPayload | null;
}

export interface CharacterDowntimeResponse {
  character: {
    id: number;
    name: string;
    archetype: string;
    isLiving: boolean;
    harmit: Array<{ text: string; healed: boolean }>;
  };
  availableDice: number;
  activeHarmit: DowntimeHarmiItem[];
  pendingSourceEpisode: DowntimeEpisodeRef | null;
  lockedEpisode: DowntimeEpisodeRef | null;
  canDraft: boolean;
  canRoll: boolean;
  blockReason: string | null;
  draft: DowntimeDraftAllocation;
  eligibleClocks: ShipClock[];
  resolvedTurns: ResolvedDowntimeTurn[];
}

export const SHIP_THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: "base", label: "Perustila (Aamunkoi)" },
  { value: "inverted", label: "Käänteinen korkeakontrasti" },
  { value: "primary-light", label: "Pääväri vaalea" },
  { value: "primary-dark", label: "Pääväri tumma" },
  { value: "secondary-light", label: "Toissijainen vaalea" },
  { value: "secondary-dark", label: "Toissijainen tumma" },
  { value: "accent-light", label: "Korostus vaalea" },
  { value: "accent-dark", label: "Korostus tumma" },
  { value: "royal", label: "Kuninkaallinen" },
  { value: "royal-dark", label: "Kuninkaallinen tumma" },
];

export const VALID_SHIP_THEMES = new Set<string>(SHIP_THEME_OPTIONS.map((t) => t.value));

export function resolveShipTheme(raw?: string | null): Theme {
  if (raw && VALID_SHIP_THEMES.has(raw)) {
    return raw as Theme;
  }
  return "base";
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const body = err.body as { message?: string | string[] } | undefined;
    if (body && Array.isArray(body.message) && body.message.length > 0) {
      return body.message.join(", ");
    }
    if (err.message) return err.message;
  }
  if (err instanceof Error && err.message) {
    return err.message;
  }
  return fallback;
}

// ─── Queries & Mutations ──────────────────────────────────────────────────────

export function useShipOverview() {
  return useQuery<ShipOverviewResponse>({
    queryKey: ["ship", "overview"],
    queryFn: () => apiFetch<ShipOverviewResponse>("/ship/overview"),
  });
}

export function useUpdateShipConfig() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { theme?: Theme; statusBanner?: string; hullNotes?: string | null }) =>
      apiFetch<ShipConfig>("/ship/config", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Aluksen kokoonpano päivitetty.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Aluksen tilan päivitys epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useCreateShipRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      key: string;
      deckNumber: number;
      kind: ShipRoomKind;
      svgZoneId?: string;
      name: string;
      subtitle?: string | null;
      description: string;
      statusLabel?: string;
      statusTone?: ShipRoomStatusTone;
      isLocked?: boolean;
      gmRoomNotes?: string | null;
      orderIndex?: number;
    }) =>
      apiFetch<ShipRoom>("/ship/rooms", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Uusi osasto lisätty kansikartalle.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Osaston luonti epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useUpdateShipRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      key,
      ...payload
    }: {
      key: string;
      name?: string;
      subtitle?: string | null;
      description?: string;
      statusLabel?: string;
      statusTone?: ShipRoomStatusTone;
      isLocked?: boolean;
      gmRoomNotes?: string | null;
      claimedByCharacterId?: number | null;
      orderIndex?: number;
    }) =>
      apiFetch<ShipRoom>(`/ship/rooms/${encodeURIComponent(key)}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Osaston tiedot tallennettu.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Osaston päivitys epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useClaimCabin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, characterId }: { key: string; characterId: number }) =>
      apiFetch<ShipRoom>(`/ship/rooms/${encodeURIComponent(key)}/claim`, {
        method: "POST",
        body: JSON.stringify({ characterId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      requestToast({ message: "Hytti varattu hahmolle.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Hytin varaus epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useVacateCabin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) =>
      apiFetch<ShipRoom>(`/ship/rooms/${encodeURIComponent(key)}/vacate`, {
        method: "POST",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      requestToast({ message: "Hytti vapautettu.", variant: "info" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Hytin vapautus epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useCabinDetails(characterId: number | null) {
  return useQuery<CabinDetailsResponse>({
    queryKey: ["ship", "cabin", characterId],
    queryFn: () => apiFetch<CabinDetailsResponse>(`/ship/cabins/${characterId}`),
    enabled: Boolean(characterId && characterId > 0),
  });
}

export function useUpdateCabinInterior() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      characterId,
      cabinCustomTitle,
      cabinDecoration,
    }: {
      characterId: number;
      cabinCustomTitle?: string | null;
      cabinDecoration?: string | null;
    }) =>
      apiFetch<ShipRoom>(`/ship/cabins/${characterId}`, {
        method: "PATCH",
        body: JSON.stringify({ cabinCustomTitle, cabinDecoration }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Hytin sisustus tallennettu.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Hytin sisustuksen tallennus epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useCreatePossession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      characterId,
      name,
      description,
    }: {
      characterId: number;
      name: string;
      description: string;
    }) =>
      apiFetch<CabinPossession>(`/ship/cabins/${characterId}/possessions`, {
        method: "POST",
        body: JSON.stringify({ name, description }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Erikoisomistus lisätty hyttiin.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Omistuksen lisääminen epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useUpdatePossession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      name,
      description,
      gmMechanicalNotes,
    }: {
      id: number;
      name?: string;
      description?: string;
      gmMechanicalNotes?: string | null;
    }) =>
      apiFetch<CabinPossession>(`/ship/possessions/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ name, description, gmMechanicalNotes }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Omistus päivitetty.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Omistuksen päivitys epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useDeletePossession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ deleted: boolean }>(`/ship/possessions/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Omistus poistettu hytistä.", variant: "info" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Omistuksen poisto epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useShipClocks() {
  return useQuery<ShipClock[]>({
    queryKey: ["ship", "clocks"],
    queryFn: () => apiFetch<ShipClock[]>("/ship/clocks"),
  });
}

export function useCreateShipClock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      category: "tutkimus" | "projekti";
      scope: "ship" | "character";
      characterId?: number | null;
      roomKey?: string | null;
      title: string;
      description?: string;
      segmentsTotal?: ProgressClockSegments | null;
    }) =>
      apiFetch<ShipClock>("/ship/clocks", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Uusi kello luotu aluksen lokiin.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Kellon luonti epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useUpdateShipClock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...payload
    }: {
      id: number;
      title?: string;
      description?: string;
      category?: "tutkimus" | "projekti";
      scope?: "ship" | "character";
      characterId?: number | null;
      roomKey?: string | null;
      segmentsTotal?: ProgressClockSegments | null;
      segmentsFilled?: number;
      status?: "active" | "completed" | "archived";
      completionNotes?: string | null;
    }) =>
      apiFetch<ShipClock>(`/ship/clocks/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Kello päivitetty.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Kellon päivitys epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useDeleteShipClock() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiFetch<{ deleted: boolean }>(`/ship/clocks/${id}`, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Kello poistettu.", variant: "info" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Kellon poisto epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useCharacterDowntime(characterId: number | null) {
  return useQuery<CharacterDowntimeResponse>({
    queryKey: ["ship", "downtime", characterId],
    queryFn: () => apiFetch<CharacterDowntimeResponse>(`/ship/downtime/${characterId}`),
    enabled: Boolean(characterId && characterId > 0),
  });
}

export function useSaveDowntimeDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      characterId,
      allocation,
    }: {
      characterId: number;
      allocation: DowntimeDraftAllocation;
    }) =>
      apiFetch<unknown>(`/ship/downtime/${characterId}/draft`, {
        method: "PUT",
        body: JSON.stringify(allocation),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      requestToast({ message: "Väliaikaluonnos tallennettu.", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Luonnoksen tallennus epäonnistui."),
        variant: "error",
      });
    },
  });
}

export function useResolveDowntime() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      characterId,
      allocation,
    }: {
      characterId: number;
      allocation: DowntimeDraftAllocation;
    }) =>
      apiFetch<{ turn: unknown; resolution: DowntimeResolutionPayload }>(
        `/ship/downtime/${characterId}/resolve`,
        {
          method: "POST",
          body: JSON.stringify(allocation),
        },
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ship"] });
      queryClient.invalidateQueries({ queryKey: ["characters"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      requestToast({ message: "Väliaika heitetty ja kirjattu!", variant: "success" });
    },
    onError: (err) => {
      requestToast({
        message: extractErrorMessage(err, "Väliaikaheiton vahvistus epäonnistui."),
        variant: "error",
      });
    },
  });
}
