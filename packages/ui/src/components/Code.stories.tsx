import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Code } from "./Code";
import { Text } from "./Text";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Code",
  component: Code,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["inline", "kbd"],
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
} satisfies Meta<typeof Code>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Koodi: Story = {
  args: {
    variant: "inline",
    children: "noppaPooli.heitä()",
  },
  render: (args) => (
    <Text>
      Kutsu <Code {...args} /> aloittaaksesi kierroksen.
    </Text>
  ),
};

export const NappainKomento: Story = {
  args: {
    variant: "kbd",
    children: "Enter",
  },
  render: (args) => (
    <Text>
      Vahvista valintasi painamalla <Code {...args} />.
    </Text>
  ),
};

export const Moninainen: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-md">
      <Text>
        Suorita komento <Code variant="inline">npm run dev</Code> käynnistääksesi palvelimen.
      </Text>
      <Text>
        Tallenna tiedosto painamalla <Code variant="kbd">Ctrl</Code> <Code variant="kbd">S</Code>.
      </Text>
      <Text>
        Polku on <Code variant="inline">/apps/host/src/index.tsx</Code>.
      </Text>
    </div>
  ),
};

export const Teemat: Story = {
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="grid grid-cols-1 mobile:grid-cols-2 gap-6">
      {(
        [
          "base",
          "inverted",
          "primary-light",
          "primary-dark",
          "secondary-light",
          "secondary-dark",
          "accent-light",
          "accent-dark",
        ] as const
      ).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="p-4 rounded-lg bg-[var(--theme-bg)] border border-[var(--theme-border-soft)]"
        >
          <Text variant="caption" className="mb-2">
            {theme}
          </Text>
          <div className="flex flex-wrap gap-2">
            <Code variant="inline" theme={theme}>
              muuttuja
            </Code>
            <Code variant="kbd" theme={theme}>
              Esc
            </Code>
          </div>
        </div>
      ))}
    </div>
  ),
};
