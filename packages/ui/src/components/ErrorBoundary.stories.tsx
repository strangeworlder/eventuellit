import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "./Button";
import { ErrorBoundary } from "./ErrorBoundary";

function Boom({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error("Esimerkkivirhe Storybookissa");
  }
  return <p className="text-[var(--theme-text)]">Kaikki kunnossa.</p>;
}

const meta = {
  title: "Suunnittelujarjestelma/Organismit/ErrorBoundary",
  component: ErrorBoundary,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ErrorBoundary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  args: {
    children: null,
  },
  render: () => {
    const [throwError, setThrowError] = useState(false);
    return (
      <div className="space-y-4 max-w-md">
        <Button type="button" onClick={() => setThrowError((v) => !v)}>
          {throwError ? "Palauta tila" : "Laukaise virhe"}
        </Button>
        <ErrorBoundary key={String(throwError)}>
          <Boom shouldThrow={throwError} />
        </ErrorBoundary>
      </div>
    );
  },
};
