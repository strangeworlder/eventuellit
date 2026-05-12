import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SelectionCard, SelectionCardBody, SelectionCardGroup, SelectionCardMeta } from "./SelectionCard";
import { Text } from "./Text";
import { UrgencyIndicator } from "./UrgencyIndicator";

const meta: Meta<typeof SelectionCard> = {
  title: "Suunnittelujarjestelma/Molekyylit/SelectionCard",
  component: SelectionCard,
  tags: ["autodocs"],
  argTypes: {
    selectionState: {
      control: "select",
      options: ["none", "primary", "secondary"],
    },
    locked: { control: "boolean" },
  },
  args: {
    onSelectionChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SelectionCard>;

// ─── Sample content using the new grid-zone sub-components ──────────────────

interface SampleProps {
  urgency?: "kriittinen" | "normaali" | "joustava";
  selectionState?: "none" | "primary" | "secondary";
  title?: string;
  description?: string;
}

function SampleCardContent({
  urgency = "normaali",
  selectionState = "none",
  title = "Operaatio Havannapalo",
  description = "Tunkeutuminen Syntetiikan valvontaasemalle ennen aamunkoittoa.",
}: SampleProps) {
  return (
    <>
      {/* meta row: UrgencyIndicator (start) + selection badge (end), grid-aligned */}
      <SelectionCardMeta selectionState={selectionState}>
        <UrgencyIndicator urgency={urgency} size="compact" />
      </SelectionCardMeta>

      {/* body row: title + description */}
      <SelectionCardBody>
        <Text variant="label" className="font-bold">{title}</Text>
        <Text variant="muted" className="text-sm">{description}</Text>
      </SelectionCardBody>
    </>
  );
}

export const EiValittu: Story = {
  name: "Ei valittu",
  args: {
    selectionState: "none",
    cardId: "card-1",
    children: <SampleCardContent selectionState="none" />,
  },
};

export const Ensisijainen: Story = {
  args: {
    selectionState: "primary",
    cardId: "card-1",
    children: <SampleCardContent selectionState="primary" />,
  },
};

export const Toissijainen: Story = {
  args: {
    selectionState: "secondary",
    cardId: "card-1",
    children: <SampleCardContent selectionState="secondary" />,
  },
};

export const Lukittu: Story = {
  args: {
    selectionState: "primary",
    locked: true,
    cardId: "card-1",
    children: <SampleCardContent selectionState="primary" />,
  },
};

// ─── Group demo ─────────────────────────────────────────────────────────────

function GroupDemo() {
  const [value, setValue] = React.useState<{ primary: string | null; secondary: string | null }>({
    primary: null,
    secondary: null,
  });

  const options = [
    { id: "op-1", title: "Operaatio Havannapalo", urgency: "kriittinen" as const, description: "Tunkeutuminen Syntetiikan valvontaasemalle." },
    { id: "op-2", title: "Operaatio Harmaasumu", urgency: "normaali" as const, description: "Salainen tapaaminen Kynnys-asemalla." },
    { id: "op-3", title: "Operaatio Rautaverho", urgency: "joustava" as const, description: "Pitkän aikavälin tiedustelutehtävä." },
  ];

  const getState = (id: string): "primary" | "secondary" | "none" =>
    value.primary === id ? "primary" : value.secondary === id ? "secondary" : "none";

  return (
    <div className="p-4 space-y-4">
      <p className="text-xs text-[var(--theme-text-subtle)] font-heading uppercase tracking-widest">
        Ensisijainen: {value.primary ?? "—"} · Toissijainen: {value.secondary ?? "—"}
      </p>
      <SelectionCardGroup value={value} onValueChange={setValue}>
        {options.map((opt) => (
          <SelectionCard key={opt.id} cardId={opt.id}>
            <SelectionCardMeta selectionState={getState(opt.id)}>
              <UrgencyIndicator urgency={opt.urgency} size="compact" />
            </SelectionCardMeta>
            <SelectionCardBody>
              <Text variant="label" className="font-bold">{opt.title}</Text>
              <Text variant="muted" className="text-sm">{opt.description}</Text>
            </SelectionCardBody>
          </SelectionCard>
        ))}
      </SelectionCardGroup>
    </div>
  );
}

export const Ryhmassa: Story = {
  name: "Ryhmässä (SelectionCardGroup)",
  render: () => <GroupDemo />,
};

export const RyhmaLukittu: Story = {
  name: "Ryhmä lukittu",
  render: () => (
    <SelectionCardGroup
      value={{ primary: "op-1", secondary: "op-2" }}
      onValueChange={() => {}}
      disabled
    >
      {(["op-1", "op-2", "op-3"] as const).map((id, i) => (
        <SelectionCard key={id} cardId={id}>
          <SelectionCardMeta selectionState={i === 0 ? "primary" : i === 1 ? "secondary" : "none"}>
            <UrgencyIndicator urgency={i === 0 ? "kriittinen" : "normaali"} size="compact" />
          </SelectionCardMeta>
          <SelectionCardBody>
            <Text variant="label" className="font-bold">Operaatio {i + 1}</Text>
          </SelectionCardBody>
        </SelectionCard>
      ))}
    </SelectionCardGroup>
  ),
};
