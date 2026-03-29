import { j as d } from "./jsx-runtime-u17CrQMm.js";
import { R as u } from "./iframe-RLsCwdXb.js";
import { c as m } from "./Button-eGzUney-.js";
import "./preload-helper-PPVm8Dsz.js";
import "./bundle-mjs-Ce1ZTWB2.js";
const t = u.forwardRef(
  ({ className: r, message: n, size: s = "default", layout: l = "inline", ...o }, i) =>
    d.jsx("div", {
      ref: i,
      className: m(
        "text-primary animate-pulse uppercase tracking-widest font-black",
        { "text-xl": s === "default", "text-2xl": s === "large", "p-8": l === "padded" },
        r,
      ),
      ...o,
      children: n,
    }),
);
t.displayName = "LoadingState";
t.__docgenInfo = {
  description: "Standardized loading label for async states across applications.",
  methods: [],
  displayName: "LoadingState",
  props: {
    message: { required: !0, tsType: { name: "string" }, description: "" },
    size: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"default" | "large"',
        elements: [
          { name: "literal", value: '"default"' },
          { name: "literal", value: '"large"' },
        ],
      },
      description: "",
      defaultValue: { value: '"default"', computed: !1 },
    },
    layout: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"inline" | "padded"',
        elements: [
          { name: "literal", value: '"inline"' },
          { name: "literal", value: '"padded"' },
        ],
      },
      description: "",
      defaultValue: { value: '"inline"', computed: !1 },
    },
  },
};
const x = {
    title: "Suunnittelujarjestelma/Komponentit/Lataustila",
    component: t,
    parameters: { layout: "centered" },
    args: { message: "Ladataan tietoja...", size: "default", layout: "inline" },
  },
  e = {},
  a = { args: { message: "Ladataan hahmoa...", size: "large", layout: "padded" } };
e.parameters = {
  ...e.parameters,
  docs: { ...e.parameters?.docs, source: { originalSource: "{}", ...e.parameters?.docs?.source } },
};
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    message: "Ladataan hahmoa...",
    size: "large",
    layout: "padded"
  }
}`,
      ...a.parameters?.docs?.source,
    },
  },
};
const h = ["Oletus", "Pehmustettu"];
export { e as Oletus, a as Pehmustettu, h as __namedExportsOrder, x as default };
