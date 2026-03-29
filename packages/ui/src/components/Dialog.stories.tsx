import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import { Text } from "./Text";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Dialog",
  component: Dialog,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
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
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  args: { open: false, onClose: () => {}, title: "Vahvista toiminto" },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Avaa dialogi</Button>
        <Dialog open={open} onClose={() => setOpen(false)} title="Vahvista toiminto">
          <Text>Oletko varma, että haluat jatkaa? Tätä toimintoa ei voi peruuttaa.</Text>
        </Dialog>
      </>
    );
  },
};

export const Kuvausella: Story = {
  args: { open: false, onClose: () => {}, title: "Hahmon poistaminen" },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Avaa dialogi kuvauksen kanssa</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Hahmon poistaminen"
          description="Tämä poistaa hahmon pysyvästi kaikista kampanjoista."
        >
          <Text>
            Hahmon <strong>Veera Mäkinen</strong> kaikki tiedot, taidot ja historia poistetaan.
            Tietoja ei voida palauttaa poistamisen jälkeen.
          </Text>
        </Dialog>
      </>
    );
  },
};

export const Alatunniste: Story = {
  args: { open: false, onClose: () => {}, title: "Tallenna muutokset" },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Avaa dialogi alatunnisteella</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Tallenna muutokset"
          description="Tarkista muutokset ennen tallentamista."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Peruuta
              </Button>
              <Button variant="solid" onClick={() => setOpen(false)}>
                Tallenna
              </Button>
            </>
          }
        >
          <Text>
            Olet muuttanut hahmon taitoja. Muutokset astuvat voimaan tallentamisen jälkeen.
          </Text>
        </Dialog>
      </>
    );
  },
};

export const VaarallinenToiminto: Story = {
  args: { open: false, onClose: () => {}, title: "Poista kampanja" },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Poista kampanja
        </Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Poista kampanja"
          description="Tätä toimintoa ei voi peruuttaa."
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Peruuta
              </Button>
              <Button variant="danger" onClick={() => setOpen(false)}>
                Poista pysyvästi
              </Button>
            </>
          }
        >
          <Text>
            Kampanja <strong>Kynnys – Kausi 1</strong> ja kaikki siihen liittyvät hahmot, episodit
            ja tapahtumat poistetaan pysyvästi.
          </Text>
        </Dialog>
      </>
    );
  },
};

export const Koot: Story = {
  args: { open: false, onClose: () => {}, title: "Dialogi" },
  render: () => {
    const [activeSize, setActiveSize] = useState<"sm" | "md" | "lg" | "xl" | null>(null);
    return (
      <div className="flex flex-wrap gap-3">
        {(["sm", "md", "lg", "xl"] as const).map((size) => (
          <Button key={size} variant="outline" onClick={() => setActiveSize(size)}>
            Koko {size.toUpperCase()}
          </Button>
        ))}
        <Dialog
          open={activeSize !== null}
          onClose={() => setActiveSize(null)}
          size={activeSize ?? "md"}
          title={`Dialogi — koko ${(activeSize ?? "md").toUpperCase()}`}
          description="Tämä esittää dialogin leveyden valitulla koolla."
          footer={
            <Button variant="solid" onClick={() => setActiveSize(null)}>
              Sulje
            </Button>
          }
        >
          <Text>
            Tämä dialogi käyttää kokoa <strong>{activeSize ?? "md"}</strong>. Käytä suurempia kokoja
            runsaalle sisällölle, pieniä lyhyille vahvistusikkunoille.
          </Text>
        </Dialog>
      </div>
    );
  },
};

export const IlmanSulkupainiketta: Story = {
  args: { open: false, onClose: () => {}, title: "Pakollinen valinta" },
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Avaa ilman sulkupainiketta</Button>
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          title="Pakollinen valinta"
          description="Sinun täytyy tehdä valinta ennen kuin voit jatkaa."
          hideCloseButton
          footer={
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Peruuta
              </Button>
              <Button variant="solid" onClick={() => setOpen(false)}>
                Vahvista
              </Button>
            </>
          }
        >
          <Text>Taustahistoriasi määrittää aloitusvoimavarasi. Valinta on pysyvä.</Text>
        </Dialog>
      </>
    );
  },
};
