import type { Meta, StoryObj } from "@storybook/react";
import { Hero } from "./Hero";
import "../styles.css";

const meta = {
    title: "Suunnittelujarjestelma/Komponentit/Hero",
    component: Hero,
    parameters: {
        layout: "padded",
    },
    argTypes: {
        title: {
            control: "text",
        },
        description: {
            control: "text",
        },
    },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: "Page Title",
        description: "Optional description for the page goes here.",
        children: <p className="text-text/80">Here is some additional content that would go inside or below the Hero header.</p>,
    },
};

export const WithoutDescription: Story = {
    args: {
        title: "Settings",
    },
};
