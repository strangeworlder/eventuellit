// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { MarkdownRenderer } from "./Markdown";
import { Separator } from "./Separator";

function renderMarkdown(content: string) {
  return render(
    <MemoryRouter>
      <MarkdownRenderer>{content}</MarkdownRenderer>
    </MemoryRouter>,
  );
}

describe("MarkdownRenderer & Separator", () => {
  afterEach(() => {
    cleanup();
  });

  it("separates calm bold emphasis from inline game terms", () => {
    renderMarkdown("Tämä on **tavallinen lihavointi** ja `5n20-noppakoura` peliterminä.");

    const bold = screen.getByText("tavallinen lihavointi");
    expect(bold.tagName).toBe("STRONG");
    expect(bold.className).toContain("font-semibold");
    expect(bold.className).toContain("text-current");

    const term = screen.getByText("5n20-noppakoura");
    expect(term.className).toContain("text-[var(--theme-accent)]");
    expect(term.className).toContain("font-black");
  });

  it("renders h3 sections with anchor id, preserved heading tone on bold labels, and fading separator", () => {
    const { container } = renderMarkdown("### **Premissi**\n\nJohdanto.");

    const heading = container.querySelector("h3");
    expect(heading).not.toBeNull();
    expect(heading?.id).toBe("premissi");

    const innerStrong = heading?.querySelector("strong");
    expect(innerStrong?.textContent).toBe("Premissi");
    expect(innerStrong?.className).toContain("text-current");

    const divider = heading?.nextElementSibling;
    expect(divider?.tagName).toBe("HR");
    expect(divider?.getAttribute("class")).toContain("--theme-divider-fade");
  });

  it("renders horizontal rules, blockquotes, and GFM tables with design system surfaces", () => {
    const { container } = renderMarkdown(`
> Hiljainen lainauslohko.

---

| Järjestelmä | Tila |
|---|---|
| Telakka 4 | Vakaa |
`);

    const quote = container.querySelector("blockquote");
    expect(quote?.className).toContain("border-l-2");
    expect(quote?.className).toContain("--theme-surface-wash");

    const tableWrapper = container.querySelector(".ds-luminous-surface");
    expect(tableWrapper).not.toBeNull();
    const table = tableWrapper?.querySelector("table");
    expect(table).not.toBeNull();
    expect(screen.getByRole("columnheader", { name: "Järjestelmä" })).toBeTruthy();
    expect(screen.getByRole("cell", { name: "Telakka 4" })).toBeTruthy();

    const hrs = container.querySelectorAll("hr");
    expect(hrs.length).toBeGreaterThanOrEqual(1);
  });

  it("supports horizontal and vertical gradient separators", () => {
    const { container } = render(
      <div>
        <Separator variant="gradient" orientation="horizontal" decorative={false} />
        <Separator variant="gradient" orientation="vertical" decorative={false} />
      </div>,
    );

    const separators = container.querySelectorAll('[role="separator"]');
    expect(separators).toHaveLength(2);
    expect(separators[0]?.className).toContain("linear-gradient(90deg");
    expect(separators[1]?.className).toContain("linear-gradient(180deg");
  });
});
