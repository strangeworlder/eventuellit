import { j as o } from "./jsx-runtime-u17CrQMm.js";
import { B as d } from "./Button-eGzUney-.js";
import "./bundle-mjs-Ce1ZTWB2.js";
import "./iframe-RLsCwdXb.js";
import "./preload-helper-PPVm8Dsz.js";
const g = {
    title: "Suunnittelujarjestelma/Komponentit/Button",
    component: d,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
  },
  r = { args: { variant: "primary", children: "Hyökkää" } },
  a = { args: { variant: "secondary", children: "Puolusta" } },
  e = { args: { variant: "danger", children: "Tuhoa" } },
  s = { args: { variant: "ghost-secondary", children: "Peruuta" } },
  n = {
    args: { variant: "ghost-secondary", size: "nav", justify: "start", children: "Sääntökirja" },
    parameters: { layout: "padded" },
    decorators: [
      (t) =>
        o.jsx("div", {
          className: "w-64 bg-background border border-border p-2 rounded-md",
          children: o.jsx(t, {}),
        }),
    ],
  };
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
s.parameters = {
  ...s.parameters,
  docs: {
    ...s.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    variant: "ghost-secondary",
    children: "Peruuta"
  }
}`,
      ...s.parameters?.docs?.source,
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
    variant: "ghost-secondary",
    size: "nav",
    justify: "start",
    children: "Sääntökirja"
  },
  parameters: {
    layout: "padded"
  },
  decorators: [Story => <div className="w-64 bg-background border border-border p-2 rounded-md">\r
        <Story />\r
      </div>]
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
const l = ["Primary", "Secondary", "Danger", "GhostSecondary", "NavButton"];
export {
  e as Danger,
  s as GhostSecondary,
  n as NavButton,
  r as Primary,
  a as Secondary,
  l as __namedExportsOrder,
  g as default,
};
