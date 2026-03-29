import { j as e } from "./jsx-runtime-u17CrQMm.js";
import { R as f } from "./iframe-RLsCwdXb.js";
import { a as x, c } from "./Heading-DaMVR3YC.js";
import { I as h } from "./ImageElement-1r36W0Lk.js";
import "./preload-helper-PPVm8Dsz.js";
import "./bundle-mjs-Ce1ZTWB2.js";
import "./index-CZMlBFpi.js";
import "./index-Be63-vKY.js";
import "./Button-eGzUney-.js";
import "./Theme-9Lj_OJ7_.js";
import "./Icon-dO9IW84r.js";
import "./dice-5-CjDluqk6.js";
const l = f.forwardRef(
  (
    {
      title: d,
      description: n,
      children: m,
      className: p,
      backgroundImageSrc: t,
      backgroundImageAlt: o = "",
      ...u
    },
    g,
  ) =>
    e.jsxs("div", {
      ref: g,
      className: c(
        "relative overflow-hidden border-b-2 border-[var(--theme-secondary)] mb-6 mt-0 bg-[var(--theme-bg)] text-[var(--theme-text)] min-h-40 tablet:min-h-48",
        p,
      ),
      ...u,
      children: [
        !t &&
          e.jsx("div", {
            "aria-hidden": "true",
            className:
              "absolute inset-0 bg-gradient-to-br from-[var(--theme-bg)] via-[var(--theme-secondary)]/15 to-[var(--theme-bg)]",
          }),
        t &&
          e.jsxs(e.Fragment, {
            children: [
              e.jsx("img", {
                src: t,
                alt: o,
                "aria-hidden": o.length === 0,
                className: "absolute inset-0 h-full w-full object-cover",
              }),
              e.jsx("div", {
                "aria-hidden": "true",
                className: "absolute inset-0 bg-[var(--theme-bg)]/75",
              }),
            ],
          }),
        e.jsxs("div", {
          className: c(
            "relative z-10 px-4 py-6 tablet:py-8 min-h-40 tablet:min-h-48 flex flex-col justify-center",
            t && "pr-20",
          ),
          children: [
            e.jsx(x, { children: d }),
            n &&
              e.jsx("p", {
                className:
                  "text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]/90 mt-2",
                children: n,
              }),
            m,
          ],
        }),
        t &&
          e.jsx("div", {
            className: "absolute right-4 bottom-4 z-20",
            children: e.jsx(h, {
              src: t,
              alt: o || "Hero-kuva",
              variant: "thumbnail",
              loading: "lazy",
            }),
          }),
      ],
    }),
);
l.displayName = "Hero";
l.__docgenInfo = {
  description: "",
  methods: [],
  displayName: "Hero",
  props: {
    title: {
      required: !0,
      tsType: { name: "ReactReactNode", raw: "React.ReactNode" },
      description: "",
    },
    description: {
      required: !1,
      tsType: { name: "ReactReactNode", raw: "React.ReactNode" },
      description: "",
    },
    backgroundImageSrc: { required: !1, tsType: { name: "string" }, description: "" },
    backgroundImageAlt: {
      required: !1,
      tsType: { name: "string" },
      description: "",
      defaultValue: { value: '""', computed: !1 },
    },
  },
  composes: ["Omit"],
};
const G = {
    title: "Suunnittelujarjestelma/Komponentit/Hero",
    component: l,
    parameters: { layout: "padded" },
    argTypes: {
      title: { control: "text" },
      description: { control: "text" },
      backgroundImageSrc: { control: "text" },
      backgroundImageAlt: { control: "text" },
    },
  },
  a = {
    args: {
      title: "Sivun otsikko",
      description: "Lyhyt kuvaus sivun sisällöstä.",
      children: e.jsx("p", {
        className: "text-text/80",
        children: "Lisäsisältöä, joka näkyy hero-otsikon alla.",
      }),
    },
  },
  s = { args: { title: "Asetukset" } },
  r = {
    args: {
      title: "Mekaaninen sääntökirja",
      description: "Perusmekaniikat ja konfliktien kulku",
      backgroundImageSrc:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23022c43'/%3E%3Cstop offset='1' stop-color='%230d5f7f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='400' fill='url(%23g)'/%3E%3Ccircle cx='260' cy='120' r='90' fill='%23d95b43' fill-opacity='.9'/%3E%3Ccircle cx='1280' cy='90' r='70' fill='%23f0f3bd' fill-opacity='.7'/%3E%3C/svg%3E",
      backgroundImageAlt: "",
      children: e.jsx("p", {
        className: "text-text/80",
        children:
          "Hero näyttää taustakuvan, sisältää pikkukuvan suurennusta varten ja teksti pysyy luettavana peitekerroksen ansiosta.",
      }),
    },
  },
  i = {
    args: {
      title: "Maailma",
      backgroundImageSrc:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%230b132b'/%3E%3Cstop offset='1' stop-color='%231c2541'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='400' fill='url(%23g2)'/%3E%3Ccircle cx='320' cy='100' r='72' fill='%23f4d35e' fill-opacity='.75'/%3E%3C/svg%3E",
      backgroundImageAlt: "",
      children: e.jsx("p", {
        className: "text-text/80",
        children: "Tama nakyma varmistaa, etta minimikorkeus pysyy samana ilman kuvausta.",
      }),
    },
  };
a.parameters = {
  ...a.parameters,
  docs: {
    ...a.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    title: "Sivun otsikko",
    description: "Lyhyt kuvaus sivun sisällöstä.",
    children: <p className="text-text/80">Lisäsisältöä, joka näkyy hero-otsikon alla.</p>
  }
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
    title: "Asetukset"
  }
}`,
      ...s.parameters?.docs?.source,
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
    title: "Mekaaninen sääntökirja",
    description: "Perusmekaniikat ja konfliktien kulku",
    backgroundImageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%23022c43'/%3E%3Cstop offset='1' stop-color='%230d5f7f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='400' fill='url(%23g)'/%3E%3Ccircle cx='260' cy='120' r='90' fill='%23d95b43' fill-opacity='.9'/%3E%3Ccircle cx='1280' cy='90' r='70' fill='%23f0f3bd' fill-opacity='.7'/%3E%3C/svg%3E",
    backgroundImageAlt: "",
    children: <p className="text-text/80">\r
                Hero näyttää taustakuvan, sisältää pikkukuvan suurennusta varten ja teksti pysyy luettavana peitekerroksen ansiosta.\r
            </p>
  }
}`,
      ...r.parameters?.docs?.source,
    },
  },
};
i.parameters = {
  ...i.parameters,
  docs: {
    ...i.parameters?.docs,
    source: {
      originalSource: `{
  args: {
    title: "Maailma",
    backgroundImageSrc: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1600 400'%3E%3Cdefs%3E%3ClinearGradient id='g2' x1='0' x2='1' y1='0' y2='1'%3E%3Cstop stop-color='%230b132b'/%3E%3Cstop offset='1' stop-color='%231c2541'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1600' height='400' fill='url(%23g2)'/%3E%3Ccircle cx='320' cy='100' r='72' fill='%23f4d35e' fill-opacity='.75'/%3E%3C/svg%3E",
    backgroundImageAlt: "",
    children: <p className="text-text/80">Tama nakyma varmistaa, etta minimikorkeus pysyy samana ilman kuvausta.</p>
  }
}`,
      ...i.parameters?.docs?.source,
    },
  },
};
const H = [
  "Default",
  "WithoutDescription",
  "WithBackgroundImage",
  "WithBackgroundImageWithoutDescription",
];
export {
  a as Default,
  r as WithBackgroundImage,
  i as WithBackgroundImageWithoutDescription,
  s as WithoutDescription,
  H as __namedExportsOrder,
  G as default,
};
