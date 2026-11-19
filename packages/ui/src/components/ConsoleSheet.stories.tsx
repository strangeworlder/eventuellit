import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./Badge";
import { ConsoleButton } from "./ConsoleButton";
import { ConsoleRow } from "./ConsoleRow";
import { ConsoleSheet } from "./ConsoleSheet";

const meta: Meta<typeof ConsoleSheet> = {
  title: "Suunnittelujarjestelma/Konsoli/ConsoleSheet",
  component: ConsoleSheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConsoleSheet>;

export const KelluvaIkkuna: Story = {
  render: () => {
    const [open, setOpen] = React.useState(true);
    return (
      <div className="relative h-[540px] w-full overflow-hidden border border-[var(--theme-border-soft)] bg-[var(--theme-bg)]">
        <div className="p-4">
          <ConsoleButton variant="outline" onClick={() => setOpen(true)}>
            Avaa paneeli
          </ConsoleButton>
        </div>
        <ConsoleSheet
          open={open}
          headerCode="Kansi 2 · Siipi B"
          title="Paapuurin miehistösiipi"
          subtitle="24 hyttiä · keskikäytävä"
          statusSlot={<Badge variant="outline">1/24 varattu</Badge>}
          onClose={() => setOpen(false)}
          footer={
            <div className="flex justify-end gap-2">
              <ConsoleButton variant="primary" size="compact">
                Varaa vapaa hytti
              </ConsoleButton>
            </div>
          }
        >
          <ConsoleRow
            statusTone="active"
            code="Hytti B-01"
            title="Miehistöhytti B-01"
            subtitle="Kaino Kivi · Teknikko"
            badge={<Badge variant="highlight">Oma</Badge>}
          />
          <ConsoleRow code="Hytti B-02" title="Miehistöhytti B-02" subtitle="Vapaa perushytti" />
        </ConsoleSheet>
      </div>
    );
  },
};
