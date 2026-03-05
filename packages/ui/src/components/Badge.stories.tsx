import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
    title: "Components/Badge",
    component: Badge,
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "accent", "outline"],
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
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
    args: {
        variant: "primary",
        children: "Tervetuloa seikkailuun",
        icon: "sparkles",
    },
};

export const Secondary: Story = {
    args: {
        variant: "secondary",
        children: "Sääntökirja",
        icon: "book",
    },
};

export const Accent: Story = {
    args: {
        variant: "accent",
        children: "Hahmopaja",
        icon: "dice5",
    },
};

export const Outline: Story = {
    args: {
        variant: "outline",
        children: "Päivitys saatavilla",
    },
};

export const WithDifferentThemes: Story = {
    render: (args) => (
        <div className="flex flex-col gap-4 p-4">
            <div className="flex gap-2" data-theme="base">
                <Badge {...args} theme="base">Base Theme</Badge>
                <Badge {...args} theme="inverted">Inverted Theme</Badge>
            </div>
            <div className="flex gap-2" data-theme="primary-dark">
                <Badge {...args} theme="primary-dark">Primary Dark</Badge>
                <Badge {...args} theme="secondary-dark">Secondary Dark</Badge>
            </div>
        </div>
    ),
    args: {
        variant: "primary",
        icon: "sparkles",
    },
};
