import { Dialog } from "@repo/ui/components/Dialog";
import { Text } from "@repo/ui/components/Text";
import { useNavigate } from "react-router-dom";
import type { ShipRoom } from "../api/ship";
import { ShipMap } from "./ShipMap";

interface MapModalProps {
  rooms: ShipRoom[];
  currentUserId: number;
  open: boolean;
  onClose: () => void;
  basePath: string;
}

export function MapModal({ rooms, currentUserId, open, onClose, basePath }: MapModalProps) {
  const navigate = useNavigate();

  const handleRoomClick = (room: ShipRoom) => {
    onClose();
    navigate(`${basePath}/room/${room.id}`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Aluksen kartta"
      description="Napsauta huonetta siirtyäksesi sen hallintaan"
      size="lg"
    >
      <div style={{ aspectRatio: "445 / 410" }}>
        <ShipMap
          rooms={rooms}
          currentUserId={currentUserId}
          onRoomClick={handleRoomClick}
        />
      </div>
      <Text variant="small" className="text-center mt-2 text-text-muted">
        Väriselite näkyy kartan alla
      </Text>
    </Dialog>
  );
}
