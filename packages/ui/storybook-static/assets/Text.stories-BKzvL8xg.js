import { j as a } from "./jsx-runtime-u17CrQMm.js";
import { T as t } from "./Text-BiVrnusf.js";
import "./iframe-RLsCwdXb.js";
import "./Heading-DaMVR3YC.js";
import "./bundle-mjs-Ce1ZTWB2.js";
import "./preload-helper-PPVm8Dsz.js";
const d = {
    title: "Suunnittelujarjestelma/Komponentit/Teksti",
    component: t,
    parameters: { layout: "centered" },
    args: {
      variant: "base",
      children:
        "Eventuellit on episodinen roolipelijarjestelma, jossa valinnat vaikuttavat seuraavan jakson asetelmiin.",
    },
    argTypes: {
      variant: { control: "select", options: ["base", "large", "small", "lead", "muted", "bold"] },
    },
  },
  e = {},
  i = {
    render: () =>
      a.jsxs("div", {
        className: "flex max-w-3xl flex-col gap-4",
        children: [
          a.jsx(t, { variant: "lead", children: "Johdanto: Tämä kappale toimii ingressina." }),
          a.jsx(t, {
            variant: "base",
            children: "Perusteksti kuvaa tilanteen selkeasti ja neutraalisti.",
          }),
          a.jsx(t, {
            variant: "bold",
            children: "Korostettu teksti nostaa esiin yhden tarkean huomiokohdan.",
          }),
          a.jsx(t, {
            variant: "muted",
            children: "Hillitty teksti sopii taustatiedolle, joka ei saa varastaa huomiota.",
          }),
          a.jsx(t, { variant: "small", children: "Pieni teksti toimii lisahuomautuksissa." }),
        ],
      }),
  };
e.parameters = {
  ...e.parameters,
  docs: { ...e.parameters?.docs, source: { originalSource: "{}", ...e.parameters?.docs?.source } },
};
i.parameters = {
  ...i.parameters,
  docs: {
    ...i.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div className="flex max-w-3xl flex-col gap-4">\r
      <Text variant="lead">Johdanto: Tämä kappale toimii ingressina.</Text>\r
      <Text variant="base">\r
        Perusteksti kuvaa tilanteen selkeasti ja neutraalisti.\r
      </Text>\r
      <Text variant="bold">\r
        Korostettu teksti nostaa esiin yhden tarkean huomiokohdan.\r
      </Text>\r
      <Text variant="muted">\r
        Hillitty teksti sopii taustatiedolle, joka ei saa varastaa huomiota.\r
      </Text>\r
      <Text variant="small">Pieni teksti toimii lisahuomautuksissa.</Text>\r
    </div>
}`,
      ...i.parameters?.docs?.source,
    },
  },
};
const u = ["Oletus", "Variantit"];
export { e as Oletus, i as Variantit, u as __namedExportsOrder, d as default };
