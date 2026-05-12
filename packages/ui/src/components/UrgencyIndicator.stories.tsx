import type { Meta, StoryObj } from "@storybook/react";
import { UrgencyIndicator } from "./UrgencyIndicator";

const meta: Meta<typeof UrgencyIndicator> = {
  title: "Suunnittelujarjestelma/Atomit/UrgencyIndicator",
  component: UrgencyIndicator,
  tags: ["autodocs"],
  argTypes: {
    urgency: {
      control: "select",
      options: ["kriittinen", "normaali", "joustava"],
    },
    size: {
      control: "select",
      options: ["default", "compact"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof UrgencyIndicator>;

export const Kriittinen: Story = {
  name: "Aikakriittinen",
  args: {
    urgency: "kriittinen",
  },
};

export const Normaali: Story = {
  args: {
    urgency: "normaali",
  },
};

export const Joustava: Story = {
  args: {
    urgency: "joustava",
  },
};

export const Kompakti: Story = {
  args: {
    urgency: "kriittinen",
    size: "compact",
  },
};

export const KaikkiTasot: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-wrap gap-3">
        <UrgencyIndicator urgency="kriittinen" />
        <UrgencyIndicator urgency="normaali" />
        <UrgencyIndicator urgency="joustava" />
      </div>
      <div className="flex flex-wrap gap-3">
        <UrgencyIndicator urgency="kriittinen" size="compact" />
        <UrgencyIndicator urgency="normaali" size="compact" />
        <UrgencyIndicator urgency="joustava" size="compact" />
      </div>
    </div>
  ),
};
