import { c as x } from "./Button-SHBV2pqv.js";
import { R as g } from "./index-mTzoL55G.js";
import { j as e } from "./jsx-runtime-u17CrQMm.js";

const s = g.forwardRef(
  ({ className: l, diceType: a = "d10", count: o = 1, label: n, onRoll: i, ...c }, d) => {
    const u = () => {
      if (i) {
        const m = parseInt(a.replace("d", ""), 10) || 10,
          p = Array.from({ length: o }, () => Math.floor(Math.random() * m) + 1);
        i(p);
      }
    };
    return e.jsxs("div", {
      ref: d,
      className: x("flex flex-col gap-2", l),
      ...c,
      children: [
        n && e.jsx("label", { className: "text-sm font-medium text-slate-300", children: n }),
        e.jsx("button", {
          onClick: u,
          className:
            "flex h-16 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-orange-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:opacity-50 group",
          children: e.jsxs("div", {
            className:
              "flex items-center gap-2 text-slate-400 group-hover:text-orange-500 transition-colors",
            children: [
              e.jsxs("svg", {
                xmlns: "http://www.w3.org/-svg",
                width: "24",
                height: "24",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                children: [
                  e.jsx("rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }),
                  e.jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                  e.jsx("circle", { cx: "15.5", cy: "15.5", r: "1.5" }),
                  e.jsx("circle", { cx: "15.5", cy: "8.5", r: "1.5" }),
                  e.jsx("circle", { cx: "8.5", cy: "15.5", r: "1.5" }),
                ],
              }),
              e.jsxs("span", { className: "font-semibold text-lg", children: ["Heitä ", o, a] }),
            ],
          }),
        }),
      ],
    });
  },
);
s.displayName = "DiceRoller";
s.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "DiceRoller",
  props: {
    diceType: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"d6" | "d10" | "d20"',
        elements: [
          { name: "literal", value: '"d6"' },
          { name: "literal", value: '"d10"' },
          { name: "literal", value: '"d20"' },
        ],
      },
      description: "",
      defaultValue: { value: '"d10"', computed: !1 },
    },
    count: {
      required: !1,
      tsType: { name: "number" },
      description: "",
      defaultValue: { value: "1", computed: !1 },
    },
    label: { required: !1, tsType: { name: "string" }, description: "" },
    onRoll: {
      required: !1,
      tsType: {
        name: "signature",
        type: "function",
        raw: "(result: number[]) => void",
        signature: {
          arguments: [
            {
              type: { name: "Array", elements: [{ name: "number" }], raw: "number[]" },
              name: "result",
            },
          ],
          return: { name: "void" },
        },
      },
      description: "",
    },
  },
};
const b = {
    title: "TTRPG/DiceRoller",
    component: s,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: { onRoll: { action: "noppatulos" } },
  },
  r = { args: { label: "Toimintotesti", count: 2, diceType: "d10" } },
  t = { args: { label: "Epätoivoinen yritys", count: 1, diceType: "d20" } };
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    label: "Toimintotesti",
    count: 2,
    diceType: "d10"
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
t.parameters = {
  ...t.parameters,
  docs: {
    ...t.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    label: "Epätoivoinen yritys",
    count: 1,
    diceType: "d20"
  }
}`,
      ...t.parameters?.docs?.source,
    },
  },
};
const v = ["DefaultAction", "HighStakes"];
export { r as DefaultAction, t as HighStakes, v as __namedExportsOrder, b as default };
