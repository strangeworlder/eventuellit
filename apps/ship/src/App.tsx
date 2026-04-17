import { useAuth } from "@repo/auth/use-auth";
import { Button } from "@repo/ui/components/Button";
import { Grid } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Text } from "@repo/ui/components/Text";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import type { ShipRoom } from "./api/ship";
import { useShipData } from "./api/ship";
import { RoomView } from "./components/RoomView";
import { ShipMap } from "./components/ShipMap";

const queryClient = new QueryClient();

// ── Ship map overview page ────────────────────────────────────────────────────

function ShipMapPage({ basePath }: { basePath: string }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ship, isLoading, isError } = useShipData();

  const handleRoomClick = (room: ShipRoom) => navigate(`${basePath}/room/${room.id}`);

  if (isLoading) {
    return <LoadingState message="Ladataan aluksen karttaa..." size="large" className="mt-8" />;
  }

  if (isError || !ship) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 gap-3 font-sans">
        <Text variant="small" className="text-text-muted">
          Aluksen tietoja ei voitu ladata.
        </Text>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          Yritä uudelleen
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-[var(--theme-text)] p-4 desktop:p-6">
      {/* Header */}
      <div className="mb-4">
        <p className="font-bold text-xl text-[var(--theme-text)] font-heading">{ship.name}</p>
        <Text variant="small" className="mt-1 text-text-muted">
          {ship.rooms.length} huonetta · Napsauta huonetta hallinnoiaksesi sitä
        </Text>
      </div>

      {/* Blueprint map */}
      <div
        className="rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-surface-tint)] mb-6 overflow-hidden"
        style={{ maxWidth: "600px", aspectRatio: "445 / 410" }}
      >
        <ShipMap
          rooms={ship.rooms}
          currentUserId={user?.id ?? 0}
          onRoomClick={handleRoomClick}
        />
      </div>

      {/* Room index grid */}
      <Grid responsive={{ base: 2, tablet: 3, desktop: 4 }} gap={2} className="max-w-2xl">
        {ship.rooms.map((room) => (
          <Button
            key={room.id}
            variant="ghost-subtle"
            size="nav"
            justify="start"
            onClick={() => handleRoomClick(room)}
            className="border border-[var(--theme-border-soft)] rounded-sm"
          >
            <div className="flex flex-col items-start gap-0.5 min-w-0">
              <span className="font-semibold truncate w-full">{room.name}</span>
              <span className="text-text-muted text-[length:var(--font-size-xs)] truncate w-full">
                {room.function ?? "—"}
              </span>
            </div>
          </Button>
        ))}
      </Grid>
    </div>
  );
}

// ── Routes ────────────────────────────────────────────────────────────────────

function AppRoutes() {
  const { pathname } = useLocation();
  // Derive basePath: strip trailing /room/... segments to find the MFE mount root.
  // When mounted at /ship/* in the host, pathname is e.g. /ship or /ship/room/3.
  const basePath = pathname.replace(/\/room\/.*$/, "").replace(/\/$/, "") || "/ship";

  return (
    <Routes>
      <Route index element={<ShipMapPage basePath={basePath} />} />
      <Route path="room/:id" element={<RoomView basePath={basePath} />} />
      <Route path="*" element={<Navigate to={basePath} replace />} />
    </Routes>
  );
}

// ── Root export ───────────────────────────────────────────────────────────────

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  );
}

export default App;
