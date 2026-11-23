// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { CharacterPrivateNote } from "./api/private-notes";
import { CharacterPrivateNotesTab } from "./CharacterPrivateNotesTab";
import { CharacterSheet } from "./CharacterSheet";

const {
  mockUseAuth,
  mockCreateMutate,
  mockUpdateMutate,
  mockDeleteMutate,
  mockMigrateMutate,
  mockUseCharacterPrivateNotes,
} = vi.hoisted(() => ({
  mockUseAuth: vi.fn(),
  mockCreateMutate: vi.fn(),
  mockUpdateMutate: vi.fn(),
  mockDeleteMutate: vi.fn(),
  mockMigrateMutate: vi.fn(),
  mockUseCharacterPrivateNotes: vi.fn(),
}));

vi.mock("@repo/auth/use-auth", () => ({
  useAuth: mockUseAuth,
}));

vi.mock("./api/private-notes", () => ({
  useCharacterPrivateNotes: mockUseCharacterPrivateNotes,
  useCreatePrivateNote: () => ({
    mutate: mockCreateMutate,
    isPending: false,
  }),
  useUpdatePrivateNote: () => ({
    mutate: mockUpdateMutate,
    isPending: false,
  }),
  useDeletePrivateNote: () => ({
    mutate: mockDeleteMutate,
    isPending: false,
  }),
  useMigratePublicNotes: () => ({
    mutate: mockMigrateMutate,
    isPending: false,
  }),
}));

const SAMPLE_NOTES: CharacterPrivateNote[] = [
  {
    id: 1,
    characterId: 10,
    episodeId: 2,
    episodeTitle: "Ohjainlevy",
    title: "Salainen koodi",
    content: "Koodi oveen on **4419**.",
    isPinned: true,
    createdAt: "2026-11-20T10:00:00.000Z",
    updatedAt: "2026-11-20T10:00:00.000Z",
  },
  {
    id: 2,
    characterId: 10,
    episodeId: null,
    episodeTitle: null,
    title: null,
    content: "Epäilen navigaattoria.",
    isPinned: false,
    createdAt: "2026-11-19T10:00:00.000Z",
    updatedAt: "2026-11-19T10:00:00.000Z",
  },
];

const MOCK_CHARACTER = {
  id: 10,
  userId: 5,
  name: "Kaino Kivi",
  archetype: "Ekspertti",
  episodes: [{ id: 2, title: "Ohjainlevy", status: "active" }],
  sex: "none",
  motivation: "Etsiä totuus.",
  notes: "Tunnettu mekaanikko telakalta.",
  keho: 8,
  currentKeho: 8,
  mieli: 8,
  currentMieli: 8,
  tera: 8,
  currentTera: 8,
  sisuDice: [{ id: "s1", faces: 6 }],
  removedSisuIds: [],
  harmit: [],
  skills: [{ name: "Mekaniikka", isCustom: false }],
  ownerName: "pelaaja1",
  fysiikka: 0,
  nopeus: 0,
  ymmarrys: 0,
  persoona: 0,
  nakemys: 0,
  napparyys: 0,
  nicknames: [],
};

function renderWithProviders(ui: React.ReactElement, preloadedCharacter = MOCK_CHARACTER) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  queryClient.setQueryData(["character", preloadedCharacter.id], preloadedCharacter);
  queryClient.setQueryData(["character-snapshots", preloadedCharacter.id], []);
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("Character private notes UI and visibility boundaries", () => {
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
    mockCreateMutate.mockReset();
    mockUpdateMutate.mockReset();
    mockDeleteMutate.mockReset();
    mockMigrateMutate.mockReset();
    mockUseCharacterPrivateNotes.mockReturnValue({
      data: SAMPLE_NOTES,
      isLoading: false,
      isError: false,
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("communicates GM visibility to the owner and supports creating and filtering notes", () => {
    renderWithProviders(
      <CharacterPrivateNotesTab
        characterId={10}
        isOwner={true}
        episodes={[{ id: 2, title: "Ohjainlevy" }]}
        notes={SAMPLE_NOTES}
        isLoading={false}
        isError={false}
      />,
    );

    expect(
      screen.getByText(/Yksityiset muistiinpanot näkyvät vain sinulle ja pelinjohtajalle/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Salainen koodi")).toBeInTheDocument();
    expect(screen.getByText("Epäilen navigaattoria.")).toBeInTheDocument();

    // Filter to general notes only
    fireEvent.click(screen.getByRole("button", { name: "Yleiset" }));
    expect(screen.queryByText("Salainen koodi")).not.toBeInTheDocument();
    expect(screen.getByText("Epäilen navigaattoria.")).toBeInTheDocument();

    // Open composer and submit a new note
    fireEvent.click(screen.getByRole("button", { name: /Uusi muistiinpano/i }));
    fireEvent.change(screen.getByPlaceholderText(/Kontaktit, epäilykset tai koodit/i), {
      target: { value: "Uusi johtolanka" },
    });
    fireEvent.change(
      screen.getByPlaceholderText(/Kirjoita johtolankoja, kontakteja tai hahmosi omia ajatuksia/i),
      {
        target: { value: "Telakan portti aukeaa yövuorossa." },
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "Tallenna muistiinpano" }));

    expect(mockCreateMutate).toHaveBeenCalledWith(
      {
        title: "Uusi johtolanka",
        content: "Telakan portti aukeaa yövuorossa.",
        episodeId: null,
        isPinned: false,
      },
      expect.any(Object),
    );
  });

  it("renders read-only mode for GM viewing another player's private notes without edit controls", () => {
    renderWithProviders(
      <CharacterPrivateNotesTab
        characterId={10}
        isOwner={false}
        episodes={[{ id: 2, title: "Ohjainlevy" }]}
        notes={SAMPLE_NOTES}
        isLoading={false}
        isError={false}
      />,
    );

    expect(screen.getByText("Pelinjohtajan lukunäkymä")).toBeInTheDocument();
    expect(screen.getByText("Salainen koodi")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Uusi muistiinpano/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Muokkaa" })).not.toBeInTheDocument();
  });

  it("hides private notes tab and migration action from other players on CharacterSheet", () => {
    mockUseAuth.mockReturnValue({
      user: {
        id: 99,
        email: "toinen@example.test",
        username: "toinen",
        role: "player",
        avatarUrl: null,
      },
      isLoggedIn: true,
      isLoading: false,
    });

    renderWithProviders(<CharacterSheet characterId={10} basePath="/generator" onBack={vi.fn()} />);

    expect(screen.getByText("Julkinen kuvaus")).toBeInTheDocument();
    expect(screen.getByText("Tunnettu mekaanikko telakalta.")).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /Yksityiset muistiinpanot/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Siirrä yksityiseksi muistiinpanoksi/i }),
    ).not.toBeInTheDocument();
    expect(mockUseCharacterPrivateNotes).toHaveBeenCalledWith(10, false);
  });

  it("shows private notes tab with count and migration tool button to the character owner", () => {
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

    renderWithProviders(<CharacterSheet characterId={10} basePath="/generator" onBack={vi.fn()} />);

    expect(mockUseCharacterPrivateNotes).toHaveBeenCalledWith(10, true);
    expect(
      screen.getByRole("tab", { name: /Yksityiset muistiinpanot \(2\)/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Siirrä yksityiseksi muistiinpanoksi/i }),
    ).toBeInTheDocument();
  });
});
