import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import "../styles.css";

const meta = {
  title: "Design System/Themes",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const themes = [
  { id: "base", name: "Base" },
  { id: "inverted", name: "Inverted" },
  { id: "primary-light", name: "Primary Light" },
  { id: "primary-dark", name: "Primary Dark" },
  { id: "secondary-light", name: "Secondary Light" },
  { id: "secondary-dark", name: "Secondary Dark" },
  { id: "accent-light", name: "Accent Light" },
  { id: "accent-dark", name: "Accent Dark" },
];

const ThemeShowcase = ({ themeId, themeName }: { themeId: string; themeName: string }) => {
  return (
    <div data-theme={themeId} className="w-full flex">
      {/* The wrapper sets the data-theme attribute, cascading properties down to children */}
      <div
        className="w-full p-8 md:p-16 flex flex-col md:flex-row gap-8 transition-colors duration-200"
        style={{ backgroundColor: "var(--theme-bg)", color: "var(--theme-text)" }}
      >
        {/* Info Block */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold font-heading tracking-tight mb-2">
            {themeName} Example
          </h2>
          <p className="text-lg opacity-80 max-w-lg mb-8">
            This block renders using the `{themeId}` data-theme context. Variables map to dynamic
            foreground/background combinations that are mathematically validated to WCAG 2.1 AA
            specifications.
          </p>
          <div className="flex flex-col gap-2 font-mono text-sm opacity-60">
            <span>bg-surface</span>
            <span>text-foreground</span>
          </div>
        </div>

        {/* Example Semantic Components */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Primary semantic */}
          <div
            className="p-6 rounded-xl border border-white/10 shadow-sm flex flex-col gap-3"
            style={{ backgroundColor: "var(--theme-primary)" }}
          >
            <h3 className="font-heading font-bold text-2xl" style={{ color: "var(--theme-bg)" }}>
              Primary Component
            </h3>
            <p
              className="opacity-90 leading-relaxed"
              style={{ color: "var(--theme-primary-foreground)" }}
            >
              Rendered with `bg-theme-primary text-surface` for the header and
              `text-theme-primary-foreground` for the body text. Notice how the primary action color
              changes contextually depending on what background theme is active so that contrast is
              preserved.
            </p>
          </div>

          {/* Secondary semantic */}
          <div
            className="p-6 rounded-xl border shadow-sm flex flex-col gap-3"
            style={{
              borderColor: "var(--theme-secondary)",
              color: "var(--theme-secondary)",
              backgroundColor: "transparent",
            }}
          >
            <h3 className="font-heading font-bold text-2xl">Secondary Component</h3>
            <p className="opacity-80 leading-relaxed">
              Rendered using `border-theme-secondary text-theme-secondary`. Used for alternative
              interactions and outlines that don't overpower the primary surface.
            </p>
          </div>

          {/* Accent semantic */}
          <div
            className="p-6 rounded-xl shadow-sm flex flex-col gap-3"
            style={{
              backgroundColor: "var(--theme-bg)",
              color: "var(--theme-accent)",
              borderBottom: "4px solid var(--theme-accent)",
            }}
          >
            <h3 className="font-heading font-bold text-2xl flex items-center justify-between">
              <span>Accent Notifier</span>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ backgroundColor: "var(--theme-accent)", color: "var(--theme-bg)" }}
              >
                ACTIVE
              </span>
            </h3>
            <p
              className="opacity-80 text-foreground leading-relaxed"
              style={{ color: "var(--theme-text)" }}
            >
              Rendered using `text-theme-accent border-theme-accent`. Useful for highlighting active
              states or important notifications inside the component tree.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Gallery: Story = {
  render: () => (
    <div className="min-h-screen bg-black text-white font-sans flex flex-col">
      <div
        className="p-8 md:p-16 border-b border-white/10"
        style={{ backgroundColor: "var(--color-background)", color: "var(--color-text)" }}
      >
        <h1 className="text-5xl font-extrabold font-heading mb-4">Contextual Themes</h1>
        <p className="text-xl max-w-3xl opacity-80 leading-relaxed">
          By heavily capitalizing on CSS Variables, we can create robust contextual boundaries using
          a `data-theme` attribute. Tokens such as `bg-surface` or `text-theme-primary` dynamically
          adjust to provide contrasting, highly readable components on any predefined background.
        </p>
      </div>
      <div className="flex flex-col">
        {themes.map((t) => (
          <ThemeShowcase key={t.id} themeId={t.id} themeName={t.name} />
        ))}
      </div>
    </div>
  ),
};
