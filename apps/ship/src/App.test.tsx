// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { resolveShipBasePath, ShipApp } from "./App";
import type { CabinDetailsResponse, ShipOverviewResponse } from "./api/ship";
import { CabinSheetContent } from "./components/CabinSheetContent";

const {
  mockUseAuth,
  mockUseShipOverview,
  mockUseCabinDetails,
  mockUseCharacterDowntime,
  mockClaimMutate,
  mockUpdateRoomMutate,
  noopMutation,
} = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseShipOverview: vi.fn(),
  mockUseCabinDetails: vi.fn(),
  mockUseCharacterDowntime: vi.fn(),
  mockClaimMutate: vi.fn(),
  mockUpdateRoomMutate: vi.fn(),
  noopMutation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@repo/auth/use-auth", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("@repo/auth/use-require-auth", () => ({
  useRequireAuth: () => ({ isLoggedIn: true, isLoading: false }),
}));

vi.mock("./api/ship", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./api/ship")>();
  return {
    ...actual,
    useShipOverview: mockUseShipOverview,
    useCabinDetails: mockUseCabinDetails,
    useCharacterDowntime: mockUseCharacterDowntime,
    useUpdateCabinInterior: noopMutation,
    useCreatePossession: noopMutation,
    useUpdatePossession: noopMutation,
    useDeletePossession: noopMutation,
    useClaimCabin: () => ({
      mutate: mockClaimMutate,
      isPending: false,
    }),
    useVacateCabin: noopMutation,
    useSaveDowntimeDraft: noopMutation,
    useResolveDowntime: noopMutation,
    useCreateShipClock: noopMutation,
    useUpdateShipClock: noopMutation,
    useDeleteShipClock: noopMutation,
    useUpdateShipConfig: noopMutation,
    useCreateShipRoom: noopMutation,
    useUpdateShipRoom: () => ({
      mutate: mockUpdateRoomMutate,
      isPending: false,
    }),
  };
});

const MOCK_OVERVIEW: ShipOverviewResponse = {
  config: {
    id: 1,
    name: "Aamunkoi",
    callsign: "Runko 150 m",
    theme: "base",
    statusBanner: "Asemien välisessä varjossa, häivejärjestelmät valmiustilassa",
    hullNotes:
      "Syvästä avaruudesta hinattu 150 metrin Suuren sodan aikainen häive- ja miehistöalus.",
    updatedAt: "2026-11-14T10:00:00.000Z",
  },
  rooms: [
    {
      id: 1,
      key: "bridge",
      deckNumber: 1,
      kind: "facility",
      svgZoneId: "d1-bridge",
      name: "Komentosilta",
      subtitle: "Päätepiiri ja sisäinen ääni",
      description: "Komentosillan laaja meripihkaseinänäyttö ja kaarikonsolit.",
      statusLabel: "Toiminnassa",
      statusTone: "normal",
      isLocked: false,
      claimedByCharacterId: null,
      cabinCustomTitle: null,
      cabinDecoration: null,
      gmRoomNotes: null,
      orderIndex: 10,
      occupant: null,
    },
    {
      id: 2,
      key: "cabin-b01",
      deckNumber: 2,
      kind: "cabin",
      svgZoneId: "d2-wing-b",
      name: "Asuinhuone B-01",
      subtitle: "Paapuurin miehistösiipi B",
      description: "Hopeanharmaan keskuskäytävän varrelle sijoitettu asuinhuone.",
      statusLabel: "Toiminnassa",
      statusTone: "normal",
      isLocked: false,
      claimedByCharacterId: 10,
      cabinCustomTitle: "Tähtiverstas",
      cabinDecoration: "### Työpöytä\n\nTyöpöydällä on mittalaitteita.",
      gmRoomNotes: null,
      orderIndex: 1,
      occupant: {
        characterId: 10,
        name: "Kaino Kivi",
        archetype: "Teknikko",
        userId: 5,
        ownerName: "pelaaja1",
        isOwn: true,
      },
    },
    {
      id: 3,
      key: "cabin-b02",
      deckNumber: 2,
      kind: "cabin",
      svgZoneId: "d2-wing-b",
      name: "Asuinhuone B-02",
      subtitle: "Paapuurin miehistösiipi B",
      description: "Vapaa asuinhuone keskikäytävän paapuurin laidalla.",
      statusLabel: "Vapaa",
      statusTone: "normal",
      isLocked: false,
      claimedByCharacterId: null,
      cabinCustomTitle: null,
      cabinDecoration: null,
      gmRoomNotes: null,
      orderIndex: 2,
      occupant: null,
    },
    {
      id: 4,
      key: "sealed-archive",
      deckNumber: 4,
      kind: "sealed",
      svgZoneId: "d4-sealed-archive",
      name: "Sinetöity laiva-arkisto",
      subtitle: "Sinetöidyt nauhaholvit",
      description: "Salaiset arkistotiedot laipion takana.",
      statusLabel: "Sinetöity",
      statusTone: "locked",
      isLocked: true,
      claimedByCharacterId: null,
      cabinCustomTitle: null,
      cabinDecoration: null,
      gmRoomNotes: "Koodiavaimet löytyvät konekannelta.",
      orderIndex: 200,
      occupant: null,
    },
  ],
  clocks: [],
  myCharacters: [
    {
      id: 10,
      name: "Kaino Kivi",
      archetype: "Teknikko",
      activeHarmitCount: 0,
      availableDice: 5,
      claimedRoom: { key: "cabin-b01", name: "Asuinhuone B-01", deckNumber: 2 },
    },
  ],
  crewCharacters: [
    {
      id: 10,
      name: "Kaino Kivi",
      archetype: "Teknikko",
      userId: 5,
      claimedRoom: { key: "cabin-b01", name: "Asuinhuone B-01", deckNumber: 2 },
    },
  ],
  upcomingPreps: [],
};

const MOCK_CABIN_DETAILS: CabinDetailsResponse = {
  character: {
    id: 10,
    userId: 5,
    name: "Kaino Kivi",
    archetype: "Teknikko",
    ownerName: "pelaaja1",
    isOwn: true,
  },
  claimedRoom: MOCK_OVERVIEW.rooms[1],
  possessions: [
    {
      id: 101,
      characterId: 10,
      name: "Vanha messinkivalaisin",
      description: "Lämpimänsävyinen pöytälamppu hyllyllä.",
      gmMechanicalNotes: null,
      isLockedByGm: false,
      orderIndex: 0,
      createdAt: "2026-11-14T10:00:00.000Z",
      updatedAt: "2026-11-14T10:00:00.000Z",
    },
    {
      id: 102,
      characterId: 10,
      name: "Kalibroitu tyhjiömittari",
      description: "Rungon painekalvojen tarkkuusmittari.",
      gmMechanicalNotes: "+1n20 tyhjiökorjaukseen kerran jaksossa",
      isLockedByGm: true,
      orderIndex: 1,
      createdAt: "2026-11-14T10:00:00.000Z",
      updatedAt: "2026-11-14T10:00:00.000Z",
    },
  ],
  canEditInterior: true,
  isGm: false,
};

const MOCK_DOWNTIME = {
  character: {
    id: 10,
    name: "Kaino Kivi",
    archetype: "Teknikko",
    isLiving: true,
    harmit: [],
  },
  availableDice: 5,
  activeHarmit: [],
  pendingSourceEpisode: {
    episodeId: 1,
    title: "Ensimmäinen lento",
    slug: "ensimmainen-lento",
    status: "completed",
    order: 1,
  },
  lockedEpisode: null,
  canDraft: true,
  canRoll: false,
  blockReason: "Luonnos tallennettavissa ennen seuraavan jakson alkua.",
  draft: {
    healedHarmiIndices: [],
    clockDice: {},
    prepDice: 0,
    prepDescription: "",
  },
  eligibleClocks: [],
  resolvedTurns: [],
};

describe("apps/ship canonical 4-deck 2.5D blueprint and HUD", () => {
  let injectedSprite = false;

  beforeAll(() => {
    if (!document.getElementById("custom-icon-sprite")) {
      const sprite = document.createElement("div");
      sprite.id = "custom-icon-sprite";
      document.body.appendChild(sprite);
      injectedSprite = true;
    }
  });

  afterAll(() => {
    if (injectedSprite) {
      document.getElementById("custom-icon-sprite")?.remove();
    }
  });

  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 5,
        email: "pelaaja1@example.test",
        username: "pelaaja1",
        role: "player",
        avatarUrl: null,
      },
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseShipOverview.mockReturnValue({
      data: MOCK_OVERVIEW,
      isLoading: false,
      error: null,
    });
    mockUseCabinDetails.mockReturnValue({
      data: MOCK_CABIN_DETAILS,
      isLoading: false,
    });
    mockUseCharacterDowntime.mockReturnValue({
      data: MOCK_DOWNTIME,
      isLoading: false,
    });
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it("renders 4-deck isometric overview, opens sector popup for wing B, and claims cabin B-02", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    // Direct cockpit ignition replaces modal Alkuruutu splash; top bar shows vessel & character pool
    expect(screen.queryByRole("button", { name: /Alkuruutu/i })).not.toBeInTheDocument();
    expect(screen.getByText("Aamunkoi")).toBeInTheDocument();
    expect(screen.getByText("Kaino Kivi: 5n20")).toBeInTheDocument();
    expect(screen.queryByText(/RUNKO-150M|EGA-16/i)).not.toBeInTheDocument();
    expect(container.querySelector(".ds-console-viewport")).toHaveAttribute(
      "data-ignition",
      "igniting",
    );

    // 4-deck canonical overview SVG is rendered
    expect(
      screen.getByRole("img", { name: "Alus Aamunkoi, 4 kannen isometrinen runkoleikkaus" }),
    ).toBeInTheDocument();

    // Click Wing B on overview -> enters deck 2 cutaway and opens sector popup
    const wingButton = screen.getByRole("button", {
      name: "Siipi B · Kansi 2: 1/2 varattu",
    });
    fireEvent.click(wingButton);

    expect(
      screen.getByRole("img", { name: "Alus Aamunkoi, kannen 2 pohjakuva" }),
    ).toBeInTheDocument();

    const sheet = screen.getByRole("region", { name: "Asuinsiipi B" });
    expect(sheet).toBeInTheDocument();
    expect(screen.getAllByText("B-01").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("B-02").length).toBeGreaterThanOrEqual(2);

    // Claiming B-02 prompts move confirmation since character already occupies B-01
    fireEvent.click(screen.getByRole("button", { name: "Varaa" }));
    expect(screen.getByText("Vaihda hyttiä?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Siirry hyttiin" }));

    expect(mockClaimMutate).toHaveBeenCalledWith({
      key: "cabin-b02",
      characterId: 10,
    });
  });

  it("opens single-deck cutaway where individual cabins and camera controls are interactive", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Kansi 2" }));

    expect(
      screen.getByRole("img", { name: "Alus Aamunkoi, kannen 2 pohjakuva" }),
    ).toBeInTheDocument();

    // Always-visible cabin codes & occupant initials at default 1.0x zoom
    expect(screen.getByText("B-01")).toBeInTheDocument();
    expect(screen.getByText("KK")).toBeInTheDocument();
    expect(screen.getByText("B-02")).toBeInTheDocument();

    const cabinB02 = screen.getByRole("button", { name: "Asuinhuone B-02: Vapaa" });
    fireEvent.click(cabinB02);

    const roomSheet = screen.getByRole("region", { name: "Asuinhuone B-02" });
    expect(roomSheet).toBeInTheDocument();
    expect(
      screen.getByText("Vapaa asuinhuone keskikäytävän paapuurin laidalla."),
    ).toBeInTheDocument();

    // Camera zoom and center controls update transform cleanly
    const zoomInBtn = screen.getByRole("button", { name: "Lähennä karttaa" });
    const zoomOutBtn = screen.getByRole("button", { name: "Loitonna karttaa" });
    const centerBtn = screen.getByRole("button", { name: "Keskitä" });
    expect(screen.queryByRole("button", { name: "Toista keulaluotaus" })).not.toBeInTheDocument();
    fireEvent.click(zoomInBtn);
    const cameraGroup = document.querySelector("svg > g");
    expect(cameraGroup?.getAttribute("transform")).toContain("scale(1.25");
    fireEvent.click(zoomOutBtn);
    fireEvent.click(centerBtn);
    expect(cameraGroup?.getAttribute("transform")).toContain("scale(1.000)");

    // Return to 4-deck overview
    fireEvent.click(screen.getByRole("button", { name: "Kaikki kannet" }));
    expect(
      screen.getByRole("img", { name: "Alus Aamunkoi, 4 kannen isometrinen runkoleikkaus" }),
    ).toBeInTheDocument();
  });

  it("obscures Deck 4 sealed compartments for players and reveals them with GM notes for GM", () => {
    const { rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    const sealedButton = screen.getByRole("button", {
      name: "Sinetöity laiva-arkisto: Sinetöity",
    });
    fireEvent.click(sealedButton);

    expect(screen.getByText("Pääsy estetty")).toBeInTheDocument();
    const obscuredNode = document.querySelector('.obscured-wrapper[aria-hidden="true"]');
    expect(obscuredNode).not.toBeNull();
    expect(obscuredNode).toHaveTextContent("Salaiset arkistotiedot laipion takana.");
    expect(screen.queryByText("Koodiavaimet löytyvät konekannelta.")).not.toBeInTheDocument();

    // Switch to GM user and rerender
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: "pj@example.test",
        username: "pelinjohtaja",
        role: "gm",
        avatarUrl: null,
      },
      isLoggedIn: true,
      isLoading: false,
    });

    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    expect(screen.queryByText("Pääsy estetty")).not.toBeInTheDocument();
    expect(document.querySelector('.obscured-wrapper[aria-hidden="true"]')).toBeNull();
    expect(screen.getByText("Salaiset arkistotiedot laipion takana.")).toBeInTheDocument();
    expect(screen.getByText("Koodiavaimet löytyvät konekannelta.")).toBeInTheDocument();
  });

  it("enforces GM-lock on CabinSheetContent possessions for players vs GM", () => {
    render(
      <MemoryRouter initialEntries={["/hytti/10"]}>
        <Routes>
          <Route
            path="/hytti/:characterId"
            element={<CabinSheetContent overview={MOCK_OVERVIEW} basePath="" isGm={false} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Vanha messinkivalaisin")).toBeInTheDocument();
    expect(screen.getByText("Kalibroitu tyhjiömittari")).toBeInTheDocument();
    expect(screen.getByText("PJ-lukittu ominaisuus")).toBeInTheDocument();
    expect(screen.getByText("+1n20 tyhjiökorjaukseen kerran jaksossa")).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "Muokkaa" })).toHaveLength(1);
    expect(screen.getAllByRole("button", { name: "Poista" })).toHaveLength(1);

    cleanup();

    render(
      <MemoryRouter initialEntries={["/hytti/10"]}>
        <Routes>
          <Route
            path="/hytti/:characterId"
            element={<CabinSheetContent overview={MOCK_OVERVIEW} basePath="" isGm={true} />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: "Muokkaa pelimekaanista huomiota" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lisää pelimekaaninen huomio" })).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Muokkaa" })).toHaveLength(2);
  });

  it("navigates across Alus, Hytti, Väliaika, and Komento via ConsoleDock while keeping schematic mounted", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: "pj@example.test",
        username: "pelinjohtaja",
        role: "gm",
        avatarUrl: null,
      },
      isLoggedIn: true,
      isLoading: false,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Hytti" }));
    expect(screen.getByRole("region", { name: "Tähtiverstas" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Alus Aamunkoi/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Väliaika/i }));
    expect(screen.getByRole("region", { name: "Väliaikatoiminnot" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Alus Aamunkoi/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Komento" }));
    expect(screen.getByRole("region", { name: "Pelinjohtajan konsoli" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Alus Aamunkoi/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Alus" }));
    expect(screen.queryByRole("region", { name: "Pelinjohtajan konsoli" })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Alus Aamunkoi/i })).toBeInTheDocument();
  });

  it("keeps desktop hover readout footer mounted with fixed height across hover transitions", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    const bridgeZone = screen.getByRole("button", { name: /Komentosilta/i });
    fireEvent.click(bridgeZone);

    const footer = screen.getByTestId("ship-canvas-footer");
    expect(footer).toHaveClass("h-11", "shrink-0");
    expect(footer).not.toHaveTextContent(/Komentosilta/i);

    fireEvent.pointerEnter(bridgeZone);
    expect(screen.getByTestId("ship-canvas-footer")).toBe(footer);
    expect(footer).toHaveTextContent(/Komentosilta/i);
    expect(footer).toHaveClass("h-11", "shrink-0");

    fireEvent.pointerLeave(bridgeZone);
    expect(screen.getByTestId("ship-canvas-footer")).toBe(footer);
    expect(footer).not.toHaveTextContent(/Komentosilta/i);
    expect(footer).toHaveClass("h-11", "shrink-0");
  });

  it("auto-resolves /alus basePath under host router so Avaa hytti does not redirect to landing", () => {
    expect(resolveShipBasePath("/alus")).toBe("/alus");
    expect(resolveShipBasePath("/alus/hytti/10")).toBe("/alus");
    expect(resolveShipBasePath("/")).toBe("");
    expect(resolveShipBasePath("/hytti/10")).toBe("");
    expect(resolveShipBasePath("/valiaika")).toBe("");
    expect(resolveShipBasePath("/komentopaate")).toBe("");

    render(
      <MemoryRouter initialEntries={["/alus"]}>
        <Routes>
          <Route path="/" element={<div data-testid="host-landing">ETUSIVU</div>} />
          <Route path="/alus/*" element={<ShipApp />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("host-landing")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Siipi B · Kansi 2: 1/2 varattu" }));
    expect(screen.getByRole("region", { name: "Asuinsiipi B" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Avaa hytti" }));
    expect(screen.queryByTestId("host-landing")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Tähtiverstas" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sulje ikkuna" }));
    expect(screen.queryByTestId("host-landing")).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Tähtiverstas" })).not.toBeInTheDocument();
    expect(screen.queryByRole("region", { name: "Asuinsiipi B" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Väliaika/i }));
    expect(screen.queryByTestId("host-landing")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Väliaikatoiminnot" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hytti" }));
    expect(screen.queryByTestId("host-landing")).not.toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Tähtiverstas" })).toBeInTheDocument();
  });

  it("renders detailed hull, corridor, shaft, and interior schematic layers across decks 1..4", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    for (const [deckNum, expectedRoom] of [
      [1, "bridge"],
      [2, null],
      [3, null],
      [4, "archive"],
    ] as const) {
      fireEvent.click(screen.getByRole("button", { name: `Kansi ${deckNum}` }));
      expect(
        screen.getByRole("img", { name: `Alus Aamunkoi, kannen ${deckNum} pohjakuva` }),
      ).toBeInTheDocument();
      expect(container.querySelector('[data-deck-layer="hull-structure"]')).not.toBeNull();
      expect(container.querySelector('[data-deck-layer="corridors"]')).not.toBeNull();
      expect(container.querySelector('[data-deck-layer="shafts"]')).not.toBeNull();
      if (expectedRoom) {
        expect(container.querySelector(`[data-room-detail="${expectedRoom}"]`)).not.toBeNull();
      }
    }
  });

  it("syncs map colors, custom room names, and dynamic Deck 3 breach state with live room data", () => {
    const initialOverview: ShipOverviewResponse = {
      ...MOCK_OVERVIEW,
      rooms: [
        ...MOCK_OVERVIEW.rooms,
        {
          id: 5,
          key: "breach-port",
          deckNumber: 3,
          kind: "facility",
          svgZoneId: "d3-breach",
          name: "Kylkivaurio",
          subtitle: "Hätälaipioitu paapuurin repeämä",
          description: "Paapuurin kylki on revennyt auki.",
          statusLabel: "Kylkikuori revennyt",
          statusTone: "critical",
          isLocked: false,
          claimedByCharacterId: null,
          cabinCustomTitle: null,
          cabinDecoration: null,
          gmRoomNotes: null,
          orderIndex: 360,
          occupant: null,
        },
        {
          id: 6,
          key: "engine-room",
          deckNumber: 4,
          kind: "facility",
          svgZoneId: "d4-engine",
          name: "Ajo-ohjain",
          subtitle: "Kolvattu ohjainlevy",
          description: "Konehuone käy tasaisesti.",
          statusLabel: "Toiminnassa",
          statusTone: "normal",
          isLocked: false,
          claimedByCharacterId: null,
          cabinCustomTitle: null,
          cabinDecoration: null,
          gmRoomNotes: null,
          orderIndex: 510,
          occupant: null,
        },
      ],
    };

    mockUseShipOverview.mockReturnValue({
      data: initialOverview,
      isLoading: false,
      error: null,
    });

    const { container, rerender } = render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    const breachBtn = screen.getByRole("button", { name: "Kylkivaurio: Kylkikuori revennyt" });
    expect(breachBtn).toHaveTextContent("Kylkivaurio");
    expect(breachBtn.querySelector("polygon")?.getAttribute("fill")).toContain("--theme-primary");

    const engineBtn = screen.getByRole("button", { name: "Ajo-ohjain: Toiminnassa" });
    expect(engineBtn).toHaveTextContent("Ajo-ohjain");
    expect(engineBtn.querySelector("polygon")?.getAttribute("fill")).toContain("--theme-secondary");

    fireEvent.click(screen.getByRole("button", { name: "Kansi 3" }));
    expect(container.querySelector('[data-room-detail="breach"]')).not.toBeNull();
    expect(container.querySelector('[data-hull-repair="port-patch"]')).toBeNull();

    const repairedOverview: ShipOverviewResponse = {
      ...initialOverview,
      rooms: initialOverview.rooms.map((r) =>
        r.key === "breach-port"
          ? {
              ...r,
              name: "Paikattu kylkilaipio",
              statusTone: "normal",
              statusLabel: "Hitsattu umpeen",
            }
          : r,
      ),
    };

    mockUseShipOverview.mockReturnValue({
      data: repairedOverview,
      isLoading: false,
      error: null,
    });

    rerender(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    const repairedBtn = screen.getByRole("button", {
      name: "Paikattu kylkilaipio: Hitsattu umpeen",
    });
    expect(repairedBtn).toHaveTextContent("Paikattu kylkilaipio");
    expect(repairedBtn.querySelector("polygon")?.getAttribute("fill")).toContain(
      "--theme-secondary",
    );
    expect(repairedBtn.querySelector("polygon")?.getAttribute("fill")).not.toContain(
      "--theme-primary",
    );
    expect(container.querySelector('[data-room-detail="breach"]')).toBeNull();
    expect(container.querySelector('[data-room-detail="breach-repaired"]')).not.toBeNull();
    expect(container.querySelector('[data-hull-repair="port-patch"]')).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Kaikki kannet" }));
    const overviewRepairedBtn = screen.getByRole("button", {
      name: "Paikattu kylkilaipio: Hitsattu umpeen",
    });
    expect(overviewRepairedBtn).toHaveTextContent("Paikattu kylkilai…");
  });

  it("allows GM to edit room name and statusTone inline in RoomInspectorContent", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 1,
        email: "pj@example.test",
        username: "pelinjohtaja",
        role: "gm",
        avatarUrl: null,
      },
      isLoggedIn: true,
      isLoading: false,
    });
    mockUseShipOverview.mockReturnValue({
      data: {
        ...MOCK_OVERVIEW,
        rooms: [
          ...MOCK_OVERVIEW.rooms,
          {
            id: 5,
            key: "breach-port",
            deckNumber: 3,
            kind: "facility",
            svgZoneId: "d3-breach",
            name: "Kylkivaurio",
            subtitle: "Hätälaipioitu paapuurin repeämä",
            description: "Paapuurin kylki on revennyt auki.",
            statusLabel: "Kylkikuori revennyt",
            statusTone: "critical",
            isLocked: false,
            claimedByCharacterId: null,
            cabinCustomTitle: null,
            cabinDecoration: null,
            gmRoomNotes: null,
            orderIndex: 360,
            occupant: null,
          },
        ],
      },
      isLoading: false,
      error: null,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <ShipApp />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Kylkivaurio: Kylkikuori revennyt" }));
    fireEvent.click(screen.getByRole("button", { name: "Muokkaa osastoa" }));

    fireEvent.change(screen.getByLabelText("Osaston nimi"), {
      target: { value: "Paikattu kylkilaipio" },
    });
    fireEvent.change(screen.getByLabelText("Tilaväri"), {
      target: { value: "normal" },
    });
    fireEvent.change(screen.getByLabelText("Tilateksti"), {
      target: { value: "Tiivistetty" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Tallenna osasto" }));

    expect(mockUpdateRoomMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        key: "breach-port",
        name: "Paikattu kylkilaipio",
        statusTone: "normal",
        statusLabel: "Tiivistetty",
      }),
      expect.any(Object),
    );
  });
});
