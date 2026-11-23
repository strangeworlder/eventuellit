// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { ProgressClock } from "./ProgressClock";

describe("ProgressClock", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the exact number of filled and unfilled radial segments", () => {
    const { container } = render(
      <ProgressClock
        segmentsTotal={8}
        segmentsFilled={3}
        category="tutkimus"
        label="Datalevyn purku"
      />,
    );

    expect(screen.getByText("Datalevyn purku")).toBeInTheDocument();
    expect(screen.getByText("3 / 8 osaa")).toBeInTheDocument();

    const filled = container.querySelectorAll('path[data-filled="true"]');
    const unfilled = container.querySelectorAll('path[data-filled="false"]');
    expect(filled).toHaveLength(3);
    expect(unfilled).toHaveLength(5);
  });

  it("supports 4, 6, 10, and 12 segments and marks completed clocks as Valmis", () => {
    const { rerender, container } = render(
      <ProgressClock segmentsTotal={4} segmentsFilled={4} label="Täysi" />,
    );
    expect(screen.getByText("Valmis")).toBeInTheDocument();
    expect(container.querySelectorAll('path[data-filled="true"]')).toHaveLength(4);

    rerender(<ProgressClock segmentsTotal={12} segmentsFilled={5} label="Laaja" />);
    expect(screen.getByText("5 / 12 osaa")).toBeInTheDocument();
    expect(container.querySelectorAll("path")).toHaveLength(12);
  });

  it("renders dashed uncalibrated readout when segmentsTotal is null", () => {
    const { container } = render(
      <ProgressClock segmentsTotal={null} segmentsFilled={2} label="Uusi havainto" />,
    );

    expect(screen.getByText("Odottaa pelinjohtajan mitoitusta")).toBeInTheDocument();
    expect(screen.getByText("+2")).toBeInTheDocument();
    expect(container.querySelectorAll("path")).toHaveLength(0);
    expect(container.querySelector("circle[stroke-dasharray]")).not.toBeNull();
  });
});
