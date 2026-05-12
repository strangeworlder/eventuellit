import type { Meta, StoryObj } from "@storybook/react";
import { CountdownDisplay } from "./CountdownDisplay";

const future2h = new Date(Date.now() + 2 * 3600 * 1000).toISOString();
const future3d = new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString();
const past = new Date(Date.now() - 1000).toISOString();

const meta: Meta<typeof CountdownDisplay> = {
  title: "Suunnittelujarjestelma/Atomit/CountdownDisplay",
  component: CountdownDisplay,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "compact"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof CountdownDisplay>;

export const Normaali: Story = {
  args: {
    deadline: future3d,
  },
};

export const Kiireellinen: Story = {
  name: "Kiireellinen (alle 24 t)",
  args: {
    deadline: future2h,
  },
};

export const Paattynyt: Story = {
  name: "Päättynyt",
  args: {
    deadline: past,
  },
};

export const Kompakti: Story = {
  args: {
    deadline: future3d,
    size: "compact",
  },
};

export const KaikkiTilat: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <CountdownDisplay deadline={future3d} />
      <CountdownDisplay deadline={future2h} />
      <CountdownDisplay deadline={past} />
      <div className="flex gap-4">
        <CountdownDisplay deadline={future3d} size="compact" />
        <CountdownDisplay deadline={future2h} size="compact" />
        <CountdownDisplay deadline={past} size="compact" />
      </div>
    </div>
  ),
};
