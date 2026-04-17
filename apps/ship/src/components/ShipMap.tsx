import type { ShipRoom } from "../api/ship";

interface RoomShape {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  labelX: number;
  labelY: number;
}

/**
 * Fixed geometric layout of the ship's rooms.
 * These SVG element IDs must exactly match the svgElementId values
 * in the database (seeded in seed-ship.ts).
 *
 * Layout: top-down blueprint of a roughly wedge-shaped vessel.
 *
 *  ┌──────────────────────────────── 520 ────┐
 *  │  [bridge]            [medbay]           │
 *  │  [quarters-fore]  [commons]  [armory]   │
 *  │  [quarters-aft]   [cargo]               │
 *  │  [engine]                               │
 *  └─────────────────────────────────────────┘
 */
const ROOM_SHAPES: RoomShape[] = [
  { id: "room-bridge",        x: 20,  y: 20,  width: 180, height: 80,  labelX: 110, labelY: 64 },
  { id: "room-medbay",        x: 220, y: 20,  width: 140, height: 80,  labelX: 290, labelY: 64 },
  { id: "room-quarters-fore", x: 20,  y: 120, width: 160, height: 80,  labelX: 100, labelY: 164 },
  { id: "room-commons",       x: 200, y: 120, width: 110, height: 80,  labelX: 255, labelY: 164 },
  { id: "room-armory",        x: 325, y: 120, width: 100, height: 80,  labelX: 375, labelY: 164 },
  { id: "room-quarters-aft",  x: 20,  y: 220, width: 160, height: 80,  labelX: 100, labelY: 264 },
  { id: "room-cargo",         x: 200, y: 220, width: 225, height: 80,  labelX: 313, labelY: 264 },
  { id: "room-engine",        x: 20,  y: 320, width: 405, height: 70,  labelX: 222, labelY: 359 },
];

/** Derive the fill color for a room based on its ownership state. */
function roomFill(room: ShipRoom | undefined, currentUserId: number): string {
  if (!room) return "var(--theme-surface-tint)";
  if (room.isLocked) return "var(--theme-border-medium)";
  if (room.claimantId !== null && room.ownerId === null) {
    // Pending claim — amber-ish tint via secondary
    return "color-mix(in srgb, var(--theme-secondary) 30%, var(--theme-bg) 70%)";
  }
  if (room.ownerId === currentUserId) return "var(--theme-primary)";
  if (room.ownerId !== null) {
    return "color-mix(in srgb, var(--theme-accent) 40%, var(--theme-bg) 60%)";
  }
  return "var(--theme-surface-tint)";
}

function roomStroke(room: ShipRoom | undefined): string {
  if (!room) return "var(--theme-border-soft)";
  if (room.isLocked) return "var(--theme-text-muted)";
  if (room.claimantId !== null && room.ownerId === null)
    return "var(--theme-secondary)";
  if (room.ownerId !== null) return "var(--theme-primary)";
  return "var(--theme-border-soft)";
}

interface ShipMapProps {
  rooms: ShipRoom[];
  currentUserId: number;
  onRoomClick?: (room: ShipRoom) => void;
  /** When true, disables navigation clicks (used inside MapModal) */
  readonly?: boolean;
}

export function ShipMap({ rooms, currentUserId, onRoomClick, readonly = false }: ShipMapProps) {
  const roomById = new Map(rooms.map((r) => [r.svgElementId, r]));

  return (
    <svg
      viewBox="0 0 445 410"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aluksen kartta"
      className="w-full h-full"
      style={{ maxHeight: "100%", display: "block" }}
    >
      {/* Ship hull outline */}
      <rect
        x="10"
        y="10"
        width="425"
        height="390"
        rx="18"
        fill="var(--theme-bg)"
        stroke="var(--theme-border-medium)"
        strokeWidth="2"
      />

      {ROOM_SHAPES.map((shape) => {
        const room = roomById.get(shape.id);
        const fill = roomFill(room, currentUserId);
        const stroke = roomStroke(room);
        const isInteractive = !readonly && !!room;

        return (
          <g key={shape.id}>
            <rect
              id={shape.id}
              x={shape.x}
              y={shape.y}
              width={shape.width}
              height={shape.height}
              rx="6"
              fill={fill}
              stroke={stroke}
              strokeWidth={room?.isLocked ? 2 : 1.5}
              style={{
                cursor: isInteractive ? "pointer" : "default",
                transition: "fill 200ms ease, stroke 200ms ease",
              }}
              onClick={isInteractive && room ? () => onRoomClick?.(room) : undefined}
              role={isInteractive ? "button" : undefined}
              aria-label={room ? `${room.name}: Avaa huoneen hallinta` : shape.id}
              className={isInteractive ? "hover:opacity-80" : ""}
            />
            {/* Room name label */}
            <text
              x={shape.labelX}
              y={shape.labelY - 14}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--theme-text)"
              style={{ pointerEvents: "none", fontFamily: "var(--font-sans, sans-serif)" }}
            >
              {room?.name ?? shape.id}
            </text>
            {/* Occupant count badge */}
            {room && room.occupants.length > 0 && (
              <text
                x={shape.labelX}
                y={shape.labelY + 4}
                textAnchor="middle"
                fontSize="10"
                fill="var(--theme-text-muted)"
                style={{ pointerEvents: "none", fontFamily: "var(--font-sans, sans-serif)" }}
              >
                {room.occupants.length} hlö
              </text>
            )}
            {/* Lock icon indicator */}
            {room?.isLocked && (
              <text
                x={shape.x + shape.width - 12}
                y={shape.y + 16}
                fontSize="12"
                fill="var(--theme-text-muted)"
                style={{ pointerEvents: "none" }}
              >
                🔒
              </text>
            )}
            {/* Pending claim indicator */}
            {room?.claimantId !== null && room?.ownerId === null && (
              <text
                x={shape.x + shape.width - 12}
                y={shape.y + 16}
                fontSize="12"
                fill="var(--theme-secondary)"
                style={{ pointerEvents: "none" }}
              >
                ⏳
              </text>
            )}
          </g>
        );
      })}

      {/* Legend */}
      <g transform="translate(10, 395)" fontSize="9" fill="var(--theme-text-muted)">
        <rect x="0" y="-8" width="10" height="10" rx="2" fill="var(--theme-surface-tint)" stroke="var(--theme-border-soft)" strokeWidth="1" />
        <text x="13" y="0">Vapaa</text>
        <rect x="55" y="-8" width="10" height="10" rx="2" fill="var(--theme-primary)" stroke="var(--theme-primary)" strokeWidth="1" />
        <text x="68" y="0">Sinun</text>
        <rect x="110" y="-8" width="10" height="10" rx="2" fill="color-mix(in srgb, var(--theme-accent) 40%, var(--theme-bg) 60%)" stroke="var(--theme-accent)" strokeWidth="1" />
        <text x="123" y="0">Varattu</text>
        <rect x="170" y="-8" width="10" height="10" rx="2" fill="color-mix(in srgb, var(--theme-secondary) 30%, var(--theme-bg) 70%)" stroke="var(--theme-secondary)" strokeWidth="1" />
        <text x="183" y="0">Odottaa</text>
        <rect x="240" y="-8" width="10" height="10" rx="2" fill="var(--theme-border-medium)" stroke="var(--theme-text-muted)" strokeWidth="1" />
        <text x="253" y="0">Lukittu</text>
      </g>
    </svg>
  );
}
