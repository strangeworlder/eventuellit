import { j as e } from "./jsx-runtime-u17CrQMm.js";
import { G as n } from "./GameTerm-B5TXl4CZ.js";
import { T as i } from "./Text-BiVrnusf.js";
import "./iframe-RLsCwdXb.js";
import "./preload-helper-PPVm8Dsz.js";
import "./Heading-DaMVR3YC.js";
import "./bundle-mjs-Ce1ZTWB2.js";
const u = {
    title: "Suunnittelujarjestelma/Komponentit/GameTerm",
    component: n,
    parameters: { layout: "padded" },
    tags: ["autodocs"],
    argTypes: {
      variant: { control: "select", options: ["default", "accent", "primary", "label"] },
    },
  },
  a = {
    args: { children: "Sisupiste" },
    render: (r) => e.jsxs(i, { children: ["Heitä yksi ", e.jsx(n, { ...r }), " lisää."] }),
  },
  s = {
    args: { variant: "primary", children: "n20" },
    render: (r) =>
      e.jsxs(i, { children: ["Vahinkoa heitetään yhdellä ", e.jsx(n, { ...r }), " nopalla."] }),
  },
  t = {
    args: { variant: "label", children: "Tyypit:" },
    render: (r) =>
      e.jsx("ul", {
        className: "list-none space-y-4",
        children: e.jsxs("li", {
          className: "flex items-start",
          children: [
            e.jsx("span", {
              className: "text-[var(--theme-accent)] mr-3 font-bold",
              children: "▶",
            }),
            e.jsxs("div", {
              children: [
                e.jsx(n, { ...r }),
                e.jsx("span", {
                  className: "text-lg ml-2 text-[var(--theme-text)]",
                  children: "Sotilas tai Ekspertti.",
                }),
              ],
            }),
          ],
        }),
      }),
  };
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    children: "Sisupiste"
  },
  render: args => <Text>Heitä yksi {<GameTerm {...args} />} lisää.</Text>
}`,
      ...a.parameters?.docs?.source,
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
    variant: "primary",
    children: "n20"
  },
  render: args => <Text>Vahinkoa heitetään yhdellä {<GameTerm {...args} />} nopalla.</Text>
}`,
      ...s.parameters?.docs?.source,
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
    variant: "label",
    children: "Tyypit:"
  },
  render: args => <ul className="list-none space-y-4">\r
            <li className="flex items-start">\r
                <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>\r
                <div>\r
                    <GameTerm {...args} />\r
                    <span className="text-lg ml-2 text-[var(--theme-text)]">\r
                        Sotilas tai Ekspertti.\r
                    </span>\r
                </div>\r
            </li>\r
        </ul>
}`,
      ...t.parameters?.docs?.source,
    },
  },
};
const h = ["Default", "PrimaryVariant", "LabelVariant"];
export {
  a as Default,
  t as LabelVariant,
  s as PrimaryVariant,
  h as __namedExportsOrder,
  u as default,
};
