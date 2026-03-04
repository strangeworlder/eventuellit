import { B as f, c as t } from "./Button-SHBV2pqv.js";
import { R as d } from "./index-mTzoL55G.js";
import { j as e } from "./jsx-runtime-u17CrQMm.js";

const o = d.forwardRef(({ className: a, ...r }, s) =>
  e.jsx("div", {
    ref: s,
    className: t(
      "rounded-lg border border-slate-700 bg-slate-900 text-slate-100 shadow-sm overflow-hidden",
      a,
    ),
    ...r,
  }),
);
o.displayName = "Card";
const i = d.forwardRef(({ className: a, ...r }, s) =>
  e.jsx("div", {
    ref: s,
    className: t("flex flex-col space-y-1.5 p-6 border-b border-slate-800", a),
    ...r,
  }),
);
i.displayName = "CardHeader";
const l = d.forwardRef(({ className: a, ...r }, s) =>
  e.jsx("h3", {
    ref: s,
    className: t("text-2xl font-semibold leading-none tracking-tight text-orange-500", a),
    ...r,
  }),
);
l.displayName = "CardTitle";
const c = d.forwardRef(({ className: a, ...r }, s) =>
  e.jsx("p", { ref: s, className: t("text-sm text-slate-400", a), ...r }),
);
c.displayName = "CardDescription";
const m = d.forwardRef(({ className: a, ...r }, s) =>
  e.jsx("div", { ref: s, className: t("p-6 pt-6", a), ...r }),
);
m.displayName = "CardContent";
const p = d.forwardRef(({ className: a, ...r }, s) =>
  e.jsx("div", { ref: s, className: t("flex items-center p-6 pt-0", a), ...r }),
);
p.displayName = "CardFooter";
o.__docgenInfo = { description: "", methods: [], displayName: "Card" };
i.__docgenInfo = { description: "", methods: [], displayName: "CardHeader" };
l.__docgenInfo = { description: "", methods: [], displayName: "CardTitle" };
c.__docgenInfo = { description: "", methods: [], displayName: "CardDescription" };
m.__docgenInfo = { description: "", methods: [], displayName: "CardContent" };
p.__docgenInfo = { description: "", methods: [], displayName: "CardFooter" };
const h = {
    title: "Components/Card",
    component: o,
    parameters: { layout: "centered" },
    tags: ["autodocs"],
  },
  n = {
    render: () =>
      e.jsxs(o, {
        className: "w-[350px]",
        children: [
          e.jsxs(i, {
            children: [
              e.jsx(l, { children: "Keho (Sisu)" }),
              e.jsx(c, { children: "Ominaisuudet ja vauriot" }),
            ],
          }),
          e.jsx(m, {
            children: e.jsx("div", {
              className: "grid w-full items-center gap-4",
              children: e.jsxs("div", {
                className: "flex flex-col space-y-1.5",
                children: [
                  e.jsx("span", { className: "text-sm font-medium", children: "Kesto: 4 / 5" }),
                  e.jsx("div", {
                    className: "h-2 w-full bg-slate-800 rounded-full overflow-hidden",
                    children: e.jsx("div", {
                      className: "h-full bg-orange-500",
                      style: { width: "80%" },
                    }),
                  }),
                ],
              }),
            }),
          }),
          e.jsxs(p, {
            className: "flex justify-between",
            children: [
              e.jsx(f, { variant: "secondary", children: "Peruuta" }),
              e.jsx(f, { children: "Paranna" }),
            ],
          }),
        ],
      }),
  };
n.parameters = {
  ...n.parameters,
  docs: {
    ...n.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <Card className="w-[350px]">\r
      <CardHeader>\r
        <CardTitle>Keho (Sisu)</CardTitle>\r
        <CardDescription>Ominaisuudet ja vauriot</CardDescription>\r
      </CardHeader>\r
      <CardContent>\r
        <div className="grid w-full items-center gap-4">\r
          <div className="flex flex-col space-y-1.5">\r
            <span className="text-sm font-medium">Kesto: 4 / 5</span>\r
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">\r
              <div className="h-full bg-orange-500" style={{
              width: "80%"
            }} />\r
            </div>\r
          </div>\r
        </div>\r
      </CardContent>\r
      <CardFooter className="flex justify-between">\r
        <Button variant="secondary">Peruuta</Button>\r
        <Button>Paranna</Button>\r
      </CardFooter>\r
    </Card>
}`,
      ...n.parameters?.docs?.source,
    },
  },
};
const N = ["Default"];
export { n as Default, N as __namedExportsOrder, h as default };
