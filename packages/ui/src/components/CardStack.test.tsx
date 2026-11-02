// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CardStack } from "./CardStack";

describe("CardStack", () => {
  it("renders a single card directly without deck controls", () => {
    render(
      <CardStack>
        <div data-testid="card-1">Kortti 1</div>
      </CardStack>,
    );

    expect(screen.getByTestId("card-1")).toBeInTheDocument();
    expect(screen.queryByRole("region", { name: /korttipakka/i })).not.toBeInTheDocument();
  });

  it("renders multiple cards with deck controls and counter", () => {
    render(
      <CardStack label="Pelaaja: Petri">
        <div data-testid="card-1">Kortti 1</div>
        <div data-testid="card-2">Kortti 2</div>
        <div data-testid="card-3">Kortti 3</div>
      </CardStack>,
    );

    expect(screen.getByRole("region")).toBeInTheDocument();
    expect(screen.getByText("Pelaaja: Petri")).toBeInTheDocument();
    expect(screen.getByText("1 / 3")).toBeInTheDocument();
    expect(screen.getByTestId("card-1")).toBeInTheDocument();
  });

  it("advances to the next card when next button is clicked (reduced-motion)", () => {
    // Mock matchMedia for reduced-motion so timeout is bypassed in tests
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const onActiveIndexChange = vi.fn();

    render(
      <CardStack onActiveIndexChange={onActiveIndexChange}>
        <div data-testid="card-1">Kortti 1</div>
        <div data-testid="card-2">Kortti 2</div>
      </CardStack>,
    );

    const nextBtn = screen.getByRole("button", { name: /seuraava kortti/i });
    fireEvent.click(nextBtn);

    expect(onActiveIndexChange).toHaveBeenCalledWith(1);
    expect(screen.getByText("2 / 2")).toBeInTheDocument();
    expect(screen.getByTestId("card-2")).toBeInTheDocument();
  });

  it("navigates with arrow keys", () => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const onActiveIndexChange = vi.fn();

    render(
      <CardStack onActiveIndexChange={onActiveIndexChange}>
        <div>Kortti 1</div>
        <div>Kortti 2</div>
        <div>Kortti 3</div>
      </CardStack>,
    );

    const region = screen.getByRole("region");
    fireEvent.keyDown(region, { key: "ArrowRight" });
    expect(onActiveIndexChange).toHaveBeenCalledWith(1);

    fireEvent.keyDown(region, { key: "ArrowLeft" });
    expect(onActiveIndexChange).toHaveBeenCalledWith(0);
  });
});
