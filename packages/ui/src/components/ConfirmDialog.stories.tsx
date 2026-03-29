import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "./Button";
import { ConfirmDialog } from "./ConfirmDialog";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/ConfirmDialog",
  component: ConfirmDialog,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    title: "Vahvista",
    onConfirm: () => {},
  },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Avaa vahvistus</Button>
        <ConfirmDialog
          open={open}
          onOpenChange={setOpen}
          title="Poista kohde?"
          description="Tätä toimintoa ei voi peruuttaa."
          confirmLabel="Poista"
          cancelLabel="Peruuta"
          variant="danger"
          onConfirm={() => {}}
        />
      </>
    );
  },
};
