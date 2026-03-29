import { j as e } from "./jsx-runtime-u17CrQMm.js";
const g = { title: "Suunnittelujarjestelma/Perustat/Colors", parameters: { layout: "padded" } },
  o = {
    base: {
      primary: "#cf534a",
      secondary: "#278b86",
      accent: "#5479de",
      background: "#0f0f13",
      text: "#f4f4f0",
    },
    scales: {
      primary: {
        50: "#faeceb",
        100: "#f4d9d7",
        200: "#ecbab6",
        300: "#e5a39e",
        400: "#d8756e",
        500: "#cf534a",
        600: "#bd3c32",
        700: "#9d312a",
        800: "#792620",
        900: "#591c18",
      },
      secondary: {
        50: "#dff6f5",
        100: "#bfedeb",
        200: "#90e0dc",
        300: "#5cd1cb",
        400: "#35bbb4",
        500: "#278b86",
        600: "#227773",
        700: "#1c6360",
        800: "#154c49",
        900: "#0f3432",
      },
      accent: {
        50: "#eaeefb",
        100: "#d4ddf7",
        200: "#b2c3f0",
        300: "#9cb2ec",
        400: "#6d8de3",
        500: "#5479de",
        600: "#315ed8",
        700: "#234bb8",
        800: "#1b398d",
        900: "#142a67",
      },
    },
    foreground: { primary: "#0f0f13", secondary: "#0f0f13", accent: "#0f0f13" },
  };
function c(n) {
  const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n);
  return r
    ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) }
    : { r: 0, g: 0, b: 0 };
}
function f(n, r, s) {
  const t = [n, r, s].map(
    (a) => ((a /= 255), a <= 0.03928 ? a / 12.92 : ((a + 0.055) / 1.055) ** 2.4),
  );
  return t[0] * 0.2126 + t[1] * 0.7152 + t[2] * 0.0722;
}
function l(n, r) {
  const s = c(n),
    t = c(r),
    a = f(s.r, s.g, s.b),
    i = f(t.r, t.g, t.b),
    d = Math.max(a, i),
    p = Math.min(a, i);
  return (d + 0.05) / (p + 0.05);
}
const u = ({ name: n, color: r, textColor: s }) =>
    e.jsxs("div", {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
        backgroundColor: r,
        color: s || "#000",
        padding: "1rem",
        borderRadius: "0.5rem",
        minWidth: "100px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
      },
      children: [
        e.jsx("div", { style: { fontWeight: 600 }, children: n }),
        e.jsx("div", {
          style: { fontSize: "0.875rem", opacity: 0.8, fontFamily: "monospace" },
          children: r,
        }),
      ],
    }),
  x = ({ name: n, scale: r, foregroundColor: s }) => {
    const t = (a) => (parseInt(a) < 500 ? "#0f0f13" : s);
    return e.jsxs("div", {
      style: { display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" },
      children: [
        e.jsx("h3", {
          style: { textTransform: "capitalize", fontSize: "1.5rem", fontWeight: "bold" },
          children: n,
        }),
        e.jsx("div", {
          style: { display: "flex", gap: "1rem", flexWrap: "wrap" },
          children: Object.entries(r).map(([a, i]) =>
            e.jsx(u, { name: a, color: i, textColor: a === "500" ? s : t(a) }, a),
          ),
        }),
        e.jsxs("div", {
          style: {
            marginTop: "1rem",
            padding: "1.5rem",
            backgroundColor: o.base.background,
            color: o.base.text,
            borderRadius: "0.5rem",
            border: "1px solid #333",
          },
          children: [
            e.jsx("h4", {
              style: { marginBottom: "1rem", fontSize: "1.1rem" },
              children: "Saavutettavuus (Käytä tätä tämän kanssa)",
            }),
            e.jsxs("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "1rem",
              },
              children: [
                e.jsxs("div", {
                  style: {
                    padding: "1rem",
                    backgroundColor: o.base.background,
                    border: `1px solid ${r[500]}`,
                    borderRadius: "0.25rem",
                  },
                  children: [
                    e.jsxs("p", {
                      style: { color: o.base.text },
                      children: ["Tumma tausta (", o.base.background, ")"],
                    }),
                    e.jsxs("p", {
                      style: { color: r[500], fontWeight: "bold", marginTop: "0.5rem" },
                      children: ["Turvallinen tekstiväri: ", n, "-500"],
                    }),
                  ],
                }),
                e.jsxs("div", {
                  style: {
                    padding: "1rem",
                    backgroundColor: r[500],
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "0.25rem",
                  },
                  children: [
                    e.jsxs("p", {
                      style: { color: s },
                      children: [n, "-500 tausta (", r[500], ")"],
                    }),
                    e.jsxs("p", {
                      style: { color: s, fontWeight: "bold", marginTop: "0.5rem" },
                      children: [
                        "Turvallinen tekstiväri:",
                        " ",
                        s === o.base.text ? "Teksti (#f4f4f0)" : "Tausta (#0f0f13)",
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    });
  },
  h = () => {
    const n = [
      { name: "Tausta", hex: o.base.background, group: "Perus" },
      { name: "Teksti", hex: o.base.text, group: "Perus" },
      { name: "Primary (Perus)", hex: o.base.primary, group: "Perus" },
      { name: "Secondary (Perus)", hex: o.base.secondary, group: "Perus" },
      { name: "Accent (Perus)", hex: o.base.accent, group: "Perus" },
    ];
    Object.entries(o.scales).forEach(([t, a]) => {
      Object.entries(a).forEach(([i, d]) => {
        n.push({ name: `${t}-${i}`, hex: d, group: t });
      });
    });
    const r = new Map();
    n.forEach((t) => r.set(t.hex, t));
    const s = Array.from(r.values());
    return e.jsxs("div", {
      style: { marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid #333" },
      children: [
        e.jsx("h2", {
          style: {
            fontSize: "2.5rem",
            fontWeight: 700,
            fontFamily: "Outfit, sans-serif",
            marginBottom: "1rem",
          },
          children: "Täysi kontekstimatriisi",
        }),
        e.jsx("p", {
          style: {
            fontSize: "1.1rem",
            marginBottom: "3rem",
            maxWidth: "80ch",
            opacity: 0.9,
            lineHeight: 1.6,
          },
          children:
            "Tämä on kattava lista kaikista WCAG 2.1 AA (4.5:1) -kelpoisista tekstiväreistä, joita voi käyttää jokaisen järjestelmän taustavärin päällä.",
        }),
        e.jsx("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "2rem",
          },
          children: s.map((t) => {
            const a = s.filter((i) => l(t.hex, i.hex) >= 4.5);
            return a.length === 0
              ? null
              : e.jsxs(
                  "div",
                  {
                    style: {
                      backgroundColor: t.hex,
                      borderRadius: "0.75rem",
                      overflow: "hidden",
                      boxShadow:
                        "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: `1px solid ${l(t.hex, "#ffffff") >= 4.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                    },
                    children: [
                      e.jsxs("div", {
                        style: {
                          padding: "1.5rem",
                          borderBottom: `1px solid ${l(t.hex, "#ffffff") >= 4.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                        },
                        children: [
                          e.jsx("span", {
                            style: {
                              textTransform: "uppercase",
                              fontSize: "0.75rem",
                              letterSpacing: "0.05em",
                              fontWeight: "bold",
                              color:
                                l(t.hex, "#ffffff") >= 4.5
                                  ? "rgba(255,255,255,0.6)"
                                  : "rgba(0,0,0,0.6)",
                            },
                            children: "Tausta",
                          }),
                          e.jsxs("h3", {
                            style: {
                              fontSize: "1.25rem",
                              fontWeight: "bold",
                              marginTop: "0.25rem",
                              color: l(t.hex, "#ffffff") >= 4.5 ? "#ffffff" : "#000000",
                            },
                            children: [
                              t.name,
                              " ",
                              e.jsx("span", {
                                style: { opacity: 0.5, fontSize: "1rem", fontWeight: "normal" },
                                children: t.hex,
                              }),
                            ],
                          }),
                        ],
                      }),
                      e.jsx("div", {
                        style: {
                          padding: "1.5rem",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.75rem",
                        },
                        children: a.map((i) => {
                          const d = l(t.hex, i.hex).toFixed(1);
                          return e.jsxs(
                            "div",
                            {
                              style: {
                                color: i.hex,
                                backgroundColor: "transparent",
                                padding: "0.35rem 0.75rem",
                                borderRadius: "9999px",
                                border: `1px solid ${i.hex}`,
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem",
                                boxShadow: `inset 0 0 0 1px ${i.hex}20`,
                              },
                              children: [
                                e.jsx("span", { children: i.name }),
                                e.jsx("span", {
                                  style: { fontSize: "0.75rem", opacity: 0.8 },
                                  children: d,
                                }),
                              ],
                            },
                            i.name,
                          );
                        }),
                      }),
                    ],
                  },
                  t.name,
                );
          }),
        }),
      ],
    });
  },
  m = {
    render: () =>
      e.jsxs("div", {
        style: {
          padding: "2rem",
          backgroundColor: o.base.background,
          color: o.base.text,
          minHeight: "100vh",
          fontFamily: "Inter, sans-serif",
        },
        children: [
          e.jsx("h1", {
            style: {
              fontSize: "2.5rem",
              fontWeight: 700,
              fontFamily: "Outfit, sans-serif",
              marginBottom: "1rem",
            },
            children: "Värit ja saavutettavuus",
          }),
          e.jsx("p", {
            style: {
              fontSize: "1.1rem",
              marginBottom: "3rem",
              maxWidth: "80ch",
              opacity: 0.9,
              lineHeight: 1.6,
            },
            children:
              'Tämä näkymä esittää design-järjestelmän perusvärit niin, että ne täyttävät WCAG 2.1 AA -minimikontrastin (4.5:1 normaalille tekstille) oletustummaa taustaa (`#0f0f13`) vasten. Mukana on 10-portainen asteikko (50-900) sekä selkeät "käytä tätä tämän kanssa" -parit saavutettavaan käyttöön.',
          }),
          Object.entries(o.scales).map(([n, r]) =>
            e.jsx(x, { name: n, scale: r, foregroundColor: o.foreground[n] }, n),
          ),
          e.jsx(h, {}),
        ],
      }),
  };
m.parameters = {
  ...m.parameters,
  docs: {
    ...m.parameters?.docs,
    source: {
      originalSource: `{
  render: () => <div style={{
    padding: "2rem",
    backgroundColor: colorData.base.background,
    color: colorData.base.text,
    minHeight: "100vh",
    fontFamily: "Inter, sans-serif"
  }}>\r
      <h1 style={{
      fontSize: "2.5rem",
      fontWeight: 700,
      fontFamily: "Outfit, sans-serif",
      marginBottom: "1rem"
    }}>\r
        Värit ja saavutettavuus\r
      </h1>\r
      <p style={{
      fontSize: "1.1rem",
      marginBottom: "3rem",
      maxWidth: "80ch",
      opacity: 0.9,
      lineHeight: 1.6
    }}>\r
        Tämä näkymä esittää design-järjestelmän perusvärit niin, että ne täyttävät WCAG 2.1 AA\r
        -minimikontrastin (4.5:1 normaalille tekstille) oletustummaa taustaa (\`#0f0f13\`) vasten.\r
        Mukana on 10-portainen asteikko (50-900) sekä selkeät "käytä tätä tämän kanssa" -parit\r
        saavutettavaan käyttöön.\r
      </p>\r
\r
      {Object.entries(colorData.scales).map(([name, scale]) => <ColorScale key={name} name={name} scale={scale} foregroundColor={(colorData.foreground as any)[name]} />)}\r
\r
      <CrossColorCombinations />\r
    </div>
}`,
      ...m.parameters?.docs?.source,
    },
  },
};
const y = ["Chart"];
export { m as Chart, y as __namedExportsOrder, g as default };
