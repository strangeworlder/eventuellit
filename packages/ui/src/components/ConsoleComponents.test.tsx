// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { ConsoleButton } from "./ConsoleButton";
import { ConsoleDock, ConsoleDockItem } from "./ConsoleDock";
import { ConsolePill } from "./ConsolePill";
import { ConsoleRow } from "./ConsoleRow";
import { ConsoleSheet } from "./ConsoleSheet";
import {
  ConsoleViewport,
  computeArrivalWavefrontU,
  computeWavePhaseOffset,
  useConsoleArrival,
} from "./ConsoleViewport";
import { ObscuredWrapper } from "./ObscuredWrapper";
import { ShipBootOverlay } from "./ShipBootOverlay";

describe("Konsoli elevated HUD components", () => {
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

  it("ConsoleSheet cycles snap states (half -> full -> peek) and handles onClose", () => {
    const onClose = vi.fn();
    render(
      <ConsoleSheet headerCode="KANSI-02 // B" title="Paapuurin siipi" onClose={onClose}>
        <p>Sisältö</p>
      </ConsoleSheet>,
    );

    const sheet = screen.getByRole("region", { name: "Paapuurin siipi" });
    expect(sheet).toHaveAttribute("data-snap", "half");
    expect(screen.getByText("Sisältö")).toBeInTheDocument();

    // half -> full
    fireEvent.click(screen.getByRole("button", { name: /Laajenna paneeli täyteen korkeuteen/i }));
    expect(sheet).toHaveAttribute("data-snap", "full");
    expect(screen.getByText("Sisältö")).toBeInTheDocument();

    // full -> peek hides body content
    fireEvent.click(screen.getByRole("button", { name: /Pienennä paneeli tiiviiksi palkiksi/i }));
    expect(sheet).toHaveAttribute("data-snap", "peek");
    expect(screen.queryByText("Sisältö")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sulje ikkuna" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("ConsoleDock renders aria-current on active item and utility bar", () => {
    const onClick = vi.fn();
    render(
      <ConsoleDock utilityBar={<span>KAIKKI</span>}>
        <ConsoleDockItem icon="compass" label="Alus" active onClick={onClick} />
        <ConsoleDockItem icon="dice5" label="Väliaika" badge={5} />
      </ConsoleDock>,
    );

    expect(screen.getByText("KAIKKI")).toBeInTheDocument();
    const shipBtn = screen.getByRole("button", { name: "Alus" });
    expect(shipBtn).toHaveAttribute("aria-current", "page");

    const downtimeBtn = screen.getByRole("button", { name: /Väliaika/ });
    expect(downtimeBtn).not.toHaveAttribute("aria-current");
    expect(screen.getByText("5")).toBeInTheDocument();

    fireEvent.click(shipBtn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("ConsoleRow applies status tones and supports non-nested actions", () => {
    const onSelect = vi.fn();
    const onReserve = vi.fn();
    const { container } = render(
      <ConsoleRow
        statusTone="warning"
        code="HYTTI B-02"
        title="Miehistöhytti B-02"
        subtitle="Vapaa"
        onClick={onSelect}
        actions={
          <ConsoleButton size="compact" variant="secondary" onClick={onReserve}>
            Varaa
          </ConsoleButton>
        }
      />,
    );

    const rowEl = container.querySelector('[data-status-tone="warning"]');
    expect(rowEl).not.toBeNull();

    fireEvent.click(screen.getByRole("button", { name: /Miehistöhytti B-02/ }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Varaa" }));
    expect(onReserve).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("ConsoleButton disables during loading and inside unrevealed ObscuredWrapper", () => {
    const onClick = vi.fn();
    const { rerender } = render(
      <ConsoleButton variant="primary" loading onClick={onClick}>
        Lataa
      </ConsoleButton>,
    );

    const loadingBtn = screen.getByRole("button");
    expect(loadingBtn).toBeDisabled();
    expect(loadingBtn).toHaveAttribute("aria-busy", "true");
    fireEvent.click(loadingBtn);
    expect(onClick).not.toHaveBeenCalled();

    rerender(
      <ObscuredWrapper revealed={false}>
        <ConsoleButton variant="danger" onClick={onClick}>
          Avaa luukku
        </ConsoleButton>
      </ObscuredWrapper>,
    );

    const obscuredBtn = screen.getByRole("button", { hidden: true });
    expect(obscuredBtn).toBeDisabled();
    fireEvent.click(obscuredBtn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("ConsoleViewport arranges header topBar, stage, overlay slot, footer dock, and liquid canvas", () => {
    const { container, rerender } = render(
      <ConsoleViewport
        theme="secondary-dark"
        topBar={<div>RUNKO-150M</div>}
        stage={<div>ALUS-STAGE</div>}
        overlay={<div>KELUVAA</div>}
        dock={<div>TELAKKA</div>}
      />,
    );

    expect(screen.getByText("RUNKO-150M")).toBeInTheDocument();
    expect(screen.getByText("ALUS-STAGE")).toBeInTheDocument();
    expect(screen.getByText("KELUVAA")).toBeInTheDocument();
    expect(screen.getByText("TELAKKA")).toBeInTheDocument();
    expect(container.querySelector("header")).not.toBeNull();
    expect(container.querySelector("footer")).not.toBeNull();
    expect(container.querySelector("[aria-hidden='true'] > canvas")).not.toBeNull();
    expect(container.querySelector(".ds-console-overlay-slot")).not.toBeNull();
    expect(container.querySelector('[data-stage-mode="scroll"]')).toHaveClass("overflow-y-auto");

    rerender(
      <ConsoleViewport theme="secondary-dark" stageMode="canvas" stage={<div>ALUS-CANVAS</div>} />,
    );

    expect(screen.getByText("ALUS-CANVAS")).toBeInTheDocument();
    expect(container.querySelector('[data-stage-mode="canvas"]')).toHaveClass("overflow-hidden");
  });

  it("computeWavePhaseOffset advances constant wave phase from bow to stern (+u) as time progresses", () => {
    const t1 = 1.0;
    const t2 = 2.0;
    const freq = 2;
    const speed = 0.62;
    const u1 = 0.35;
    const deltaU = ((t2 - t1) * speed) / (2 * Math.PI * freq);

    const phaseAtT1 = computeWavePhaseOffset(u1, freq, t1, speed);
    const phaseDownstreamAtT2 = computeWavePhaseOffset(u1 + deltaU, freq, t2, speed);

    expect(deltaU).toBeGreaterThan(0);
    expect(phaseDownstreamAtT2).toBeCloseTo(phaseAtT1, 6);
  });

  it("ConsoleViewport with igniteOnMount sets data-ignition and ConsolePill renders dawn tone", () => {
    const { container } = render(
      <ConsoleViewport
        theme="secondary-dark"
        igniteOnMount
        topBar={
          <ConsolePill tone="dawn" icon="anchor">
            Aamunkoi
          </ConsolePill>
        }
        stage={<div>RUNKO</div>}
      />,
    );

    expect(container.querySelector(".ds-console-viewport")).toHaveAttribute(
      "data-ignition",
      "igniting",
    );
    expect(screen.getByText("Aamunkoi")).toBeInTheDocument();
  });

  it("ShipBootOverlay renders canonical handshake diagnostics and allows skipping", () => {
    const onComplete = vi.fn();
    render(<ShipBootOverlay open onComplete={onComplete} />);

    expect(screen.getByText("AAMUNKOI")).toBeInTheDocument();
    expect(screen.getByText("Runko 150 m")).toBeInTheDocument();
    expect(screen.getByText("OHJAINLEVY TUNNISTETTU: ARKKITEHTUURISTANDARDI")).toBeInTheDocument();
    expect(screen.getByText("SISÄINEN ÄÄNI -RUNKOLINKKI SYNKRONOITU")).toBeInTheDocument();
    expect(screen.getByText("ALKUPERÄINEN TUNNISTE KORRUPTOITUNUT: AAMUNKOI")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ohita aluksen päätteen käynnistys" }));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("computes bow-to-stern wavefront progression and exposes synchronized arrival telemetry", () => {
    expect(computeArrivalWavefrontU(0, 0.22)).toBeCloseTo(0.22, 4);
    expect(computeArrivalWavefrontU(0.5, 0.22)).toBeGreaterThan(
      computeArrivalWavefrontU(0.2, 0.22),
    );
    expect(computeArrivalWavefrontU(1, 0.22)).toBeCloseTo(1.08, 4);

    function ArrivalProbe() {
      const { progress, wavefrontU, isArriving } = useConsoleArrival();
      return (
        <span data-testid="arrival-probe">
          {`${progress.toFixed(2)}|${wavefrontU.toFixed(2)}|${String(isArriving)}`}
        </span>
      );
    }

    const { container, rerender } = render(
      <ConsoleViewport
        theme="base"
        igniteOnMount
        arrivalProgressOverride={0.44}
        stage={<ArrivalProbe />}
      />,
    );

    const viewport = container.querySelector(".ds-console-viewport");
    expect(viewport).toHaveAttribute("data-ignition", "igniting");
    expect(viewport).toHaveAttribute("data-arrival", "arriving");
    expect(screen.getByTestId("arrival-probe")).toHaveTextContent(/^0\.44\|.+\|true$/);

    rerender(
      <ConsoleViewport
        theme="base"
        igniteOnMount
        arrivalProgressOverride={0.72}
        stage={<ArrivalProbe />}
      />,
    );
    expect(screen.getByTestId("arrival-probe")).toHaveTextContent(/^0\.72\|.+\|true$/);

    rerender(
      <ConsoleViewport
        theme="base"
        igniteOnMount
        arrivalProgressOverride={1}
        stage={<ArrivalProbe />}
      />,
    );
    expect(viewport).toHaveAttribute("data-arrival", "settled");
    expect(viewport).toHaveAttribute("data-ignition", "ready");
  });

  it("applies Meripihka (--theme-dawn) EGA highlight classes across ConsolePill, ConsoleRow, and ConsoleDockItem", () => {
    const { container } = render(
      <div>
        <ConsolePill tone="dawn" icon="anchor">
          Aamunkoi
        </ConsolePill>
        <ConsolePill tone="neutral" active onClick={() => undefined}>
          Kaikki
        </ConsolePill>
        <ConsoleRow
          statusTone="dawn"
          code="KANSI-01"
          title="Komentosilta"
          subtitle="Aktiivinen osasto"
        />
        <ConsoleDock>
          <ConsoleDockItem icon="compass" label="Alus" active badge={5} />
          <ConsoleDockItem icon="dice5" label="Väliaika" badge={2} />
        </ConsoleDock>
      </div>,
    );

    const dawnPill = screen.getByText("Aamunkoi").closest("div, button");
    expect(dawnPill).not.toBeNull();
    expect(dawnPill?.className).toContain("--theme-dawn");

    const activeNeutralPill = screen.getByRole("button", { name: "Kaikki" });
    expect(activeNeutralPill).toHaveAttribute("aria-pressed", "true");
    expect(activeNeutralPill.className).toContain("--theme-dawn");

    const dawnRow = container.querySelector('[data-status-tone="dawn"]');
    expect(dawnRow).not.toBeNull();
    expect(dawnRow?.className).toContain("--theme-dawn");
    expect(screen.getByText("KANSI-01").className).toContain("--theme-dawn-muted");

    const activeDockBtn = screen.getByRole("button", { name: /Alus/ });
    expect(activeDockBtn).toHaveAttribute("aria-current", "page");
    expect(activeDockBtn.className).toContain("--theme-dawn");
    expect(activeDockBtn.querySelector("span[aria-hidden='true']")?.className).toContain(
      "--theme-dawn",
    );
    expect(screen.getByText("5").className).toContain("--theme-dawn");
    expect(screen.getByText("2").className).toContain("--theme-dawn");
  });
});
