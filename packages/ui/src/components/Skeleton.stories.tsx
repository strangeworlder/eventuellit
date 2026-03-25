import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Skeleton, SkeletonCard, SkeletonText } from "./Skeleton";

const meta = {
    title: "Suunnittelujarjestelma/Atomit/Skeleton",
    component: Skeleton,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
    argTypes: {
        variant: {
            control: "select",
            options: ["block", "circle", "text"],
        },
        theme: {
            control: "select",
            options: [
                undefined,
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
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lohko: Story = {
    args: {
        variant: "block",
        height: 80,
    },
    render: (args) => (
        <div className="w-64">
            <Skeleton {...args} />
        </div>
    ),
};

export const Ympyra: Story = {
    args: {
        variant: "circle",
        width: 48,
        height: 48,
    },
};

export const Teksti: Story = {
    args: {
        variant: "text",
    },
    render: (args) => (
        <div className="w-64">
            <Skeleton {...args} />
        </div>
    ),
};

export const TekstiLohko: Story = {
    render: () => (
        <div className="w-80">
            <SkeletonText lines={4} lastLineShort />
        </div>
    ),
};

export const TekstiLohkoTäysi: Story = {
    render: () => (
        <div className="w-80">
            <SkeletonText lines={3} lastLineShort={false} />
        </div>
    ),
};

export const Kortti: Story = {
    render: () => (
        <div className="flex flex-col gap-4 w-80">
            <SkeletonCard withHeader />
            <SkeletonCard withHeader={false} />
        </div>
    ),
};

export const KaikkiVariantit: Story = {
    tags: ["!manifest"],
    render: () => (
        <div className="flex flex-col gap-8 max-w-sm">
            <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-text-subtle">Lohko</p>
                <Skeleton variant="block" height={64} />
            </div>
            <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-text-subtle">Ympyrä</p>
                <div className="flex gap-3 items-center">
                    <Skeleton variant="circle" width={32} height={32} />
                    <Skeleton variant="circle" width={48} height={48} />
                    <Skeleton variant="circle" width={64} height={64} />
                </div>
            </div>
            <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-text-subtle">Teksti</p>
                <SkeletonText lines={3} />
            </div>
            <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-text-subtle">Kortti</p>
                <SkeletonCard />
            </div>
        </div>
    ),
};
