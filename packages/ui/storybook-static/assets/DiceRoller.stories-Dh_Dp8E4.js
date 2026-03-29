import { j as e } from "./jsx-runtime-u17CrQMm.js";
import { R as x } from "./iframe-RLsCwdXb.js";
import { c as g } from "./Button-eGzUney-.js";
import "./preload-helper-PPVm8Dsz.js";
import "./bundle-mjs-Ce1ZTWB2.js";
const a = x.forwardRef(
  ({ className: l, diceType: s = "n10", count: n = 1, label: o, onRoll: i, ...c }, d) => {
    const m = () => {
      if (i) {
        const p = parseInt(s.replace("n", ""), 10) || 10,
          u = Array.from({ length: n }, () => Math.floor(Math.random() * p) + 1);
        i(u);
      }
    };
    return e.jsxs("div", {
      ref: d,
      className: g("flex flex-col gap-3 mt-4", l),
      ...c,
      children: [
        o &&
          e.jsx("label", {
            className: "text-sm font-black text-secondary uppercase tracking-widest",
            children: o,
          }),
        e.jsx("button", {
          onClick: m,
          className:
            "flex h-20 w-full items-center justify-center rounded-none border-4 border-dashed border-primary/40 bg-background hover:bg-primary/10 hover:border-primary transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50 group hover:scale-[1.02] shadow-[0_0_15px_rgba(201,42,42,0.1)] hover:shadow-[0_0_25px_rgba(201,42,42,0.3)]",
          children: e.jsxs("div", {
            className:
              "flex items-center gap-4 text-text/70 group-hover:text-primary transition-colors",
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
              e.jsxs("span", {
                className: "font-black text-2xl uppercase tracking-widest drop-shadow-sm",
                children: ["Heitä ", n, s],
              }),
            ],
          }),
        }),
      ],
    });
  },
);
a.displayName = "DiceRoller";
a.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "DiceRoller",
  props: {
    diceType: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"n6" | "n10" | "n20"',
        elements: [
          { name: "literal", value: '"n6"' },
          { name: "literal", value: '"n10"' },
          { name: "literal", value: '"n20"' },
        ],
      },
      description: "",
      defaultValue: { value: '"n10"', computed: !1 },
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
const j = {
    title: "Suunnittelujarjestelma/Pelimekaniikka/DiceRoller",
    component: a,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: { onRoll: { action: "noppatulos" } },
  },
  r = { args: { label: "Toimintotesti", count: 2, diceType: "n10" } },
  t = { args: { label: "Epätoivoinen yritys", count: 1, diceType: "n20" } };
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    label: "Toimintotesti",
    count: 2,
    diceType: "n10"
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
    diceType: "n20"
  }
}`,
      ...t.parameters?.docs?.source,
    },
  },
};
const w = ["DefaultAction", "HighStakes"];
export { r as DefaultAction, t as HighStakes, w as __namedExportsOrder, j as default };
