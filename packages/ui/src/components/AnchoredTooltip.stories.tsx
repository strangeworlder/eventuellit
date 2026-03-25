import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";

import { AnchoredTooltip } from "./AnchoredTooltip";
import { Button } from "./Button";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/AnchoredTooltip",
  component: AnchoredTooltip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    placement: {
      control: "select",
      options: [
        "right",
        "left",
        "top",
        "bottom",
        "bottom-left",
        "bottom-right",
        "top-left",
        "top-right",
      ],
    },
    variant: {
      control: "select",
      options: ["default", "button-loading", "station-description"],
    },
    theme: {
      control: "select",
      options: [
        undefined,
        "base",
        "inverted",
        "primary-light",
        "primary-dark",
        "secondary-light",
        "secondary-dark",
        "accent-light",
        "accent-dark",
      ],
    },
  },
} satisfies Meta<typeof AnchoredTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oikealla: Story = {
  render: (args) => (
    <div className="group relative flex items-center p-16">
      <Button size="sm">Vie hiiri päälle</Button>
      <AnchoredTooltip {...args}>Lisätietoja tästä toiminnosta</AnchoredTooltip>
    </div>
  ),
  args: {
    placement: "right",
  },
};

export const Vasemmalla: Story = {
  render: (args) => (
    <div className="group relative flex items-center p-16">
      <Button size="sm">Vie hiiri päälle</Button>
      <AnchoredTooltip {...args}>Edellinen vaihe</AnchoredTooltip>
    </div>
  ),
  args: {
    placement: "left",
  },
};

export const Ylapuolella: Story = {
  render: (args) => (
    <div className="group relative flex items-center p-16">
      <Button size="sm">Vie hiiri päälle</Button>
      <AnchoredTooltip {...args}>Tärkeä huomautus</AnchoredTooltip>
    </div>
  ),
  args: {
    placement: "top",
  },
};

export const Alapuolella: Story = {
  render: (args) => (
    <div className="group relative flex items-center p-16">
      <Button size="sm">Vie hiiri päälle</Button>
      <AnchoredTooltip {...args}>Avaa lisäasetukset</AnchoredTooltip>
    </div>
  ),
  args: {
    placement: "bottom",
  },
};

export const KaikkiSuunnat: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-16 p-16">
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Oikea</Button>
        <AnchoredTooltip placement="right">Oikealla puolella</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Vasen</Button>
        <AnchoredTooltip placement="left">Vasemmalla puolella</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Ylös</Button>
        <AnchoredTooltip placement="top">Yläpuolella</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Alas</Button>
        <AnchoredTooltip placement="bottom">Alapuolella</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Alas-vasen</Button>
        <AnchoredTooltip placement="bottom-left">Ala-vasen kulma</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Alas-oikea</Button>
        <AnchoredTooltip placement="bottom-right">Ala-oikea kulma</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Ylös-vasen</Button>
        <AnchoredTooltip placement="top-left">Ylä-vasen kulma</AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Ylös-oikea</Button>
        <AnchoredTooltip placement="top-right">Ylä-oikea kulma</AnchoredTooltip>
      </div>
    </div>
  ),
};

export const Variantit: Story = {
  render: () => (
    <div className="flex flex-col gap-16 items-center p-16">
      <div className="group relative flex items-center justify-center">
        <Button size="sm">Oletus</Button>
        <AnchoredTooltip placement="right" variant="default">
          Oletustyyli — yleinen lisätieto
        </AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm" loading>
          Lataa
        </Button>
        <AnchoredTooltip placement="right" variant="button-loading">
          Toiminto käynnissä — odota…
        </AnchoredTooltip>
      </div>
      <div className="group relative flex items-center justify-center">
        <Button size="sm" variant="outline">
          Asema
        </Button>
        <AnchoredTooltip placement="right" variant="station-description">
          Seula — Kynnyksen kauppasatama ja solmupiste.
        </AnchoredTooltip>
      </div>
    </div>
  ),
};

export const Hallittu: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    return (
      <div className="flex flex-col items-center gap-6 p-16">
        <div className="relative flex items-center justify-center">
          <Button size="sm" onClick={() => setOpen((v) => !v)}>
            {open ? "Piilota" : "Näytä"} tooltip
          </Button>
          <AnchoredTooltip placement="right" isOpen={open}>
            Tämä tooltip on hallitusti auki ({open ? "näkyvissä" : "piilotettu"})
          </AnchoredTooltip>
        </div>
      </div>
    );
  },
};
