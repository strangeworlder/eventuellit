// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { Button } from "./Button";
import { ToggleButton } from "./ToggleButton";
import { ToolButton } from "./ToolButton";

describe("Button, ToolButton & ToggleButton", () => {
  let injectedTestSprite = false;

  beforeAll(() => {
    if (!document.getElementById("custom-icon-sprite")) {
      const sprite = document.createElement("div");
      sprite.id = "custom-icon-sprite";
      document.body.appendChild(sprite);
      injectedTestSprite = true;
    }
  });

  afterEach(() => {
    cleanup();
  });

  afterAll(() => {
    if (injectedTestSprite) {
      document.getElementById("custom-icon-sprite")?.remove();
    }
  });

  it("renders solid, outline, and ghost variants and invokes onClick", () => {
    const onSolidClick = vi.fn();
    render(
      <div>
        <Button variant="solid" onClick={onSolidClick}>
          Tallenna
        </Button>
        <Button variant="outline">Peruuta</Button>
        <Button variant="ghost">Aktiivinen valikko</Button>
      </div>,
    );

    const solidBtn = screen.getByRole("button", { name: "Tallenna" });
    const outlineBtn = screen.getByRole("button", { name: "Peruuta" });
    const ghostBtn = screen.getByRole("button", { name: "Aktiivinen valikko" });

    expect(solidBtn.className).toContain("ds-btn-solid");
    expect(outlineBtn.className).toContain("ds-btn-outline");
    expect(ghostBtn.className).not.toContain("bg-[var(--theme-accent)]");

    fireEvent.click(solidBtn);
    expect(onSolidClick).toHaveBeenCalledTimes(1);
  });

  it("renders danger variant with single inline icon and replaces it with spinner when loading", () => {
    const { rerender } = render(<Button variant="danger">Poista hahmo</Button>);

    const dangerBtn = screen.getByRole("button", { name: "Poista hahmo" });
    expect(dangerBtn.className).toContain("ds-btn-danger");
    expect(dangerBtn.querySelectorAll("svg")).toHaveLength(1);

    rerender(
      <Button variant="danger" showDangerIcon={false}>
        Poista hahmo
      </Button>,
    );
    expect(
      screen.getByRole("button", { name: "Poista hahmo" }).querySelectorAll("svg"),
    ).toHaveLength(0);

    rerender(
      <Button variant="danger" loading loadingMessage="Poisto käynnissä">
        Poistetaan
      </Button>,
    );
    const loadingBtn = screen.getByRole("button", { name: /Poistetaan/i });
    expect(loadingBtn).toHaveAttribute("aria-busy", "true");
    expect(loadingBtn).toHaveAttribute("aria-disabled", "true");
    expect(loadingBtn.querySelectorAll("svg")).toHaveLength(1);
    expect(screen.getByText("Poisto käynnissä")).toBeInTheDocument();
  });

  it("sets aria-pressed and surface classes on ToggleButton", () => {
    const { rerender } = render(<ToggleButton pressed={false}>Suodata</ToggleButton>);
    const toggle = screen.getByRole("button", { name: "Suodata" });
    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(toggle.className).toContain("ds-btn-outline");

    rerender(<ToggleButton pressed>Suodata</ToggleButton>);
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle.className).toContain("ds-control-checked");
  });

  it("renders ToolButton with outline surface and loading aria-busy state", () => {
    const onClick = vi.fn();
    const { rerender } = render(<ToolButton onClick={onClick}>Muokkaa</ToolButton>);
    const tool = screen.getByRole("button", { name: "Muokkaa" });
    expect(tool.className).toContain("ds-btn-outline");

    fireEvent.click(tool);
    expect(onClick).toHaveBeenCalledTimes(1);

    rerender(
      <ToolButton loading loadingMessage="Tallennetaan">
        Muokkaa
      </ToolButton>,
    );
    const loadingTool = screen.getByRole("button", { name: "Tallennetaan" });
    expect(loadingTool).toBeDisabled();
    expect(loadingTool).toHaveAttribute("aria-busy", "true");
  });
});
