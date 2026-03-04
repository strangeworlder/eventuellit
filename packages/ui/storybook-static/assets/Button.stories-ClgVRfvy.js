import { B as n } from "./Button-SHBV2pqv.js";
import "./jsx-runtime-u17CrQMm.js";
import "./index-mTzoL55G.js";
const c = {
    title: "Components/Button",
    component: n,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
  },
  r = { args: { variant: "primary", children: "Hyökkää" } },
  a = { args: { variant: "secondary", children: "Puolusta" } },
  e = { args: { variant: "danger", children: "Tuhoa" } };
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: "primary",
    children: "Hyökkää"
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: "secondary",
    children: "Puolusta"
  }
}`,
      ...a.parameters?.docs?.source,
    },
  },
};
e.parameters = {
  ...e.parameters,
  docs: {
    ...e.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: "danger",
    children: "Tuhoa"
  }
}`,
      ...e.parameters?.docs?.source,
    },
  },
};
const d = ["Primary", "Secondary", "Danger"];
export { e as Danger, r as Primary, a as Secondary, d as __namedExportsOrder, c as default };
