import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { EditableField } from "@repo/ui/components/EditableField";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Icon } from "@repo/ui/components/Icon";
import { Container, Stack } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Text } from "@repo/ui/components/Text";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddOccupant,
  useApproveClaim,
  useCharacters,
  useRejectClaim,
  useRemoveOccupant,
  useRoom,
  useShipData,
  useSuggestClaim,
  useToggleLock,
  useUpdateRoom,
} from "../api/ship";
import { useRoomPermissions } from "../hooks/use-room-permissions";
import { MapModal } from "./MapModal";
import { OccupantList } from "./OccupantList";

// ── Room state badge ──────────────────────────────────────────────────────────

interface RoomStateBadgeProps {
  ownerId: number | null;
  claimantId: number | null;
  isLocked: boolean;
  ownerName: string | null;
}

function RoomStateBadge({ ownerId, claimantId, isLocked, ownerName }: RoomStateBadgeProps) {
  if (isLocked) {
    return (
      <Badge variant="ghost" icon="shield" theme="base">
        Lukittu
      </Badge>
    );
  }
  if (claimantId !== null && ownerId === null) {
    return (
      <Badge variant="outline" icon="clock" theme="secondary-dark">
        Odottaa hyväksyntää
      </Badge>
    );
  }
  if (ownerId !== null) {
    return (
      <Badge variant="solid" theme="primary-dark">
        {ownerName ?? "Varattu"}
      </Badge>
    );
  }
  return (
    <Badge variant="ghost" theme="base">
      Vapaa
    </Badge>
  );
}

// ── RoomView ──────────────────────────────────────────────────────────────────

export function RoomView({ basePath }: { basePath: string }) {
  const { id } = useParams<{ id: string }>();
  const roomId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: room, isLoading: roomLoading } = useRoom(roomId);
  const { data: ship } = useShipData();
  const { data: characters = [] } = useCharacters();

  const [showMap, setShowMap] = useState(false);

  const perms = useRoomPermissions(room, user);

  const updateRoom = useUpdateRoom(roomId);
  const addOccupant = useAddOccupant(roomId);
  const removeOccupant = useRemoveOccupant(roomId);
  const suggestClaim = useSuggestClaim(roomId);
  const approveClaim = useApproveClaim(roomId);
  const rejectClaim = useRejectClaim(roomId);
  const toggleLock = useToggleLock(roomId);

  if (roomLoading || !room) {
    return <LoadingState message="Ladataan huonetta..." size="large" className="mt-8" />;
  }

  return (
    <HeadingLevelProvider>
      <div
        className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)]"
      >
        {/* Top navigation bar */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--theme-border-soft)]">
          <Button
            variant="ghost-subtle"
            size="sm"
            onClick={() => navigate(basePath)}
          >
            ← Kartta
          </Button>
          <Stack direction="row" gap={2} align="center" className="flex-1 min-w-0">
            <span className="font-bold text-lg truncate text-[var(--theme-text)]">
              {room.name}
            </span>
            <RoomStateBadge
              ownerId={room.ownerId}
              claimantId={room.claimantId}
              isLocked={room.isLocked}
              ownerName={room.ownerName}
            />
          </Stack>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(true)}
          >
            Näytä kartta
          </Button>
        </div>

        {/* Main content */}
        <Container size="prose" className="py-6">
          <Stack gap={6}>
            {/* Pending claim notice */}
            {perms.hasPendingClaim && (
              <NoticePanel
                variant="info"
                title="Omistajuushakemus odottaa hyväksyntää"
                actions={
                  perms.isGm ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => approveClaim.mutate()}
                        loading={approveClaim.isPending}
                      >
                        Hyväksy
                      </Button>
                      <Button
                        variant="ghost-subtle"
                        size="sm"
                        onClick={() => rejectClaim.mutate()}
                        loading={rejectClaim.isPending}
                      >
                        Hylkää
                      </Button>
                    </>
                  ) : undefined
                }
              >
                <Text variant="small">
                  Pelinjohtajan täytyy hyväksyä tai hylätä hakemus ennen kuin huonetta voi muokata.
                </Text>
              </NoticePanel>
            )}

            {/* Function */}
            <EditableField
              label="Käyttötarkoitus"
              value={room.function ?? ""}
              placeholder="esim. Navigointi"
              readOnly={!perms.canEdit}
              onSave={(value) => updateRoom.mutate({ function: value })}
              saveLabel="Tallenna"
              cancelLabel="Peruuta"
            />

            {/* Contents / notes */}
            <EditableField
              label="Sisältö ja muistiinpanot"
              value={room.contents ?? ""}
              placeholder="Inventaario, lore-muistiinpanot..."
              multiline
              readOnly={!perms.canEdit}
              onSave={(value) => updateRoom.mutate({ contents: value })}
              saveLabel="Tallenna"
              cancelLabel="Peruuta"
            />

            {/* Occupancy manifest */}
            <section>
              <Text
                variant="label"
                className="block mb-3 text-text-muted uppercase tracking-widest text-xs"
              >
                Henkilöstö ({room.occupants.length})
              </Text>
              <OccupantList
                occupants={room.occupants}
                characters={characters}
                canEdit={perms.canEdit}
                onAdd={(charId) => addOccupant.mutate(charId)}
                onRemove={(charId) => removeOccupant.mutate(charId)}
                isAddPending={addOccupant.isPending}
                isRemovePending={removeOccupant.isPending}
              />
            </section>

            {/* Action row */}
            <Stack direction="row" gap={3} wrap>
              {perms.canClaim && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => suggestClaim.mutate()}
                  loading={suggestClaim.isPending}
                >
                  Ehdota omistajuutta
                </Button>
              )}
              {perms.isGm && (
                <Button
                  variant="ghost-subtle"
                  size="sm"
                  onClick={() => toggleLock.mutate()}
                  loading={toggleLock.isPending}
                >
                  <Icon name={room.isLocked ? "shield" : "shield-alert"} size={14} />
                  {room.isLocked ? "Avaa huone" : "Lukitse huone"}
                </Button>
              )}
            </Stack>

            {/* Error feedback */}
            {updateRoom.isError && (
              <NoticePanel variant="error" title="Tallentaminen epäonnistui">
                <Text variant="small">
                  {(updateRoom.error as Error).message}
                </Text>
              </NoticePanel>
            )}
          </Stack>
        </Container>

        {/* Map modal */}
        {ship && (
          <MapModal
            rooms={ship.rooms}
            currentUserId={user?.id ?? 0}
            open={showMap}
            onClose={() => setShowMap(false)}
            basePath={basePath}
          />
        )}
      </div>
    </HeadingLevelProvider>
  );
}
