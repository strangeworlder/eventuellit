import type { Meta, StoryObj } from "@storybook/react";
import { List, ListItem } from "./List";

const meta = {
    title: "Suunnittelujarjestelma/Komponentit/List",
    component: List,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unordered: Story = {
    args: {
        as: "ul",
    },
    render: (args) => (
        <List {...args}>
            <ListItem>First item</ListItem>
            <ListItem>Second item</ListItem>
            <ListItem>Third item</ListItem>
        </List>
    ),
};

export const Ordered: Story = {
    args: {
        as: "ol",
    },
    render: (args) => (
        <List {...args}>
            <ListItem>First step</ListItem>
            <ListItem>Second step</ListItem>
            <ListItem>Third step</ListItem>
        </List>
    ),
};

export const Unbulleted: Story = {
    args: {
        as: "ul",
        variant: "unbulleted",
    },
    render: (args) => (
        <List {...args}>
            <ListItem>Item without bullets</ListItem>
            <ListItem>Another item</ListItem>
        </List>
    ),
};
