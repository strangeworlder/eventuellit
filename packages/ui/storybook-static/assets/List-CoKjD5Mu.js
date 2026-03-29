import { j as t } from "./jsx-runtime-u17CrQMm.js";
import { R as s } from "./iframe-RLsCwdXb.js";
import { c as i } from "./Heading-DaMVR3YC.js";
const u = s.forwardRef(({ className: l, as: e = "ul", variant: a = "default", ...m }, r) =>
  t.jsx(e, {
    ref: r,
    className: i(
      "text-[var(--theme-text)] space-y-2 mb-4",
      {
        "list-disc ml-6": e === "ul" && a === "default",
        "list-decimal ml-6": e === "ol" && a === "default",
        "list-none ml-0": a === "unbulleted",
      },
      l,
    ),
    ...m,
  }),
);
u.displayName = "List";
const d = s.forwardRef(({ className: l, ...e }, a) =>
  t.jsx("li", { ref: a, className: i("text-[1.05rem] leading-[1.7]", l), ...e }),
);
d.displayName = "ListItem";
u.__docgenInfo = {
  description: "A standardized List component for the Design System.",
  methods: [],
  displayName: "List",
  props: {
    as: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"ul" | "ol"',
        elements: [
          { name: "literal", value: '"ul"' },
          { name: "literal", value: '"ol"' },
        ],
      },
      description: "",
      defaultValue: { value: '"ul"', computed: !1 },
    },
    variant: {
      required: !1,
      tsType: {
        name: "union",
        raw: '"default" | "unbulleted"',
        elements: [
          { name: "literal", value: '"default"' },
          { name: "literal", value: '"unbulleted"' },
        ],
      },
      description: "",
      defaultValue: { value: '"default"', computed: !1 },
    },
  },
};
d.__docgenInfo = { description: "", methods: [], displayName: "ListItem" };
export { u as L, d as a };
