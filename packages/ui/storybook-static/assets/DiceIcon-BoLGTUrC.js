import { j as e } from "./jsx-runtime-u17CrQMm.js";
import { R as d } from "./iframe-RLsCwdXb.js";
import { c as l } from "./Button-eGzUney-.js";
const m = ({ faces: s, className: o, active: r }) => {
    const n = {
      fill: r ? "var(--theme-primary)" : "var(--theme-secondary)",
      fillOpacity: 0.8,
      stroke: r ? "var(--theme-primary)" : "var(--theme-secondary)",
    };
    switch (s) {
      case 4:
        return e.jsxs("svg", {
          viewBox: "0 0 100 100",
          strokeWidth: "6",
          strokeLinejoin: "round",
          className: o,
          style: n,
          children: [
            e.jsx("polygon", { points: "50,10 90,85 10,85" }),
            e.jsx("path", { d: "M50 60 L50 10 M50 60 L90 85 M50 60 L10 85", fill: "none" }),
          ],
        });
      case 6:
        return e.jsxs("svg", {
          viewBox: "0 0 100 100",
          strokeWidth: "6",
          strokeLinejoin: "round",
          className: o,
          style: n,
          children: [
            e.jsx("polygon", { points: "50,10 85,30 85,70 50,90 15,70 15,30" }),
            e.jsx("path", { d: "M50 50 L50 90 M50 50 L15 30 M50 50 L85 30", fill: "none" }),
          ],
        });
      case 8:
        return e.jsxs("svg", {
          viewBox: "0 0 100 100",
          strokeWidth: "6",
          strokeLinejoin: "round",
          className: o,
          style: n,
          children: [
            e.jsx("polygon", { points: "50,5 95,30 95,70 50,95 5,70 5,30" }),
            e.jsx("polygon", { points: "50,5 95,70 5,70", fill: "none" }),
          ],
        });
      case 10:
        return e.jsxs("svg", {
          viewBox: "0 0 100 100",
          strokeWidth: "6",
          strokeLinejoin: "round",
          className: o,
          style: n,
          children: [
            e.jsx("polygon", { points: "50,5 90,35 50,95 10,35" }),
            e.jsx("polyline", { points: "50,5 70,40 50,75 30,40 50,5", fill: "none" }),
            e.jsx("polyline", { points: "70,40 90,35", fill: "none" }),
            e.jsx("polyline", { points: "30,40 10,35", fill: "none" }),
            e.jsx("polyline", { points: "50,75 50,95", fill: "none" }),
          ],
        });
      case 12:
        return e.jsxs("svg", {
          viewBox: "0 0 100 100",
          strokeWidth: "6",
          strokeLinejoin: "round",
          className: o,
          style: n,
          children: [
            e.jsx("polygon", {
              points: "50,5 75,13 93,36 95,64 75,87 50,95 25,87 5,64 7,36 25,13",
            }),
            e.jsx("polygon", { points: "38,35 62,35 70,55 50,70 30,55", fill: "none" }),
            e.jsx("path", {
              d: "M38 35 L25 13 M62 35 L75 13 M70 55 L95 64 M50 70 L50 95 M30 55 L5 64",
              fill: "none",
            }),
          ],
        });
      case 20:
        return e.jsxs("svg", {
          viewBox: "0 0 100 100",
          strokeWidth: "6",
          strokeLinejoin: "round",
          className: o,
          style: n,
          children: [
            e.jsx("polygon", { points: "50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" }),
            e.jsx("polygon", { points: "30,35 70,35 50,70", fill: "none" }),
            e.jsx("path", {
              d: "M30 35 L50 5 M70 35 L50 5 M70 35 L95 27.5 M70 35 L95 72.5 M50 70 L95 72.5 M50 70 L50 95 M50 70 L5 72.5 M30 35 L5 72.5 M30 35 L5 27.5",
              fill: "none",
            }),
          ],
        });
      default:
        return null;
    }
  },
  i = d.forwardRef(
    ({ className: s, faces: o, value: r, size: n = "md", active: t = !1, ...a }, p) =>
      e.jsxs("div", {
        ref: p,
        className: l(
          "relative flex items-center justify-center font-black transform transition-transform",
          {
            "w-6 h-6 text-xs": n === "sm",
            "w-8 h-8 text-sm": n === "md",
            "w-12 h-12 text-lg": n === "lg",
          },
          s,
        ),
        ...a,
        children: [
          e.jsx(m, {
            faces: o,
            active: t,
            className: l(
              "absolute inset-0 w-full h-full transition-colors drop-shadow-sm",
              t
                ? "drop-shadow-[2px_2px_0px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)]"
                : "drop-shadow-[2px_2px_0px_color-mix(in_srgb,var(--theme-secondary)_40%,transparent)]",
            ),
          }),
          e.jsx("span", {
            className: l(
              "relative z-10",
              t
                ? "text-[var(--theme-primary-foreground)]"
                : "text-[var(--theme-secondary-foreground)]",
            ),
            children: r ?? o,
          }),
        ],
      }),
  );
i.displayName = "DiceIcon";
i.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "DiceIcon",
  props: {
    faces: {
      required: !0,
      tsType: {
        name: "union",
        raw: "4 | 6 | 8 | 10 | 12 | 20",
        elements: [
          { name: "literal", value: "4" },
          { name: "literal", value: "6" },
          { name: "literal", value: "8" },
          { name: "literal", value: "10" },
          { name: "literal", value: "12" },
          { name: "literal", value: "20" },
        ],
      },
      description: "",
    },
    value: { required: !1, tsType: { name: "number" }, description: "" },
    size: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"sm" | "md" | "lg"',
        elements: [
          { name: "literal", value: '"sm"' },
          { name: "literal", value: '"md"' },
          { name: "literal", value: '"lg"' },
        ],
      },
      description: "",
      defaultValue: { value: '"md"', computed: !1 },
    },
    active: {
      required: !1,
      tsType: { name: "boolean" },
      description: "",
      defaultValue: { value: "false", computed: !1 },
    },
  },
};
export { i as D };
