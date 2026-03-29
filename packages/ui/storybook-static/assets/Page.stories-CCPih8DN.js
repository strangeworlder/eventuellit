import { j as e } from "./jsx-runtime-u17CrQMm.js";
import { C as r, b as l, c as m, a as t } from "./Card-D3vB3BNs.js";
import { t as x, c as p } from "./bundle-mjs-Ce1ZTWB2.js";
import { b as h } from "./Heading-DaMVR3YC.js";
import "./iframe-RLsCwdXb.js";
import "./preload-helper-PPVm8Dsz.js";
import "./Button-eGzUney-.js";
import "./Icon-dO9IW84r.js";
import "./dice-5-CjDluqk6.js";
import "./Theme-9Lj_OJ7_.js";
function f(...i) {
  return x(p(i));
}
function s({ children: i, className: d, theme: o, ...c }) {
  return e.jsx(h.Provider, {
    value: 1,
    children: e.jsx("div", {
      "data-theme": o,
      className: f(
        "w-full max-w-[1280px] mx-auto space-y-4 tablet:space-y-8 animate-in fade-in duration-500 bg-[var(--theme-bg)] text-[var(--theme-text)]",
        d,
      ),
      ...c,
      children: i,
    }),
  });
}
s.__docgenInfo = {
  description: `Page component serves as a layout wrapper for the main content areas within TabsContent.\r
Enforces standardized max-width, min-width, and centering.`,
  methods: [],
  displayName: "Page",
  props: {
    children: {
      required: !1,
      tsType: { name: "ReactReactNode", raw: "React.ReactNode" },
      description: "",
    },
    theme: { required: !1, tsType: { name: "string" }, description: "" },
  },
};
const I = {
    title: "Suunnittelujarjestelma/Rakenne/Page",
    component: s,
    parameters: { layout: "fullscreen" },
    tags: ["autodocs"],
  },
  a = {
    render: () =>
      e.jsxs("div", {
        className: "min-h-screen bg-background text-text flex flex-col justify-start",
        children: [
          e.jsx("div", {
            className:
              "w-full h-16 border-b border-primary/20 bg-background/50 flex items-center px-4 mb-4",
            children: "Header Navigation Simulation",
          }),
          e.jsx(s, {
            children: e.jsxs("div", {
              className: "flex flex-col space-y-4",
              children: [
                e.jsx("div", {
                  className: "border-b border-primary/20 pb-2",
                  children: e.jsx("h2", {
                    className: "text-2xl font-bold font-sans",
                    children: "Welcome to the Page Component",
                  }),
                }),
                e.jsx("p", {
                  className: "text-text/90 leading-relaxed max-w-3xl",
                  children:
                    "This component enforces a minimum width of 95vw, maximum width of 1280px, and 100% relative width with consistent padding. It's designed to live snugly within TabsContent containers across the different microfrontends.",
                }),
              ],
            }),
          }),
        ],
      }),
  },
  n = {
    render: () =>
      e.jsx("div", {
        className: "min-h-screen bg-background text-text",
        children: e.jsxs(s, {
          children: [
            e.jsxs(r, {
              variant: "primary",
              children: [
                e.jsx(l, { children: e.jsx(m, { children: "Top Section" }) }),
                e.jsx(t, { children: "Important introductory info." }),
              ],
            }),
            e.jsxs("div", {
              className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
              children: [
                e.jsx(r, {
                  variant: "subtle",
                  children: e.jsx(t, {
                    className: "h-48 flex items-center justify-center",
                    children: "Grid Item 1",
                  }),
                }),
                e.jsx(r, {
                  variant: "subtle",
                  children: e.jsx(t, {
                    className: "h-48 flex items-center justify-center",
                    children: "Grid Item 2",
                  }),
                }),
                e.jsx(r, {
                  variant: "subtle",
                  children: e.jsx(t, {
                    className: "h-48 flex items-center justify-center",
                    children: "Grid Item 3",
                  }),
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
  render: () => <div className="min-h-screen bg-background text-text flex flex-col justify-start">\r
      <div className="w-full h-16 border-b border-primary/20 bg-background/50 flex items-center px-4 mb-4">\r
        Header Navigation Simulation\r
      </div>\r
      <Page>\r
        <div className="flex flex-col space-y-4">\r
          <div className="border-b border-primary/20 pb-2">\r
            <h2 className="text-2xl font-bold font-sans">Welcome to the Page Component</h2>\r
          </div>\r
          <p className="text-text/90 leading-relaxed max-w-3xl">\r
            This component enforces a minimum width of 95vw, maximum width of 1280px, and 100%\r
            relative width with consistent padding. It's designed to live snugly within TabsContent\r
            containers across the different microfrontends.\r
          </p>\r
        </div>\r
      </Page>\r
    </div>
}`,
      ...a.parameters?.docs?.source,
    },
  },
};
n.parameters = {
  ...n.parameters,
  docs: {
    ...n.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div className="min-h-screen bg-background text-text">\r
      <Page>\r
        <Card variant="primary">\r
          <CardHeader>\r
            <CardTitle>Top Section</CardTitle>\r
          </CardHeader>\r
          <CardContent>Important introductory info.</CardContent>\r
        </Card>\r
\r
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">\r
          <Card variant="subtle">\r
            <CardContent className="h-48 flex items-center justify-center">Grid Item 1</CardContent>\r
          </Card>\r
          <Card variant="subtle">\r
            <CardContent className="h-48 flex items-center justify-center">Grid Item 2</CardContent>\r
          </Card>\r
          <Card variant="subtle">\r
            <CardContent className="h-48 flex items-center justify-center">Grid Item 3</CardContent>\r
          </Card>\r
        </div>\r
      </Page>\r
    </div>
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
const P = ["Default", "WithStackedContent"];
export { a as Default, n as WithStackedContent, P as __namedExportsOrder, I as default };
