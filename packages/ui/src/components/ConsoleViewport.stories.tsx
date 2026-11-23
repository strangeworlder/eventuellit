import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./Badge";
import { ConsoleButton } from "./ConsoleButton";
import { ConsoleDock, ConsoleDockItem } from "./ConsoleDock";
import { ConsolePill } from "./ConsolePill";
import { ConsoleRow } from "./ConsoleRow";
import { ConsoleSheet } from "./ConsoleSheet";
import { ConsoleViewport } from "./ConsoleViewport";

const meta: Meta<typeof ConsoleViewport> = {
  title: "Suunnittelujarjestelma/Konsoli/ConsoleViewport",
  component: ConsoleViewport,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof ConsoleViewport>;

export const Pelikentta: Story = {
  render: () => {
    const [sheetOpen, setSheetOpen] = React.useState(true);
    return (
      <div className="h-screen w-full">
        <ConsoleViewport
          className="h-full"
          stageMode="canvas"
          topBar={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ConsolePill tone="secondary" icon="anchor">
                  Aamunkoi
                </ConsolePill>
                <ConsolePill tone="alert" icon="shield-alert">
                  Suojakilvet vajaateholla
                </ConsolePill>
              </div>
              <ConsolePill tone="neutral" icon="dice5">
                5 / 5 n20
              </ConsolePill>
            </div>
          }
          stage={
            <div className="h-full flex items-center justify-center px-6">
              <div className="text-center font-heading text-sm font-semibold tracking-wide text-text-muted border border-dashed border-[var(--theme-border-medium)] p-8 rounded-[4px]">
                2.5D-poikkileikkaus aluksen rungosta (4 kantta)
              </div>
            </div>
          }
          overlay={
            <ConsoleSheet
              open={sheetOpen}
              headerCode="Kansi 1"
              title="Komentosilta"
              subtitle="Yläkansi"
              statusSlot={<Badge variant="outline">Sensorit toiminnassa</Badge>}
              onClose={() => setSheetOpen(false)}
              footer={
                <div className="flex justify-end">
                  <ConsoleButton variant="primary" size="compact">
                    Tarkastele kelloja
                  </ConsoleButton>
                </div>
              }
            >
              <ConsoleRow
                code="Kansi 1"
                title="Sensoriseinä ja ruoripääte"
                subtitle="Keulaseinän kuusitoistavärinen näyttö piirtää tyhjiöluokan anturiviivat."
              />
            </ConsoleSheet>
          }
          dock={
            <ConsoleDock
              utilityBar={
                <div className="flex items-center gap-1.5">
                  <ConsolePill active onClick={() => setSheetOpen(true)}>
                    Kaikki
                  </ConsolePill>
                  <ConsolePill onClick={() => setSheetOpen(true)}>Kansi 1</ConsolePill>
                  <ConsolePill onClick={() => setSheetOpen(true)}>Kansi 2</ConsolePill>
                </div>
              }
            >
              <ConsoleDockItem
                icon="compass"
                label="Alus"
                active
                onClick={() => setSheetOpen(true)}
              />
              <ConsoleDockItem icon="home" label="Oma hytti" onClick={() => setSheetOpen(true)} />
              <ConsoleDockItem
                icon="dice5"
                label="Väliaika"
                badge="5"
                onClick={() => setSheetOpen(true)}
              />
            </ConsoleDock>
          }
        />
      </div>
    );
  },
};

export const VaaleaTeema: Story = {
  render: () => {
    const [sheetOpen, setSheetOpen] = React.useState(true);
    return (
      <div className="h-screen w-full" data-theme="inverted">
        <ConsoleViewport
          className="h-full"
          theme="inverted"
          stageMode="canvas"
          topBar={
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ConsolePill tone="secondary" icon="anchor">
                  Aamunkoi
                </ConsolePill>
                <span className="font-sans text-xs tablet:text-sm text-text-muted">
                  Asemien välisessä varjossa
                </span>
              </div>
              <ConsolePill tone="neutral" icon="dice5">
                5 / 5 n20
              </ConsolePill>
            </div>
          }
          stage={
            <div className="h-full flex items-center justify-center px-6">
              <div className="text-center font-heading text-sm font-semibold tracking-wide text-text-muted border border-dashed border-[var(--theme-border-medium)] p-8 rounded-[4px]">
                Vaalea nestemäinen tausta ja luettava typografia
              </div>
            </div>
          }
          overlay={
            <ConsoleSheet
              open={sheetOpen}
              headerCode="Kansi 2 · Siipi B"
              title="Hytti B-04"
              statusSlot={<Badge variant="outline">Vapaa</Badge>}
              onClose={() => setSheetOpen(false)}
            >
              <ConsoleRow
                code="Varusteet"
                title="Valoputkisto ja seinäkaappi"
                subtitle="Hytin kalusto on ehjä ja valmiina miehistölle."
              />
            </ConsoleSheet>
          }
          dock={
            <ConsoleDock
              utilityBar={
                <div className="flex items-center gap-1.5">
                  <ConsolePill active onClick={() => setSheetOpen(true)}>
                    Kaikki
                  </ConsolePill>
                  <ConsolePill onClick={() => setSheetOpen(true)}>Kansi 1</ConsolePill>
                </div>
              }
            >
              <ConsoleDockItem
                icon="compass"
                label="Alus"
                active
                onClick={() => setSheetOpen(true)}
              />
              <ConsoleDockItem icon="home" label="Oma hytti" onClick={() => setSheetOpen(true)} />
            </ConsoleDock>
          }
        />
      </div>
    );
  },
};
