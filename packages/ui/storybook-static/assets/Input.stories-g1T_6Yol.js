import { c as p } from "./Button-SHBV2pqv.js";
import { R as c } from "./index-mTzoL55G.js";
import { j as e } from "./jsx-runtime-u17CrQMm.js";

const t = c.forwardRef(({ className: n, label: l, error: a, ...i }, d) =>
  e.jsxs("div", {
    className: "flex flex-col w-full gap-1.5",
    children: [
      l && e.jsx("label", { className: "text-sm font-medium text-slate-300", children: l }),
      e.jsx("input", {
        ref: d,
        className: p(
          "flex h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 ring-offset-slate-950 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
          a && "border-red-500 focus-visible:ring-red-500",
          n,
        ),
        ...i,
      }),
      a && e.jsx("span", { className: "text-xs text-red-500", children: a }),
    ],
  }),
);
t.displayName = "Input";
t.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "Input",
  props: {
    label: { required: !1, tsType: { name: "string" }, description: "" },
    error: { required: !1, tsType: { name: "string" }, description: "" },
  },
};
const x = {
    title: "Components/Input",
    component: t,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
  },
  r = { args: { placeholder: "Kirjoita tähän..." } },
  s = { args: { label: "Hahmon Nimi", placeholder: "Esim. Kaelen" } },
  o = { args: { label: "Koodi", placeholder: "Syötä koodi", error: "Koodi on virheellinen." } };
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    placeholder: "Kirjoita tähän..."
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
s.parameters = {
  ...s.parameters,
  docs: {
    ...s.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    label: "Hahmon Nimi",
    placeholder: "Esim. Kaelen"
  }
}`,
      ...s.parameters?.docs?.source,
    },
  },
};
o.parameters = {
  ...o.parameters,
  docs: {
    ...o.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    label: "Koodi",
    placeholder: "Syötä koodi",
    error: "Koodi on virheellinen."
  }
}`,
      ...o.parameters?.docs?.source,
    },
  },
};
const g = ["Default", "WithLabel", "WithError"];
export { r as Default, o as WithError, s as WithLabel, g as __namedExportsOrder, x as default };
