import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./Accordion";
import { Text } from "./Text";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Accordion",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
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
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  render: () => (
    <Accordion className="max-w-md">
      <AccordionItem defaultOpen>
        <AccordionTrigger>
          <span className="text-[var(--theme-text)] font-bold text-sm uppercase tracking-widest">
            Ensimmäinen osio
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <Text variant="muted">
            Tämä on sisältöä, joka näkyy, kun osio on avattu. Kontrasti noudattaa teeman
            tekstihierarkiaa.
          </Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const UseitaOsioita: Story = {
  render: () => (
    <Accordion className="max-w-md space-y-3">
      <AccordionItem defaultOpen>
        <AccordionTrigger>
          <span className="text-[var(--theme-text)] font-bold text-sm uppercase tracking-widest">
            Sessio 01
          </span>
        </AccordionTrigger>
        <AccordionContent className="space-y-2 p-4">
          <Text variant="muted">Lukemisto ja tehtävät tälle sessiolle.</Text>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem>
        <AccordionTrigger>
          <span className="text-[var(--theme-text)] font-bold text-sm uppercase tracking-widest">
            Sessio 02
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <Text variant="muted">Toinen sessio suljettuna oletuksena.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const HaamuVariantti: Story = {
  render: () => (
    <Accordion className="max-w-md">
      <AccordionItem variant="ghost" defaultOpen>
        <AccordionTrigger>
          <Text variant="kicker" className="border-0 pt-0 pb-0">
            Jakson yleiset kohteet (3)
          </Text>
        </AccordionTrigger>
        <AccordionContent className="space-y-2 pt-2">
          <Text variant="muted">Hiljainen reunus, ei erillistä kehystä.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const OhjattuTila: Story = {
  render: function OhjattuTilaRender() {
    const [open, setOpen] = useState(false);
    return (
      <div className="max-w-md space-y-4">
        <Accordion>
          <AccordionItem open={open} onOpenChange={setOpen}>
            <AccordionTrigger>
              <span className="text-[var(--theme-text)] font-bold text-sm uppercase tracking-widest">
                Ulkoinen tila ({open ? "avoin" : "kiinni"})
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <Text variant="muted">Tilan hallitsee yläkomponentti.</Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  },
};

export const PoissaKaytosta: Story = {
  render: () => (
    <Accordion className="max-w-md">
      <AccordionItem>
        <AccordionTrigger disabled>
          <span className="text-[var(--theme-text)] font-bold text-sm uppercase tracking-widest">
            Ei avattavissa
          </span>
        </AccordionTrigger>
        <AccordionContent className="p-4">
          <Text variant="muted">Tätä ei pitäisi nähdä.</Text>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
