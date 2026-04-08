import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Drawer } from "./Drawer";
import { Heading, HeadingLevelProvider } from "./Heading";
import { type SkillTagItem, SkillTagList } from "./SkillTagList";

const meta = {
  title: "Suunnittelujarjestelma/Organismit/Drawer",
  component: Drawer,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-background text-text">
        <HeadingLevelProvider>
          <div className="p-8 border-b border-border">
            <Heading as="h1">Pääsisältö</Heading>
            <p className="mt-4 text-text-muted">
              Tämä esittää, miltä Drawer näyttää sisällön vieressä.
            </p>
          </div>
          <Story />
          <div className="p-8">
            <p className="text-text-muted">Lisää sisältöä drawerin alla.</p>
          </div>
        </HeadingLevelProvider>
      </div>
    ),
  ],
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const demoSkills: SkillTagItem[] = [
  { id: 1, name: "Hylkyjen Tutkija" },
  { id: 2, name: "Hinauslaivan Pilotti" },
  { id: 3, name: "Lääkäri" },
];

const expandedDemoSkills: SkillTagItem[] = [
  ...demoSkills,
  { id: 4, name: "Byrokraatti" },
  { id: 5, name: "Murtovaras" },
];

export const Default: Story = {
  args: {
    title: "Pelinjohtajan Työkalut",
  },
  render: (args) => (
    <Drawer title={args.title}>
      <div className="space-y-3">
        <Heading>Toiminnot</Heading>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Muokkaa
          </Button>
          <Button variant="danger" size="sm">
            Poista
          </Button>
          <Button size="sm">Luo Uusi</Button>
        </div>
      </div>
      <div className="space-y-3">
        <Heading>Taidot</Heading>
        <SkillTagList items={demoSkills} readOnly />
      </div>
    </Drawer>
  ),
};

export const Expanded: Story = {
  args: {
    title: "Pelinjohtajan Työkalut",
    defaultExpanded: true,
  },
  render: (args) => (
    <Drawer title={args.title} defaultExpanded={args.defaultExpanded}>
      <div className="space-y-3">
        <Heading>Toiminnot</Heading>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            Muokkaa
          </Button>
          <Button variant="danger" size="sm">
            Poista
          </Button>
          <Button size="sm">Luo Uusi</Button>
        </div>
      </div>
      <div className="space-y-3">
        <Heading>Taidot</Heading>
        <SkillTagList items={expandedDemoSkills} readOnly />
      </div>
    </Drawer>
  ),
};
