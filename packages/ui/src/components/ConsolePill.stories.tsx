import type { Meta, StoryObj } from "@storybook/react";
import { ConsolePill } from "./ConsolePill";

const meta: Meta<typeof ConsolePill> = {
  title: "Suunnittelujarjestelma/Konsoli/ConsolePill",
  component: ConsolePill,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConsolePill>;

export const Pillerit: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 p-4">
      <ConsolePill tone="secondary" icon="compass">
        Aamunkoi
      </ConsolePill>
      <ConsolePill tone="alert" icon="shield-alert">
        Kilvet vajaateholla
      </ConsolePill>
      <ConsolePill tone="accent" icon="lock">
        Kansi 4 sinetöity
      </ConsolePill>
      <ConsolePill tone="neutral" active onClick={() => {}}>
        Kansi 2 · Asuinkannet
      </ConsolePill>
    </div>
  ),
};
