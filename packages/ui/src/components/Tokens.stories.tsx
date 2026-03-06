import type { Meta, StoryObj } from "@storybook/react";

const meta = {
  title: "Design System/Tokens",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Breakpoints defined in styles.css
const breakpoints = {
  mobile: "640px",
  tablet: "768px",
  desktop: "1024px",
  "x-wide": "1280px",
};

// Spacing scale from Tailwind CSS v4 defaults + custom overrides if any
const spacingScale = {
  "0": "0px",
  px: "1px",
  "0.5": "0.125rem (2px)",
  "1": "0.25rem (4px)",
  "1.5": "0.375rem (6px)",
  "2": "0.5rem (8px)",
  "2.5": "0.625rem (10px)",
  "3": "0.75rem (12px)",
  "3.5": "0.875rem (14px)",
  "4": "1rem (16px)",
  "5": "1.25rem (20px)",
  "6": "1.5rem (24px)",
  "8": "2rem (32px)",
  "10": "2.5rem (40px)",
  "12": "3rem (48px)",
  "16": "4rem (64px)",
  "20": "5rem (80px)",
  "24": "6rem (96px)",
  "32": "8rem (128px)",
};

// Border radius scale
const radiusScale = {
  none: "0px",
  sm: "0.125rem",
  DEFAULT: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  "3xl": "1.5rem",
  full: "9999px",
};

export const Breakpoints: Story = {
  render: () => (
    <div className="space-y-8 flex flex-col font-sans">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-4">Breakpoints</h2>
        <p className="opacity-80 mb-6 max-w-prose">
          These are the standard breakpoints defined in our Design System. Use them as prefixes in
          your Tailwind classes to apply responsive styles (e.g.,{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">tablet:text-lg</code>,{" "}
          <code className="bg-white/10 px-1 py-0.5 rounded">desktop:flex-row</code>).
        </p>

        <div className="border border-white/10 rounded-lg overflow-hidden bg-background">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="py-3 px-4 font-semibold">Prefix</th>
                <th className="py-3 px-4 font-semibold">Minimum Width</th>
                <th className="py-3 px-4 font-semibold">CSS Variable</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(breakpoints).map(([name, value]) => (
                <tr key={name} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <code className="text-accent-300 font-bold bg-accent-900/50 px-2 py-1 rounded">
                      {name}:
                    </code>
                  </td>
                  <td className="py-3 px-4 text-primary-200">{value}</td>
                  <td className="py-3 px-4">
                    <code className="opacity-70 text-sm">--breakpoint-{name}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-white/10">
        <h3 className="text-xl font-heading font-bold mb-4">Visualizer</h3>
        <p className="opacity-80 mb-6 text-sm">
          Resize your browser window to see how the container responds to these breakpoints.
        </p>
        <div className="relative h-32 rounded-lg border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center p-4 text-center transition-all duration-300">
          <div className="absolute inset-0 flex items-center justify-center font-bold text-lg pointer-events-none">
            <span className="block mobile:hidden text-white/50">
              Base (&lt; {breakpoints.mobile})
            </span>
            <span className="hidden mobile:block tablet:hidden text-accent-300">
              Mobile (&ge; {breakpoints.mobile})
            </span>
            <span className="hidden tablet:block desktop:hidden text-secondary-300">
              Tablet (&ge; {breakpoints.tablet})
            </span>
            <span className="hidden desktop:block x-wide:hidden text-primary-300">
              Desktop (&ge; {breakpoints.desktop})
            </span>
            <span className="hidden x-wide:block text-green-300">
              X-Wide (&ge; {breakpoints["x-wide"]})
            </span>
          </div>

          {/* Visual indicators for active breakpoint */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            <div
              className="h-2 w-8 rounded-full bg-white/20 mobile:bg-white/50 transition-colors"
              title="Mobile"
            />
            <div
              className="h-2 w-8 rounded-full bg-white/20 tablet:bg-secondary-500 transition-colors"
              title="Tablet"
            />
            <div
              className="h-2 w-8 rounded-full bg-white/20 desktop:bg-primary-500 transition-colors"
              title="Desktop"
            />
            <div
              className="h-2 w-8 rounded-full bg-white/20 x-wide:bg-green-500 transition-colors"
              title="X-Wide"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="space-y-4 font-sans">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-4">Spacing Scale</h2>
        <p className="opacity-80 mb-6 max-w-prose">
          The spacing scale is used for margins, paddings, gaps, and positioning. It follows a
          predictable progression. Use Tailwind classes like <code>p-4</code>, <code>m-2</code>,{" "}
          <code>gap-8</code>.
        </p>

        <div className="flex flex-col gap-2">
          {Object.entries(spacingScale).map(([name, value]) => {
            // Calculate pixel value solely for visualizing the bar width
            const pxMatch = value.match(/(\d+)px/);
            const pxValue = pxMatch ? parseInt(pxMatch[1]!, 10) : name === "0" ? 0 : 1;

            return (
              <div key={name} className="flex items-center gap-4 text-sm">
                <div className="w-16 font-mono text-right opacity-70 border-r border-white/10 pr-4">
                  {name}
                </div>
                <div className="w-32 opacity-90">{value}</div>
                <div className="flex-1">
                  <div
                    className="h-4 bg-primary-500 rounded-sm"
                    style={{ width: `${pxValue}px`, minWidth: pxValue > 0 ? "1px" : "0" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ),
};

export const BorderRadius: Story = {
  render: () => (
    <div className="space-y-4 font-sans">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-4">Border Radius</h2>
        <p className="opacity-80 mb-6 max-w-prose">
          The standard border radius scale. Use utility classes like <code>rounded-md</code>,{" "}
          <code>rounded-full</code>.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Object.entries(radiusScale).map(([name, value]) => {
            return (
              <div key={name} className="flex flex-col gap-3">
                <div
                  className="h-24 bg-white/10 border border-white/20 flex items-center justify-center"
                  style={{ borderRadius: value }}
                >
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute top-2 left-2" />
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute top-2 right-2" />
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute bottom-2 left-2" />
                  <div className="w-4 h-4 rounded-full bg-white/20 absolute bottom-2 right-2" />
                </div>
                <div className="text-sm">
                  <span className="font-bold font-mono">
                    {name === "DEFAULT" ? "rounded" : `rounded-${name}`}
                  </span>
                  <div className="opacity-70">{value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  ),
};
const layoutTokens = {
  stack: {
    name: "layout-stack",
    description: "Single column layout with vertical spacing.",
    usage: "Ruleset pages, long-form content.",
    structure: "Flex Column (gap-10), px-4",
  },
  split: {
    name: "layout-split",
    description: "Two-column grid layout (2:1 ratio) on desktop.",
    usage: "Episode details, dashboards, sidebar layouts.",
    structure: "Grid (gap-4), px-4, 2fr 1fr on desktop",
  },
};

export const Layout: Story = {
  render: () => (
    <div className="space-y-12 font-sans">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-4">Layout Tokens</h2>
        <p className="opacity-80 mb-8 max-w-prose">
          These tokens represent standard page structures in our application. They are implemented
          as utility classes rather than components to remain flexible.
        </p>

        <div className="space-y-10">
          {Object.entries(layoutTokens).map(([key, token]) => (
            <div key={key} className="space-y-4">
              <div className="flex items-baseline gap-3">
                <code className="text-accent-300 font-bold bg-accent-900/50 px-2 py-1 rounded text-lg">
                  .{token.name}
                </code>
                <span className="text-sm opacity-60 italic">{token.description}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 space-y-3">
                  <div className="flex justify-between text-xs opacity-50 uppercase tracking-widest">
                    <span>Structure</span>
                  </div>
                  <p className="font-mono text-sm">{token.structure}</p>

                  <div className="pt-4 flex justify-between text-xs opacity-50 uppercase tracking-widest">
                    <span>Common Usage</span>
                  </div>
                  <p className="text-sm">{token.usage}</p>
                </div>

                <div className="relative border border-dashed border-white/20 rounded-lg bg-white/5 min-h-[200px] overflow-hidden p-2">
                  <div className="absolute top-2 right-2 text-[10px] opacity-30 font-mono">Visual Preview</div>

                  {key === 'stack' ? (
                    <div className="layout-stack py-4 h-full">
                      <div className="h-8 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs">Section 1</div>
                      <div className="h-24 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs">Main Content</div>
                      <div className="h-12 bg-primary-500/20 rounded border border-primary-500/30 w-full flex items-center justify-center text-xs">Section 2</div>
                    </div>
                  ) : (
                    <div className="layout-split py-4 h-full">
                      <div className="h-32 bg-secondary-500/20 rounded border border-secondary-500/30 flex items-center justify-center text-xs">Main Column</div>
                      <div className="h-32 bg-accent-500/20 rounded border border-accent-500/30 flex items-center justify-center text-xs">Sidebar</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
