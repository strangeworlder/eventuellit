import type { ShipRoom } from "../api/ship";

interface User {
  id: number;
  role: string;
}

export interface RoomPermissions {
  /** Can the user edit function, contents, and occupancy? */
  canEdit: boolean;
  /** Can the user suggest a claim on this room? */
  canClaim: boolean;
  /** Is a pending claim awaiting GM approval? */
  hasPendingClaim: boolean;
  /** Is the current user the one who submitted the pending claim? */
  isClaimant: boolean;
  /** Is the current user the confirmed owner? */
  isOwner: boolean;
  /** GM-only actions (approve/reject claim, toggle lock) */
  isGm: boolean;
}

export function useRoomPermissions(
  room: ShipRoom | undefined,
  user: User | null | undefined,
): RoomPermissions {
  if (!room || !user) {
    return {
      canEdit: false,
      canClaim: false,
      hasPendingClaim: false,
      isClaimant: false,
      isOwner: false,
      isGm: false,
    };
  }

  const isGm = user.role === "gm";
  const isOwner = room.ownerId === user.id;
  const isClaimant = room.claimantId === user.id;
  const hasPendingClaim = room.claimantId !== null && room.ownerId === null;

  let canEdit: boolean;
  if (isGm) {
    canEdit = true;
  } else if (room.isLocked) {
    canEdit = false;
  } else if (hasPendingClaim) {
    // Frozen state — nobody but GM can edit
    canEdit = false;
  } else if (room.ownerId !== null) {
    canEdit = isOwner;
  } else {
    // Unclaimed, no pending claim — anyone can edit
    canEdit = true;
  }

  const canClaim =
    !isGm &&
    room.ownerId === null &&
    room.claimantId === null &&
    !room.isLocked;

  return { canEdit, canClaim, hasPendingClaim, isClaimant, isOwner, isGm };
}
