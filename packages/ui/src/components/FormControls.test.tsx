// @vitest-environment jsdom
import "@testing-library/jest-dom";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select } from "./Select";
import { Switch } from "./Switch";

describe("Form & choice controls", () => {
  afterEach(() => {
    cleanup();
  });

  it("supports uncontrolled Checkbox toggling and ref forwarding", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} label="Vahvista lukitus" />);

    const input = screen.getByRole("checkbox", { name: "Vahvista lukitus" });
    expect(ref.current).toBe(input);
    expect(input).not.toBeChecked();

    fireEvent.click(input);
    expect(input).toBeChecked();
  });

  it("supports controlled Checkbox with error feedback", () => {
    const onChange = vi.fn();
    render(
      <Checkbox label="Hyväksy ehdot" checked onChange={onChange} error="Pakollinen valinta" />,
    );

    const input = screen.getByRole("checkbox", { name: "Hyväksy ehdot" });
    expect(input).toBeChecked();
    expect(screen.getByText("Pakollinen valinta")).toBeInTheDocument();

    fireEvent.click(input);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("supports uncontrolled and controlled Switch states", () => {
    const onChange = vi.fn();
    const { unmount } = render(
      <Switch label="Yönäkymä" defaultChecked={false} onChange={onChange} />,
    );

    const uncontrolledSwitch = screen.getByRole("switch", {
      name: "Yönäkymä",
    }) as HTMLInputElement;
    expect(uncontrolledSwitch.checked).toBe(false);

    fireEvent.click(uncontrolledSwitch);
    expect(uncontrolledSwitch.checked).toBe(true);
    expect(onChange).toHaveBeenCalledTimes(1);

    unmount();

    render(<Switch label="Yönäkymä" checked onChange={onChange} />);
    const controlledSwitch = screen.getByRole("switch", { name: "Yönäkymä" });
    expect(controlledSwitch).toHaveAttribute("aria-checked", "true");
  });

  it("renders RadioGroup options and invokes onValueChange on selection", () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="reitti" label="Valitse reitti" value="a" onValueChange={onValueChange}>
        <RadioGroupItem value="a" label="Kiertoreitti" />
        <RadioGroupItem value="b" label="Suora isku" />
      </RadioGroup>,
    );

    expect(screen.getByRole("radiogroup", { name: "Valitse reitti" })).toBeInTheDocument();
    const radioA = screen.getByRole("radio", { name: "Kiertoreitti" });
    const radioB = screen.getByRole("radio", { name: "Suora isku" });
    expect(radioA).toBeChecked();
    expect(radioB).not.toBeChecked();

    fireEvent.click(radioB);
    expect(onValueChange).toHaveBeenCalledWith("b");
  });

  it("renders Input and Select with inline chevron and FieldError", () => {
    const { container } = render(
      <div>
        <Input label="Hahmon nimi" placeholder="Esim. Kallas" error="Nimi puuttuu" />
        <Select
          label="Alus"
          placeholder="Valitse alus"
          options={[
            { value: "kynnys", label: "Kynnys" },
            { value: "aura", label: "Aura" },
          ]}
        />
      </div>,
    );

    expect(screen.getByPlaceholderText("Esim. Kallas")).toBeInTheDocument();
    expect(screen.getByText("Nimi puuttuu")).toBeInTheDocument();

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Kynnys" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Aura" })).toBeInTheDocument();
    expect(container.querySelector("svg[aria-hidden='true']")).toBeInTheDocument();
  });
});
