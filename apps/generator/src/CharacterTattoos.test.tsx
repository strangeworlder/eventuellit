// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CharacterSheet } from "./CharacterSheet";
import { CharacterTattoosCard } from "./CharacterTattoosCard";

const { mockUseAuth, mockUseCharacterPrivateNotes, mockMigrateMutate } = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockUseCharacterPrivateNotes: vi.fn(),
  mockMigrateMutate: vi.fn(),
}));

vi.mock("@repo/auth/use-auth", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("./api/private-notes", () => ({
  useCharacterPrivateNotes: mockUseCharacterPrivateNotes,
  useCreatePrivateNote: () => ({ mutate: vi.fn(), isPending: false }),
  useUpdatePrivateNote: () => ({ mutate: vi.fn(), isPending: false }),
  useDeletePrivateNote: () => ({ mutate: vi.fn(), isPending: false }),
  useMigratePublicNotes: () => ({ mutate: mockMigrateMutate, isPending: false }),
}));

const BASE_CHARACTER = {
  id: 33,
  userId: 5,
  name: "Holti",
  archetype: "Ekspertti",
  episodes: [{ id: 2, title: "Ase", status: "active" }],
  sex: "male",
  motivation: "Rankaisemassa determinismiä.",
  notes: "Kokemuspuolueen puheenjohtaja.",
  keho: 8,
  currentKeho: 8,
  mieli: 8,
  currentMieli: 8,
  tera: 8,
  currentTera: 8,
  sisuDice: [{ id: "s1", faces: 6 }],
  removedSisuIds: [],
  harmit: [],
  skills: [{ name: "Automaatiokoodari", isCustom: false }],
  ownerName: "pelaaja1",
  fysiikka: 0,
  nopeus: 0,
  ymmarrys: 0,
  persoona: 0,
  nakemys: 0,
  napparyys: 0,
  nicknames: [],
  monkAdvancementsAllowed: 2,
  monkAdvancementsUsed: 0,
  monkPowers: [],
  tattoos: [
    {
      slot: 1,
      title: "Kirkkaansininen kalatatuointi",
      description: "Oikeassa käsivarressa (Painajaisesta).",
    },
  ],
};

function renderSheet(character = BASE_CHARACTER) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["character", character.id], character);
  queryClient.setQueryData(["character-snapshots", character.id], []);
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CharacterSheet characterId={character.id} basePath="/generator" onBack={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("CharacterTattoosCard and CharacterSheet integration", () => {
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
    mockUseAuth.mockReset();
    mockUseCharacterPrivateNotes.mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it("renders nothing when monkAdvancementsAllowed is 0 and no tattoos exist", () => {
    const { container } = render(
      <CharacterTattoosCard
        monkAdvancementsAllowed={0}
        tattoos={[]}
        canEdit={true}
        onUpdate={vi.fn()}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("shows fixed numbered slots including empty ones for read-only viewers without edit controls", () => {
    render(
      <CharacterTattoosCard
        monkAdvancementsAllowed={2}
        tattoos={[
          {
            slot: 1,
            title: "Sininen kalatatuointi",
            description: "Käsivarressa",
          },
        ]}
        canEdit={false}
        onUpdate={vi.fn()}
      />,
    );

    expect(screen.getByText("Tatuoinnit")).toBeInTheDocument();
    expect(screen.getByText("1 / 2 kuvattu")).toBeInTheDocument();
    expect(screen.getByText("Tatuointi 1")).toBeInTheDocument();
    expect(screen.getByText("Sininen kalatatuointi")).toBeInTheDocument();
    expect(screen.getByText("Käsivarressa")).toBeInTheDocument();
    expect(screen.getByText("Tatuointi 2")).toBeInTheDocument();
    expect(screen.getByText("Ei vielä kuvailtu.")).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: /muokkaa/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /kuvaile/i })).not.toBeInTheDocument();
  });

  it("lets owner describe an empty slot, edit an existing slot, and clear a slot", () => {
    const onUpdate = vi.fn();

    render(
      <CharacterTattoosCard
        monkAdvancementsAllowed={2}
        tattoos={[{ slot: 1, title: "Sininen kala" }]}
        canEdit={true}
        onUpdate={onUpdate}
      />,
    );

    // Describe slot 2
    fireEvent.click(screen.getByRole("button", { name: "Kuvaile tatuointi 2" }));
    const saveButton = screen.getByRole("button", { name: "Tallenna" });
    expect(saveButton).toBeDisabled();

    fireEvent.change(screen.getByPlaceholderText("Esim. Sininen kalatatuointi"), {
      target: { value: "  Laiskiaistatuointi  " },
    });
    fireEvent.change(
      screen.getByPlaceholderText("Sijainti kehossa, ulkonäkö, mistä jaksosta saatu..."),
      { target: { value: "  Oikeassa käsivarressa  " } },
    );
    expect(saveButton).toBeEnabled();
    fireEvent.click(saveButton);

    expect(onUpdate).toHaveBeenLastCalledWith([
      { slot: 1, title: "Sininen kala" },
      { slot: 2, title: "Laiskiaistatuointi", description: "Oikeassa käsivarressa" },
    ]);

    // Edit & clear slot 1
    fireEvent.click(screen.getByRole("button", { name: "Muokkaa tatuointia 1" }));
    fireEvent.click(screen.getByRole("button", { name: "Tyhjennä" }));

    expect(onUpdate).toHaveBeenLastCalledWith([]);
  });

  it("renders Tatuoinnit between Perustiedot and Voimat on CharacterSheet and saves via PATCH", async () => {
    mockUseAuth.mockReturnValue({
      user: { id: 5, username: "pelaaja1", role: "player" },
    });

    const updatedCharacter = {
      ...BASE_CHARACTER,
      tattoos: [
        ...BASE_CHARACTER.tattoos,
        { slot: 2, title: "Kirkkaansininen laiskiaistatuointi" },
      ],
    };

    const fetchMock = vi.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.endsWith("/snapshots")) {
        return { ok: true, json: async () => [] } as Response;
      }
      return { ok: true, json: async () => updatedCharacter } as Response;
    });

    renderSheet(BASE_CHARACTER);

    const perustiedot = screen.getByText("Perustiedot");
    const tatuoinnit = screen.getByText("Tatuoinnit");
    const voimat = screen.getByText("Voimat");

    expect(
      perustiedot.compareDocumentPosition(tatuoinnit) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(
      tatuoinnit.compareDocumentPosition(voimat) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Kuvaile tatuointi 2" }));
    fireEvent.change(screen.getByPlaceholderText("Esim. Sininen kalatatuointi"), {
      target: { value: "Kirkkaansininen laiskiaistatuointi" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Tallenna" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringMatching(/\/characters\/33$/),
        expect.objectContaining({
          method: "PATCH",
          body: JSON.stringify({
            tattoos: [
              {
                slot: 1,
                title: "Kirkkaansininen kalatatuointi",
                description: "Oikeassa käsivarressa (Painajaisesta).",
              },
              {
                slot: 2,
                title: "Kirkkaansininen laiskiaistatuointi",
              },
            ],
          }),
        }),
      );
    });
  });
});
