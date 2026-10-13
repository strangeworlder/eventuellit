// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ANCHOR_CARDS } from "../data/anchors";
import { AnchorCard } from "./AnchorCard";

const sampleAnchor = ANCHOR_CARDS[0] ?? {
  id: "atu-0",
  name: "Kuilu",
  internalRef: "The Fool",
  arcana: "major",
  polarityA: { title: "Syöksy", description: "Pudotus ilman laskuvarjoa." },
  polarityB: { title: "Umpikuja", description: "Pohjakosketus ja pysähdys." },
  description: "Askel suoraan tyhjyyteen.",
};

describe("AnchorCard", () => {
  it("renders anchor name, description, and dual polarities side-by-side", () => {
    render(<AnchorCard anchor={sampleAnchor} />);

    expect(screen.getByText("Kuilu")).toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.description)).toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.polarityA.title)).toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.polarityA.description)).toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.polarityB.title)).toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.polarityB.description)).toBeInTheDocument();
  });

  it("handles selection interaction when onSelect is provided", () => {
    const onSelect = vi.fn();
    render(<AnchorCard anchor={sampleAnchor} onSelect={onSelect} />);

    const selectBtn = screen.getByRole("button", { name: "Valitse ankkuri" });
    fireEvent.click(selectBtn);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("displays 'Valittu' status when selected={true}", () => {
    render(<AnchorCard anchor={sampleAnchor} selected={true} onSelect={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Valittu" })).toBeInTheDocument();
  });

  it("hides the italic description in compact mode while preserving polarities", () => {
    render(<AnchorCard anchor={sampleAnchor} compact={true} />);

    expect(screen.queryByText(sampleAnchor.description)).not.toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.polarityA.title)).toBeInTheDocument();
    expect(screen.getByText(sampleAnchor.polarityB.title)).toBeInTheDocument();
  });

  it("applies obscured mode masking and disables buttons", () => {
    const { container } = render(
      <AnchorCard anchor={sampleAnchor} obscured={true} onSelect={vi.fn()} />,
    );

    const root = container.firstChild as HTMLElement;
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.className).toContain("obscured-wrapper");

    const button = screen.getByRole("button", { hidden: true });
    expect(button).toBeDisabled();
    // Plain name should not be directly visible in DOM
    expect(screen.queryByText("Kuilu")).not.toBeInTheDocument();
  });
});
