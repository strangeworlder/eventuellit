import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { HudPanel } from "./HudPanel";
import { Text } from "./Text";

const meta: Meta<typeof HudPanel> = {
  title: "Suunnittelujarjestelma/Konsoli/HudPanel",
  component: HudPanel,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "alert", "locked"],
    },
    compact: { control: "boolean" },
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
        "royal",
        "royal-dark",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof HudPanel>;

export const Perus: Story = {
  args: {
    headerCode: "KANSI-02 // HYTTI-B3",
    title: "Miehistöhytti",
    statusSlot: <Badge variant="outline">Varattu</Badge>,
    children: (
      <Text variant="small">
        Seinän nelivärinäyttö rätisee hiljaa. Työpöydälle on pultattu muistikirja ja messinkinen
        taskulamppu.
      </Text>
    ),
  },
};

export const KaikkiTilat: Story = {
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6 max-w-4xl">
      <HudPanel
        variant="default"
        headerCode="KANSI-01 // SILTA"
        title="Peruskehys"
        statusSlot={<Badge variant="outline">Toiminnassa</Badge>}
      >
        <Text variant="small">Vakiotason alusjärjestelmän paneeli.</Text>
      </HudPanel>
      <HudPanel
        variant="accent"
        headerCode="OMISTUS // PJ-LUKITTU"
        title="Korostettu kehys"
        statusSlot={
          <Badge variant="highlight" icon="lock">
            Lukittu
          </Badge>
        }
      >
        <Text variant="small">Pelinjohtajan pelimekaanisella huomiolla lukittu osio.</Text>
      </HudPanel>
      <HudPanel
        variant="alert"
        headerCode="KANSI-03 // KONEHUONE"
        title="Hälytysvaste"
        statusSlot={<Badge variant="solid">Vaurio</Badge>}
      >
        <Text variant="small">Navigointikilpien diagnostiikka ilmoittaa ylikuormituksesta.</Text>
      </HudPanel>
      <HudPanel
        variant="locked"
        headerCode="KANSI-04 // SINETÖITY"
        title="Suljettu osasto"
        statusSlot={<Badge variant="ghost">Paineistamaton</Badge>}
        footer={<Text variant="caption">Avaaminen edellyttää laipion ohituskoodia.</Text>}
      >
        <Text variant="muted" className="text-sm">
          Osaston telemetria ei ole käytettävissä.
        </Text>
      </HudPanel>
    </div>
  ),
};
