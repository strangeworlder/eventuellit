import { j as e } from "./jsx-runtime-u17CrQMm.js";
import { D as s } from "./DiceIcon-BoLGTUrC.js";
import "./iframe-RLsCwdXb.js";
import "./preload-helper-PPVm8Dsz.js";
import "./Button-eGzUney-.js";
import "./bundle-mjs-Ce1ZTWB2.js";
const u = {
    title: "Suunnittelujarjestelma/Komponentit/DiceIcon",
    component: s,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
    argTypes: {
      faces: { control: "select", options: [4, 6, 8, 10, 12, 20] },
      value: { control: "number" },
      size: { control: "select", options: ["sm", "md", "lg"] },
      active: { control: "boolean" },
    },
  },
  a = { args: { faces: 20 } },
  r = { args: { faces: 6, active: !0 } },
  c = {
    args: { faces: 20 },
    render: () =>
      e.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          e.jsx(s, { faces: 20, size: "sm" }),
          e.jsx(s, { faces: 20, size: "md" }),
          e.jsx(s, { faces: 20, size: "lg" }),
        ],
      }),
  },
  n = {
    args: { faces: 20 },
    render: () =>
      e.jsxs("div", {
        className: "flex items-center gap-4",
        children: [
          e.jsx(s, { faces: 4 }),
          e.jsx(s, { faces: 6 }),
          e.jsx(s, { faces: 8 }),
          e.jsx(s, { faces: 10 }),
          e.jsx(s, { faces: 12 }),
          e.jsx(s, { faces: 20 }),
        ],
      }),
  },
  o = { args: { faces: 20, value: 14, size: "lg", active: !0 } };
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    faces: 20
  }
}`,
      ...a.parameters?.docs?.source,
    },
  },
};
r.parameters = {
  ...r.parameters,
  docs: {
    ...r.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    faces: 6,
    active: true
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
c.parameters = {
  ...c.parameters,
  docs: {
    ...c.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    faces: 20
  },
  render: () => <div className="flex items-center gap-4">\r
      <DiceIcon faces={20} size="sm" />\r
      <DiceIcon faces={20} size="md" />\r
      <DiceIcon faces={20} size="lg" />\r
    </div>
}`,
      ...c.parameters?.docs?.source,
    },
  },
};
n.parameters = {
  ...n.parameters,
  docs: {
    ...n.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    faces: 20
  },
  render: () => <div className="flex items-center gap-4">\r
      <DiceIcon faces={4} />\r
      <DiceIcon faces={6} />\r
      <DiceIcon faces={8} />\r
      <DiceIcon faces={10} />\r
      <DiceIcon faces={12} />\r
      <DiceIcon faces={20} />\r
    </div>
}`,
      ...n.parameters?.docs?.source,
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
    faces: 20,
    value: 14,
    size: "lg",
    active: true
  }
}`,
      ...o.parameters?.docs?.source,
    },
  },
};
const d = ["Default", "Active", "Sizes", "Shapes", "CustomValue"];
export {
  r as Active,
  o as CustomValue,
  a as Default,
  n as Shapes,
  c as Sizes,
  d as __namedExportsOrder,
  u as default,
};
