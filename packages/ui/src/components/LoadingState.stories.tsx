import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LoadingState } from "./LoadingState";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/LoadingState",
  component: LoadingState,
  parameters: {
    layout: "centered",
  },
  args: {
    message: "Ladataan tietoja...",
    size: "default",
    layout: "inline",
  },
} satisfies Meta<typeof LoadingState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {};

export const Pehmustettu: Story = {
  args: {
    message: "Ladataan hahmoa...",
    size: "large",
    layout: "padded",
  },
};
