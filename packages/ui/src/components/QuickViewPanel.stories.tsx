import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { QuickViewPanel } from "./QuickViewPanel";
import { Button } from "./Button";
import { Stack } from "./Layout";
import { Text } from "./Text";
import { Badge } from "./Badge";

const meta: Meta<typeof QuickViewPanel> = {
  title: "Suunnittelujarjestelma/Organismit/QuickViewPanel",
  component: QuickViewPanel,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  argTypes: {
    size: {
      control: "select",
      options: ["md", "lg"],
    },
    theme: {
      control: "select",
      options: [
        "base",
        "inverted",
        "primary-light",
        "primary-dark",
        "secondary-light",
        "secondary-dark",
        "accent-light",
        "accent-dark",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof QuickViewPanel>;

const ControlledPanel = (props: Partial<React.ComponentProps<typeof QuickViewPanel>>) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="p-6">
      <Button onClick={() => setOpen(true)}>Avaa paneeli</Button>
      <QuickViewPanel
        open={open}
        onClose={() => setOpen(false)}
        title={props.title ?? "Hahmon tiedot"}
        subtitle={props.subtitle}
        size={props.size}
        theme={props.theme}
        footer={
          props.footer ?? (
            <Button variant="ghost-subtle" onClick={() => setOpen(false)}>
              Sulje
            </Button>
          )
        }
      >
        {props.children ?? (
          <Stack direction="column" gap={4}>
            <Text variant="muted">Tähän tulee hahmon kuvaus ja tiedot.</Text>
            <Badge variant="outline">Ratasvartio</Badge>
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Kynnyksen kanavilla liikkuu
              paljon sellaisia, joista on parempi pysyä erossa.
            </Text>
          </Stack>
        )}
      </QuickViewPanel>
    </div>
  );
};

export const Default: Story = {
  render: () => <ControlledPanel title="Komentaja Harvis" subtitle="Ratasvartio · KW-konsortio" />,
};

export const LargeSize: Story = {
  render: () => (
    <ControlledPanel
      title="Profeetta Vaino"
      subtitle="Pyhän Tragedian lapset · Ekklesia"
      size="lg"
    />
  ),
};

export const WithFooterActions: Story = {
  render: () => (
    <ControlledPanel
      title="Hahmo: Vera Hiekkanen"
      subtitle="Tuhkan puolue"
      footer={
        <Stack gap={2}>
          <Button variant="ghost-subtle">Sulje</Button>
          <Button variant="solid">Avaa sivu</Button>
        </Stack>
      }
    />
  ),
};
