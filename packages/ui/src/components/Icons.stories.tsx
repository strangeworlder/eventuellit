import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Icon, icons } from "./Icon";
import { DiceIcon } from "./DiceIcon";
import "../styles.css";

/**
 * The icon system provides a consistent visual language for actions, navigation, and game concepts.
 * We primarily use **Lucide React** for general UI icons, supplemented by specialized game icons.
 * 
 * ### Usage Guidelines
 * - **Size**: Standard UI icons should typically be 16px or 20px. Larger sizes (32px+) are reserved for cards or headers.
 * - **Color**: Icons should inherit the current text color (`currentColor`) or follow the `iconVariant` patterns.
 * - **Context**: Only use icons when they add clarity. Don't use them for every single menu item unless necessary.
 */
const meta = {
    title: "Suunnittelujarjestelma/Perustat/Icons",
    parameters: {
        layout: "fullscreen",
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const iconUsage: Record<string, string> = {
    sparkles: "Magic, special effects, or leveling up.",
    dice5: "Game mechanics, random rolls, or luck-based actions.",
    book: "Rules, lore, journal entries, or inventory.",
    "chevron-left": "Navigating back or to the previous item.",
    "chevron-right": "Navigating forward or to the next item.",
    minus: "Decrementing values, removing items, or negative modifiers.",
    plus: "Incrementing values, adding items, or positive modifiers.",
    zap: "Energy, speed, quick actions, or electrical effects.",
};

/**
 * The complete gallery of available icons in the system.
 */
export const Gallery: Story = {
    render: () => (
        <div className="min-h-screen bg-black text-white font-sans flex flex-col">
            {/* Header section matching Themes.stories.tsx */}
            <div
                className="p-8 tablet:p-16 border-b border-white/10"
                style={{ backgroundColor: "var(--color-background)", color: "var(--color-text)" }}
            >
                <h1 className="text-5xl font-extrabold font-heading mb-4">Icons</h1>
                <p className="text-xl max-w-3xl opacity-80 leading-relaxed">
                    Our icon set is based on Lucide React and follows a clean, geometric aesthetic.
                    Use icons to provide visual cues and enhance the user interface.
                </p>
            </div>

            <div className="p-8 tablet:p-16 flex flex-col gap-20">
                {/* General UI Icons */}
                <section>
                    <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-3xl font-heading font-black">General UI Icons</h2>
                        <p className="opacity-60">Standard functional icons for navigation and control.</p>
                    </div>

                    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 x-wide:grid-cols-4 gap-6">
                        {Object.keys(icons).map((name) => (
                            <div
                                key={name}
                                className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-accent-500/50 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-4 rounded-xl bg-accent-500/10 text-accent-400 group-hover:scale-110 transition-transform">
                                        <Icon name={name as any} size={32} />
                                    </div>
                                    <code className="text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded">
                                        {name}
                                    </code>
                                </div>

                                <h3 className="text-lg font-heading font-bold mb-2 capitalize">
                                    {name.replace("-", " ")}
                                </h3>

                                <p className="text-sm opacity-70 leading-snug min-h-[3rem]">
                                    {iconUsage[name] || "No description available."}
                                </p>

                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-wider opacity-40">Usage</span>
                                        <code className="text-[11px] bg-black/20 px-2 py-1 rounded">
                                            {`<Icon name="${name}" />`}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Specialized Icons */}
                <section>
                    <div className="flex flex-col gap-2 mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-3xl font-heading font-black">Specialized Icons</h2>
                        <p className="opacity-60">Domain-specific components for game mechanics.</p>
                    </div>

                    <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 x-wide:grid-cols-4 gap-6">
                        {([4, 6, 8, 10, 12, 20] as const).map((faces) => (
                            <div
                                key={faces}
                                className="flex flex-col p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-secondary-500/50 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 rounded-xl bg-secondary-500/10 text-secondary-400 group-hover:scale-110 transition-transform">
                                        <DiceIcon faces={faces} size="lg" />
                                    </div>
                                    <code className="text-xs opacity-50 font-mono bg-black/30 px-2 py-1 rounded">
                                        d{faces}
                                    </code>
                                </div>

                                <h3 className="text-lg font-heading font-bold mb-2">
                                    D{faces} Die
                                </h3>

                                <p className="text-sm opacity-70 leading-snug">
                                    Visual representation of a {faces}-sided die. Used in dice pools and roll results.
                                </p>

                                <div className="mt-6 pt-4 border-t border-white/5 flex gap-3">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] uppercase tracking-wider opacity-40">Usage</span>
                                        <code className="text-[11px] bg-black/20 px-2 py-1 rounded">
                                            {`<DiceIcon faces={${faces}} />`}
                                        </code>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Technical Implementation */}
                <section className="p-8 rounded-3xl bg-gradient-to-br from-primary-900/40 to-secondary-900/40 border border-white/10">
                    <h2 className="text-2xl font-heading font-bold mb-4 italic">Adding New Icons</h2>
                    <p className="opacity-80 mb-6">
                        To add a new icon to the design system, import it from <code className="text-accent-300">lucide-react</code> in
                        <code className="text-accent-300"> Icon.tsx</code> and add it to the <code className="text-accent-300">icons</code> object.
                    </p>
                    <div className="bg-black/40 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                        <pre className="text-blue-300">
                            {`// packages/ui/src/components/Icon.tsx
export const icons = {
  // ... existing icons
  "new-icon": NewLucideIcon,
} as const;`}
                        </pre>
                    </div>
                </section>
            </div>
        </div>
    ),
};
