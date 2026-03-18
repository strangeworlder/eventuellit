import type { Meta, StoryObj } from "@storybook/react";
import { VideoCta } from "./VideoCta";

const meta = {
  title: "Components/VideoCta",
  component: VideoCta,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  argTypes: {
    onClickCta: { action: "cta clicked" },
  },
} satisfies Meta<typeof VideoCta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    youtubeId: "I6QePHTGGqU",
    title: "Eventuellit – Kutsu kapinaan staattisuutta vastaan",
    ctaText: "Lue säännöt",
    onClickCta: () => {},
  },
  render: (args) => (
    <div className="max-w-4xl mx-auto w-full">
      <VideoCta {...args} />
    </div>
  ),
};
