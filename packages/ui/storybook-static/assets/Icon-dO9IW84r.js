import { j as r } from "./jsx-runtime-u17CrQMm.js";
import { R as c } from "./iframe-RLsCwdXb.js";
import { c as e, a as d, C as p, B as u, D as h } from "./dice-5-CjDluqk6.js";
const m = [["path", { d: "M5 12h14", key: "1ays0h" }]],
  y = e("minus", m);
const k = [
    ["path", { d: "M5 12h14", key: "1ays0h" }],
    ["path", { d: "M12 5v14", key: "s699le" }],
  ],
  v = e("plus", k);
const f = [
    [
      "path",
      {
        d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        key: "oel41y",
      },
    ],
  ],
  _ = e("shield", f);
const M = [
    [
      "path",
      {
        d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",
        key: "1s2grr",
      },
    ],
    ["path", { d: "M20 2v4", key: "1rf3ol" }],
    ["path", { d: "M22 4h-4", key: "gwowj6" }],
    ["circle", { cx: "4", cy: "20", r: "2", key: "6kqj1y" }],
  ],
  x = e("sparkles", M);
const N = [
    ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
    ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
  ],
  z = e("x", N);
const I = [
    [
      "path",
      {
        d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",
        key: "1xq2db",
      },
    ],
  ],
  b = e("zap", I),
  g = {
    sparkles: x,
    dice5: h,
    book: u,
    "chevron-left": p,
    "chevron-right": d,
    minus: y,
    plus: v,
    zap: b,
    shield: _,
    x: z,
  },
  l = c.forwardRef(({ name: o, size: n = 16, className: s, ...t }, i) => {
    const a = g[o];
    return a ? r.jsx(a, { ref: i, size: n, className: s, ...t }) : null;
  });
l.displayName = "Icon";
l.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "Icon",
  props: {
    name: {
      required: !0,
      tsType: {
        name: "union",
        raw: "keyof typeof icons",
        elements: [
          { name: "literal", value: "sparkles" },
          { name: "literal", value: "dice5" },
          { name: "literal", value: "book" },
          { name: "literal", value: '"chevron-left"' },
          { name: "literal", value: '"chevron-right"' },
          { name: "literal", value: "minus" },
          { name: "literal", value: "plus" },
          { name: "literal", value: "zap" },
          { name: "literal", value: "shield" },
          { name: "literal", value: "x" },
        ],
      },
      description: "",
    },
    size: {
      required: !1,
      tsType: { name: "number" },
      description: "",
      defaultValue: { value: "16", computed: !1 },
    },
  },
};
export { l as I, g as i };
