// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  DowntimeAllocator,
  type DowntimeClockTarget,
  type DowntimeDraftAllocation,
} from "./DowntimeAllocator";

const CLOCKS: DowntimeClockTarget[] = [
  {
    id: 10,
    title: "Kilpien kalibrointi",
    description: "Konehuoneen vauriot",
    category: "projekti",
    scope: "ship",
    roomLabel: "Konehuone",
    segmentsTotal: 6,
    segmentsFilled: 1,
  },
  {
    id: 20,
    title: "Arkistokoodin avaus",
    description: "Sinetöidyn kannen lukko",
    category: "tutkimus",
    scope: "character",
    roomLabel: null,
    segmentsTotal: null,
    segmentsFilled: 0,
  },
];

describe("DowntimeAllocator", () => {
  let injectedSprite = false;

  beforeAll(() => {
    if (!document.getElementById("custom-icon-sprite")) {
      const sprite = document.createElement("div");
      sprite.id = "custom-icon-sprite";
      document.body.appendChild(sprite);
      injectedSprite = true;
    }
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    if (injectedSprite) {
      document.getElementById("custom-icon-sprite")?.remove();
    }
  });

  it("enforces pool capacity across rest, clocks, and prep while showing harm penalty slots", () => {
    const onChange = vi.fn();
    function Harness() {
      const [value, setValue] = React.useState<DowntimeDraftAllocation>({
        healedHarmiIndices: [],
        clockDice: {},
        prepDice: 0,
        prepDescription: "",
      });
      return (
        <DowntimeAllocator
          availableDice={3}
          activeHarmit={[
            { index: 0, text: "Palovamma" },
            { index: 1, text: "Aivotärähdys" },
          ]}
          clocks={CLOCKS}
          value={value}
          onChange={(next) => {
            onChange(next);
            setValue(next);
          }}
        />
      );
    }

    render(<Harness />);

    expect(screen.getByText("3 vapaana / 3")).toBeInTheDocument();
    expect(screen.getAllByText("Harmi")).toHaveLength(2);
    expect(screen.getByText("Aktiiviset harmit vähentävät poolista 2n20.")).toBeInTheDocument();

    // Select 1 harmi for Hahmon lepo
    const firstHarmBtn = screen.getByRole("button", { name: /Palovamma/i });
    fireEvent.click(firstHarmBtn);
    expect(firstHarmBtn).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByText("2 vapaana / 3")).toBeInTheDocument();

    // Allocate 1 die to Kilpien kalibrointi clock and 1 die to Keikkavalmistautuminen
    const addProjectBtn = screen.getByRole("button", {
      name: "Lisää noppa kelloon Kilpien kalibrointi",
    });
    const addPrepBtn = screen.getByRole("button", {
      name: "Lisää noppa keikkavalmistautumiseen",
    });

    fireEvent.click(addProjectBtn);
    fireEvent.click(addPrepBtn);

    expect(screen.getByText("0 vapaana / 3")).toBeInTheDocument();
    // All '+' buttons and unselected harm button are now disabled at 0 remaining
    expect(addProjectBtn).toBeDisabled();
    expect(addPrepBtn).toBeDisabled();
    expect(screen.getByRole("button", { name: /Aivotärähdys/i })).toBeDisabled();

    // Deallocating one die re-enables allocation
    fireEvent.click(
      screen.getByRole("button", { name: "Vähennä noppa kellosta Kilpien kalibrointi" }),
    );
    expect(screen.getByText("1 vapaana / 3")).toBeInTheDocument();
    expect(addProjectBtn).not.toBeDisabled();
  });
});
