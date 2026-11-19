import { useAuth } from "@repo/auth/use-auth";
import { useRequireAuth } from "@repo/auth/use-require-auth";
import {
  ConsoleDock,
  ConsoleDockItem,
  ConsolePill,
  ConsoleSheet,
  ConsoleViewport,
  LoadingState,
  NoticePanel,
  Text,
} from "@repo/ui";
import { PageTheme } from "@repo/ui/components/Theme";
import { useCallback, useMemo, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { resolveShipTheme, useShipOverview } from "./api/ship";
import { CabinSheetContent } from "./components/CabinSheetContent";
import { DowntimeSheetContent } from "./components/DowntimeSheetContent";
import { GmCommandSheetContent } from "./components/GmCommandSheetContent";
import { IsometricShipCanvas, type ShipSelectionTarget } from "./components/IsometricShipCanvas";
import { RoomInspectorContent } from "./components/RoomInspectorContent";
import { SectorPopupContent } from "./components/SectorPopupContent";
import { CABIN_WING_MAP, DECK_SPECS, formatCabinCode } from "./components/ship-zones";

export interface ShipAppProps {
  basePath?: string;
}

const SHIP_SUBROUTES = new Set(["hytti", "valiaika", "komentopaate"]);

export function resolveShipBasePath(pathname: string, explicitBasePath?: string): string {
  if (explicitBasePath !== undefined) {
    return explicitBasePath.replace(/\/$/, "");
  }
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0 || SHIP_SUBROUTES.has(segments[0])) {
    return "";
  }
  return `/${segments[0]}`;
}

export function ShipApp({ basePath }: ShipAppProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const normalizedBase = useMemo(
    () => resolveShipBasePath(location.pathname, basePath),
    [basePath, location.pathname],
  );

  useRequireAuth();
  const { user, isLoading: authLoading } = useAuth();
  const { data: overview, isLoading: overviewLoading, error } = useShipOverview();

  const [focusedDeck, setFocusedDeck] = useState<number | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<ShipSelectionTarget | null>(null);
  const [lastWingId, setLastWingId] = useState<string | null>(null);

  const relativePath = useMemo(() => {
    if (!normalizedBase) return location.pathname || "/";
    if (location.pathname.startsWith(normalizedBase)) {
      const sliced = location.pathname.slice(normalizedBase.length);
      return sliced || "/";
    }
    return location.pathname || "/";
  }, [location.pathname, normalizedBase]);

  const isCabinRoute = relativePath.startsWith("/hytti");
  const isDowntimeRoute = relativePath.startsWith("/valiaika");
  const isGmRoute = relativePath.startsWith("/komentopaate");
  const isIndexRoute = !isCabinRoute && !isDowntimeRoute && !isGmRoute;

  const isGm = user?.role === "gm";
  const shipTheme = resolveShipTheme(overview?.config.theme);

  const defaultCabinCharacterId = useMemo(() => {
    if (!overview) return null;
    const ownWithCabin = overview.myCharacters.find((c) => Boolean(c.claimedRoom));
    if (ownWithCabin) return ownWithCabin.id;
    if (overview.myCharacters[0]) return overview.myCharacters[0].id;
    const crewWithCabin = overview.crewCharacters.find((c) => Boolean(c.claimedRoom));
    return crewWithCabin?.id ?? overview.crewCharacters[0]?.id ?? null;
  }, [overview]);

  const activeCabinWingId = useMemo(() => {
    if (!overview || !isCabinRoute) return null;
    const match = /^\/hytti\/(\d+)/.exec(relativePath);
    const charId = match?.[1] ? Number(match[1]) : defaultCabinCharacterId;
    if (!charId) return null;
    const claimed = overview.rooms.find(
      (r) => r.kind === "cabin" && r.claimedByCharacterId === charId,
    );
    return claimed?.svgZoneId ?? null;
  }, [defaultCabinCharacterId, isCabinRoute, overview, relativePath]);

  const handleSelectShipTarget = useCallback(
    (target: ShipSelectionTarget) => {
      if (target.type === "wing") {
        setLastWingId(target.wingId);
        const wing = CABIN_WING_MAP[target.wingId];
        if (wing) {
          setFocusedDeck(wing.deckNumber);
        }
      } else {
        setLastWingId(null);
      }
      setSelectedTarget(target);
      if (!isIndexRoute) {
        navigate(normalizedBase || "/");
      }
    },
    [isIndexRoute, navigate, normalizedBase],
  );

  const handleCloseRouteSheet = useCallback(() => {
    setSelectedTarget(null);
    navigate(normalizedBase || "/");
  }, [navigate, normalizedBase]);

  if (authLoading || overviewLoading) {
    return (
      <ConsoleViewport
        stage={
          <div className="flex h-full items-center justify-center p-4">
            <LoadingState message="Alustetaan alusyhteyttä..." size="large" layout="padded" />
          </div>
        }
      />
    );
  }

  if (error || !overview) {
    return (
      <ConsoleViewport
        stage={
          <div className="flex h-full items-center justify-center p-4">
            <NoticePanel variant="error" title="Alusyhteys katkesi">
              <Text>Aluksen tietoja ei saatu ladattua tällä hetkellä.</Text>
            </NoticePanel>
          </div>
        }
      />
    );
  }

  const liveSelectedRoom =
    selectedTarget?.type === "room"
      ? (overview.rooms.find((r) => r.key === selectedTarget.room.key) ?? selectedTarget.room)
      : null;

  const selectedWing =
    selectedTarget?.type === "wing" ? (CABIN_WING_MAP[selectedTarget.wingId] ?? null) : null;

  const topBar = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="ds-console-pod min-w-0">
        <div className="px-1.5 py-1 flex flex-wrap items-center gap-2 min-w-0">
          <ConsolePill tone="dawn" icon="anchor">
            Aamunkoi
          </ConsolePill>

          <span className="hidden tablet:block font-sans text-xs tablet:text-sm text-text-muted truncate max-w-md pr-1">
            {overview.config.statusBanner}
          </span>
        </div>
      </div>

      {overview.myCharacters.length > 0 && (
        <div className="ds-console-pod">
          <div className="px-1.5 py-1 flex flex-wrap items-center gap-1.5">
            {overview.myCharacters.map((char) => (
              <ConsolePill
                key={char.id}
                tone="accent"
                icon="dice5"
                onClick={() => navigate(`${normalizedBase}/valiaika`)}
              >
                {`${char.name}: ${char.availableDice}n20`}
              </ConsolePill>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const deckFilterBar = (
    <div className="flex flex-wrap items-center justify-center desktop:justify-start gap-1.5">
      <ConsolePill active={focusedDeck === null} onClick={() => setFocusedDeck(null)}>
        Kaikki
      </ConsolePill>
      {DECK_SPECS.map((deck) => (
        <ConsolePill
          key={deck.deckNumber}
          active={focusedDeck === deck.deckNumber}
          onClick={() =>
            setFocusedDeck((prev) => (prev === deck.deckNumber ? null : deck.deckNumber))
          }
        >
          {deck.shortTab}
        </ConsolePill>
      ))}
    </div>
  );

  const dock = (
    <ConsoleDock
      utilityBar={isIndexRoute ? deckFilterBar : undefined}
      ariaLabel="Aluksen navigointi"
    >
      <ConsoleDockItem
        icon="compass"
        label="Alus"
        active={isIndexRoute}
        onClick={handleCloseRouteSheet}
      />
      <ConsoleDockItem
        icon="home"
        label="Hytti"
        active={isCabinRoute}
        onClick={() =>
          navigate(
            `${normalizedBase}/hytti${defaultCabinCharacterId ? `/${defaultCabinCharacterId}` : ""}`,
          )
        }
      />
      <ConsoleDockItem
        icon="dice5"
        label="Väliaika"
        active={isDowntimeRoute}
        badge={
          overview.myCharacters[0] ? `${overview.myCharacters[0].availableDice}n20` : undefined
        }
        onClick={() => navigate(`${normalizedBase}/valiaika`)}
      />
      {isGm && (
        <ConsoleDockItem
          icon="settings"
          label="Komento"
          active={isGmRoute}
          onClick={() => navigate(`${normalizedBase}/komentopaate`)}
        />
      )}
    </ConsoleDock>
  );

  const backToWingHandler =
    liveSelectedRoom?.kind === "cabin" &&
    (lastWingId || liveSelectedRoom.svgZoneId) &&
    CABIN_WING_MAP[lastWingId ?? liveSelectedRoom.svgZoneId ?? ""]
      ? () => {
          const wingId = lastWingId ?? liveSelectedRoom.svgZoneId;
          if (wingId) {
            setSelectedTarget({ type: "wing", wingId });
          }
        }
      : undefined;

  const indexOverlay = selectedWing ? (
    <ConsoleSheet
      headerCode={`Kansi ${selectedWing.deckNumber}`}
      title={`Asuinsiipi ${selectedWing.code}`}
      subtitle={selectedWing.subtitle}
      defaultSnap="half"
      onClose={() => setSelectedTarget(null)}
    >
      <SectorPopupContent
        wing={selectedWing}
        overview={overview}
        basePath={normalizedBase}
        isGm={isGm}
        onSelectCabinRoom={(room) => {
          setLastWingId(selectedWing.wingId);
          setSelectedTarget({ type: "room", room });
        }}
      />
    </ConsoleSheet>
  ) : liveSelectedRoom ? (
    <ConsoleSheet
      headerCode={
        liveSelectedRoom.kind === "cabin"
          ? `Kansi ${liveSelectedRoom.deckNumber} · Hytti ${formatCabinCode(liveSelectedRoom.key)}`
          : `Kansi ${liveSelectedRoom.deckNumber}`
      }
      title={liveSelectedRoom.cabinCustomTitle || liveSelectedRoom.name}
      subtitle={liveSelectedRoom.subtitle ?? undefined}
      defaultSnap="half"
      onClose={() => setSelectedTarget(null)}
    >
      <RoomInspectorContent
        room={liveSelectedRoom}
        overview={overview}
        basePath={normalizedBase}
        isGm={isGm}
        focusedDeck={focusedDeck}
        onFocusDeck={setFocusedDeck}
        onBackToWing={backToWingHandler}
      />
    </ConsoleSheet>
  ) : null;

  const overlay = (
    <Routes>
      <Route index element={indexOverlay} />
      <Route
        path="hytti"
        element={
          <CabinSheetContent
            overview={overview}
            basePath={normalizedBase}
            isGm={isGm}
            onClose={handleCloseRouteSheet}
          />
        }
      />
      <Route
        path="hytti/:characterId"
        element={
          <CabinSheetContent
            overview={overview}
            basePath={normalizedBase}
            isGm={isGm}
            onClose={handleCloseRouteSheet}
          />
        }
      />
      <Route
        path="valiaika"
        element={
          <DowntimeSheetContent
            overview={overview}
            basePath={normalizedBase}
            isGm={isGm}
            onClose={handleCloseRouteSheet}
          />
        }
      />
      <Route
        path="komentopaate"
        element={
          <GmCommandSheetContent
            overview={overview}
            basePath={normalizedBase}
            isGm={isGm}
            onClose={handleCloseRouteSheet}
          />
        }
      />
      <Route path="*" element={<Navigate to={normalizedBase || "/"} replace />} />
    </Routes>
  );

  return (
    <div data-theme={shipTheme} className="w-full h-[100dvh] overflow-hidden">
      <PageTheme theme={shipTheme} />
      <ConsoleViewport
        theme={shipTheme}
        stageMode="canvas"
        igniteOnMount
        topBar={topBar}
        stage={
          <IsometricShipCanvas
            overview={overview}
            focusedDeck={focusedDeck}
            selectedTarget={isIndexRoute ? selectedTarget : null}
            highlightedWingId={activeCabinWingId}
            onSelectTarget={handleSelectShipTarget}
            onFocusDeck={setFocusedDeck}
          />
        }
        overlay={overlay}
        dock={dock}
      />
    </div>
  );
}

export default ShipApp;
