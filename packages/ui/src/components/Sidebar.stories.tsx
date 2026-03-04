import type { Meta, StoryObj } from "@storybook/react";
import { BookOpen, Dice5, LogOut, Settings, UserCircle } from "lucide-react";
import { Heading } from "./Heading";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarItem } from "./Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="h-screen bg-background border border-border rounded-lg overflow-hidden flex">
        <Story />
        <div className="flex-1 p-8 text-text">
          <Heading as="h1">Main Content Area</Heading>
          <p className="mt-4 text-text-muted">
            This is to demonstrate how the sidebar looks next to content.
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sidebar>
      <SidebarHeader>
        <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
          E
        </div>
        <Heading as="h4" className="ml-3 truncate">
          Eventuellit
        </Heading>
      </SidebarHeader>

      <SidebarContent>
        <SidebarItem icon={<Dice5 size={20} />} active>
          Hahmogeneraattori
        </SidebarItem>
        <SidebarItem icon={<BookOpen size={20} />}>Sääntökirja</SidebarItem>
        <div className="my-4 border-t border-border mx-2" />
        <SidebarItem icon={<UserCircle size={20} />}>Hahmot</SidebarItem>
        <SidebarItem icon={<Settings size={20} />}>Asetukset</SidebarItem>
      </SidebarContent>

      <SidebarFooter>
        <SidebarItem
          icon={<LogOut size={20} />}
          className="text-secondary/80 hover:text-secondary hover:bg-secondary/10"
        >
          Kirjaudu ulos
        </SidebarItem>
      </SidebarFooter>
    </Sidebar>
  ),
};

export const Collapsed: Story = {
  render: () => (
    <Sidebar defaultExpanded={false}>
      <SidebarHeader>
        <div className="w-8 h-8 rounded bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
          E
        </div>
        <Heading as="h4" className="ml-3 truncate">
          Eventuellit
        </Heading>
      </SidebarHeader>

      <SidebarContent>
        <SidebarItem icon={<Dice5 size={20} />} active>
          Hahmogeneraattori
        </SidebarItem>
        <SidebarItem icon={<BookOpen size={20} />}>Sääntökirja</SidebarItem>
        <div className="my-4 border-t border-border mx-2" />
        <SidebarItem icon={<UserCircle size={20} />}>Hahmot</SidebarItem>
        <SidebarItem icon={<Settings size={20} />}>Asetukset</SidebarItem>
      </SidebarContent>

      <SidebarFooter>
        <SidebarItem
          icon={<LogOut size={20} />}
          className="text-secondary/80 hover:text-secondary hover:bg-secondary/10"
        >
          Kirjaudu ulos
        </SidebarItem>
      </SidebarFooter>
    </Sidebar>
  ),
};
