import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";
import { ConsoleButton } from "./ConsoleButton";
import { ConsoleRow } from "./ConsoleRow";
import { ProgressClock } from "./ProgressClock";

const meta: Meta<typeof ConsoleRow> = {
  title: "Suunnittelujarjestelma/Konsoli/ConsoleRow",
  component: ConsoleRow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConsoleRow>;

export const Tilat: Story = {
  render: () => (
    <div className="space-y-2.5 max-w-lg p-4">
      <ConsoleRow
        statusTone="active"
        code="Hytti B-04 · Oma"
        title="Miehistöhytti B-04"
        subtitle="Kaino Kivi · Teknikko"
        badge={<Badge variant="highlight">Oma hytti</Badge>}
        actions={
          <ConsoleButton variant="secondary" size="compact">
            Avaa
          </ConsoleButton>
        }
      />
      <ConsoleRow
        statusTone="normal"
        code="Projekti · Konehuone"
        title="Keulan navigointikilpien kalibrointi"
        subtitle="Aseta väliaikanoppia (OK 13)"
        leading={
          <ProgressClock segmentsTotal={6} segmentsFilled={2} category="projekti" size="sm" />
        }
        actions={
          <div className="flex items-center gap-1">
            <ConsoleButton variant="outline" size="compact">
              -
            </ConsoleButton>
            <ConsoleButton variant="outline" size="compact">
              +
            </ConsoleButton>
          </div>
        }
      />
      <ConsoleRow
        statusTone="warning"
        code="Harmi · Lepo"
        title="Palovamma vasemmassa käsivarressa"
        subtitle="1 noppa parantaa suoraan"
        badge={<Badge variant="solid">Aktiivinen</Badge>}
      />
      <ConsoleRow
        statusTone="locked"
        code="PJ-lukittu omistus"
        title="Messinkinen tyhjiökompassi"
        subtitle="+1n20 suunnistukseen myrskyssä"
        badge={
          <Badge variant="highlight-solid" icon="lock">
            Lukittu
          </Badge>
        }
      />
    </div>
  ),
};
