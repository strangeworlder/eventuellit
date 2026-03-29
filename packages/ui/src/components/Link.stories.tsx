import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter } from "react-router-dom";
import { Link } from "./Link";
import { Text } from "./Text";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Link",
  component: Link,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    href: "#",
    children: "Click here for more information",
  },
};

export const External: Story = {
  args: {
    href: "https://example.com",
    external: true,
    children: "External Link",
  },
};

export const InlineText: Story = {
  render: () => (
    <Text>
      This is a paragraph with an <Link href="#">inline link</Link> inside of it to demonstrate text
      flow.
    </Text>
  ),
};
