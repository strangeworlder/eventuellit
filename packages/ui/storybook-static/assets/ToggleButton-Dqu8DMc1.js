import { j as i } from "./jsx-runtime-u17CrQMm.js";
import { R as l } from "./iframe-RLsCwdXb.js";
import { c as d } from "./Button-eGzUney-.js";
const t = l.forwardRef(({ className: r, pressed: e, theme: a, children: n, ...o }, s) =>
  i.jsx("button", {
    ref: s,
    "data-theme": a,
    "aria-pressed": e,
    className: d(
      "px-3 py-1 rounded-sm text-xs font-bold transition-colors border-2 cursor-pointer",
      "focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
      e
        ? "bg-[var(--theme-secondary)] text-[var(--theme-secondary-foreground)] border-[var(--theme-secondary)]"
        : "bg-transparent text-[var(--theme-text)]/50 border-[var(--theme-text)]/30 hover:border-[var(--theme-text)]/50",
      r,
    ),
    ...o,
    children: n,
  }),
);
t.displayName = "ToggleButton";
t.__docgenInfo = {
  description: `A two-state toggle button that communicates its pressed state visually.\r
Uses the secondary colour token when active and a muted outline when inactive.\r
\r
Follows the WAI-ARIA pattern for toggle buttons by setting \`aria-pressed\`.`,
  methods: [],
  displayName: "ToggleButton",
  props: {
    pressed: {
      required: !0,
      tsType: { name: "boolean" },
      description: "Whether the button is currently in the pressed/active state",
    },
    theme: {
      required: !1,
      tsType: {
        name: "union",
        raw: `| "base"\r
| "inverted"\r
| "primary-light"\r
| "primary-dark"\r
| "secondary-light"\r
| "secondary-dark"\r
| "accent-light"\r
| "accent-dark"`,
        elements: [
          { name: "literal", value: '"base"' },
          { name: "literal", value: '"inverted"' },
          { name: "literal", value: '"primary-light"' },
          { name: "literal", value: '"primary-dark"' },
          { name: "literal", value: '"secondary-light"' },
          { name: "literal", value: '"secondary-dark"' },
          { name: "literal", value: '"accent-light"' },
          { name: "literal", value: '"accent-dark"' },
        ],
      },
      description: "",
    },
  },
};
export { t as T };
