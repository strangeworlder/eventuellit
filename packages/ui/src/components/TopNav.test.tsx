// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { TopNav, TopNavLink, TopNavList } from "./TopNav";

describe("TopNav", () => {
  it("tugs the active pill indicator toward a hovered TopNavLink and resets on mouseleave", () => {
    render(
      <MemoryRouter initialEntries={["/seula"]}>
        <TopNav aria-label="Asemanavigaatio">
          <TopNavList data-testid="nav-list">
            <TopNavLink to="/seula">Seula</TopNavLink>
            <TopNavLink to="/syke">Syke</TopNavLink>
          </TopNavList>
        </TopNav>
      </MemoryRouter>,
    );

    const list = screen.getByTestId("nav-list");
    const activeLink = screen.getByRole("link", { name: "Seula" });
    const targetLink = screen.getByRole("link", { name: "Syke" });

    vi.spyOn(activeLink, "getBoundingClientRect").mockReturnValue({
      left: 0,
      top: 0,
      width: 100,
      height: 40,
      right: 100,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    vi.spyOn(targetLink, "getBoundingClientRect").mockReturnValue({
      left: 120,
      top: 0,
      width: 100,
      height: 40,
      right: 220,
      bottom: 40,
      x: 120,
      y: 0,
      toJSON: () => ({}),
    });

    expect(list.style.getPropertyValue("--tab-tug-x")).toBe("0px");

    fireEvent.mouseOver(targetLink);

    expect(list.style.getPropertyValue("--tab-tug-x")).not.toBe("0px");
    expect(Number.parseFloat(list.style.getPropertyValue("--tab-stretch-x"))).toBeGreaterThan(1);

    fireEvent.mouseLeave(list);

    expect(list.style.getPropertyValue("--tab-tug-x")).toBe("0px");
    expect(list.style.getPropertyValue("--tab-stretch-x")).toBe("1");
  });
});
