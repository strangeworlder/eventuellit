// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ANCHOR_CARDS, getAnchorById } from "../data/anchors";
import { AnchorSelector } from "./AnchorSelector";

const defaultFallbackAnchor = {
  id: "atu-0",
  name: "Kuilu",
  internalRef: "The Fool",
  arcana: "major" as const,
  polarityA: { title: "Syöksy", description: "Pudotus ilman laskuvarjoa." },
  polarityB: { title: "Umpikuja", description: "Pohjakosketus ja pysähdys." },
  description: "Askel suoraan tyhjyyteen.",
};

const selectedOpt = ANCHOR_CARDS[0] ?? defaultFallbackAnchor;
const testOptions = ANCHOR_CARDS.slice(0, 5);

describe("AnchorSelector", () => {
  it("renders drawn anchor options and the permanence notice", () => {
    render(<AnchorSelector options={testOptions} />);

    expect(screen.getByText("Pysyvä pelaajakohtainen valinta")).toBeInTheDocument();
    expect(screen.getByText(/Ankkuri sidotaan käyttäjätiliisi/i)).toBeInTheDocument();

    for (const opt of testOptions) {
      expect(screen.getByRole("button", { name: new RegExp(opt.name, "i") })).toBeInTheDocument();
    }

    expect(screen.getByRole("button", { name: /Arvo uudet 5/i })).toBeInTheDocument();
  });

  it("fires onSelectAnchor when an option button is clicked", () => {
    const onSelectAnchor = vi.fn();
    render(<AnchorSelector options={testOptions} onSelectAnchor={onSelectAnchor} />);

    const firstBtn = screen.getByRole("button", { name: new RegExp(selectedOpt.name, "i") });
    fireEvent.click(firstBtn);

    expect(onSelectAnchor).toHaveBeenCalledWith(selectedOpt.id);
  });

  it("progressively discloses description and dual polarities when an anchor is selected", () => {
    render(
      <AnchorSelector
        options={testOptions}
        selectedAnchorId={selectedOpt.id}
        onSelectAnchor={vi.fn()}
      />,
    );

    // Selected details header
    expect(screen.getByText("(Ankkuritaito)")).toBeInTheDocument();
    expect(screen.getByText(selectedOpt.description)).toBeInTheDocument();

    // Side-by-side polarities
    expect(screen.getByText("Polariteetti A")).toBeInTheDocument();
    expect(screen.getByText(selectedOpt.polarityA.title)).toBeInTheDocument();
    expect(screen.getByText(selectedOpt.polarityA.description)).toBeInTheDocument();

    expect(screen.getByText("Polariteetti B")).toBeInTheDocument();
    expect(screen.getByText(selectedOpt.polarityB.title)).toBeInTheDocument();
    expect(screen.getByText(selectedOpt.polarityB.description)).toBeInTheDocument();
  });

  it("deselects when clicking the 'Poista valinta' button or the selected button again", () => {
    const onSelectAnchor = vi.fn();
    const { rerender } = render(
      <AnchorSelector
        options={testOptions}
        selectedAnchorId={selectedOpt.id}
        onSelectAnchor={onSelectAnchor}
      />,
    );

    const removeBtn = screen.getByRole("button", { name: /Poista valinta/i });
    fireEvent.click(removeBtn);
    expect(onSelectAnchor).toHaveBeenCalledWith(null);

    // Clicking the already selected option button also deselects
    onSelectAnchor.mockClear();
    rerender(
      <AnchorSelector
        options={testOptions}
        selectedAnchorId={selectedOpt.id}
        onSelectAnchor={onSelectAnchor}
      />,
    );
    const activeBtn = screen.getByRole("button", { name: new RegExp(selectedOpt.name, "i") });
    fireEvent.click(activeBtn);
    expect(onSelectAnchor).toHaveBeenCalledWith(null);
  });

  it("rerolls new anchors when 'Arvo uudet 5' is clicked", () => {
    const onReroll = vi.fn();
    render(<AnchorSelector onReroll={onReroll} />);

    const rerollBtn = screen.getByRole("button", { name: /Arvo uudet 5/i });
    fireEvent.click(rerollBtn);

    expect(onReroll).toHaveBeenCalledTimes(1);
    const rerolledBatch = onReroll.mock.calls[0]?.[0];
    expect(rerolledBatch).toHaveLength(5);
  });

  it("renders empty state notice when all anchors are claimed", () => {
    render(<AnchorSelector options={[]} />);

    expect(screen.getByText("Ei vapaita ankkureita")).toBeInTheDocument();
    expect(screen.getByText("Kaikki ankkurit ovat varattuja.")).toBeInTheDocument();
  });

  describe("Locked Mode (Returning player with persistent anchor)", () => {
    it("renders locked anchor view with inheritance notice and no reroll button", () => {
      render(<AnchorSelector lockedAnchorId="atu-0" />);

      // Notice explaining inheritance to all characters
      expect(screen.getByText("Pelaajakohtainen ankkuri")).toBeInTheDocument();
      expect(screen.getByText(/periytyy automaattisesti/i)).toBeInTheDocument();
      expect(screen.getByText("kaikille hahmoillesi")).toBeInTheDocument();

      // Locked anchor button and badge
      expect(screen.getByText("Lukittu ankkuri")).toBeInTheDocument();
      const lockedAnchor = getAnchorById("atu-0") ?? selectedOpt;
      expect(screen.getByText(lockedAnchor.name)).toBeInTheDocument();

      // Dual polarities displayed
      expect(screen.getByText(lockedAnchor.polarityA.title)).toBeInTheDocument();
      expect(screen.getByText(lockedAnchor.polarityB.title)).toBeInTheDocument();

      // Cannot reroll
      expect(screen.queryByRole("button", { name: /Arvo uudet 5/i })).not.toBeInTheDocument();
    });
  });

  describe("Obscured Mode", () => {
    it("masks text and disables action buttons", () => {
      const { container } = render(
        <AnchorSelector options={testOptions} selectedAnchorId={selectedOpt.id} obscured={true} />,
      );

      const root = container.firstChild as HTMLElement;
      expect(root).toHaveAttribute("aria-hidden", "true");
      expect(root.className).toContain("obscured-wrapper");

      const buttons = screen.getAllByRole("button", { hidden: true });
      for (const btn of buttons) {
        expect(btn).toBeDisabled();
      }

      expect(screen.queryByText("Kuilu")).not.toBeInTheDocument();
    });
  });
});
