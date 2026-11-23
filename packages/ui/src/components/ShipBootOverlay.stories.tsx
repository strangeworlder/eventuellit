import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { ShipBootOverlay } from "./ShipBootOverlay";

const meta: Meta<typeof ShipBootOverlay> = {
  title: "Suunnittelujarjestelma/Konsoli/ShipBootOverlay",
  component: ShipBootOverlay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShipBootOverlay>;

export const Vuorovaikutteinen: Story = {
  name: "Käynnistysanimaatio",
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="p-6">
        <Button type="button" onClick={() => setOpen(true)}>
          Käynnistä Aamunkoin pääte
        </Button>
        <ShipBootOverlay
          open={open}
          shipName="Aamunkoi"
          callsign="Runko 150 m"
          statusLine="Asemien välisessä varjossa, häivejärjestelmät valmiustilassa"
          onComplete={() => setOpen(false)}
        />
      </div>
    );
  },
};
