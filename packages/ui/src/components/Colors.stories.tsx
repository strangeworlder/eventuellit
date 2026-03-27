import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta = {
  title: "Suunnittelujarjestelma/Perustat/Colors",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// The color data generated from our contrast script
const colorData = {
  base: {
    primary: "#cf534a",
    secondary: "#278b86",
    accent: "#5479de",
    "royal-purple": "#9b5de5",
    background: "#0f0f13",
    text: "#f4f4f0",
  },
  scales: {
    primary: {
      "50": "#faeceb",
      "100": "#f4d9d7",
      "200": "#ecbab6",
      "300": "#e5a39e",
      "400": "#d8756e",
      "500": "#cf534a",
      "600": "#bd3c32",
      "700": "#9d312a",
      "800": "#792620",
      "900": "#591c18",
    },
    secondary: {
      "50": "#dff6f5",
      "100": "#bfedeb",
      "200": "#90e0dc",
      "300": "#5cd1cb",
      "400": "#35bbb4",
      "500": "#278b86",
      "600": "#227773",
      "700": "#1c6360",
      "800": "#154c49",
      "900": "#0f3432",
    },
    accent: {
      "50": "#eaeefb",
      "100": "#d4ddf7",
      "200": "#b2c3f0",
      "300": "#9cb2ec",
      "400": "#6d8de3",
      "500": "#5479de",
      "600": "#315ed8",
      "700": "#234bb8",
      "800": "#1b398d",
      "900": "#142a67",
    },
    "royal-purple": {
      "50": "#f3edfd",
      "100": "#e7dbfb",
      "200": "#d3bdf6",
      "300": "#c2a3f2",
      "400": "#ae7eec",
      "500": "#9b5de5",
      "600": "#8341d4",
      "700": "#6b33b2",
      "800": "#522789",
      "900": "#3c1d64",
    },
  },
  foreground: {
    primary: "#0f0f13",
    secondary: "#0f0f13",
    accent: "#0f0f13",
    "royal-purple": "#0f0f13",
  },
};

// Accessibility Contrast Helpers
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16),
      }
    : { r: 0, g: 0, b: 0 };
}

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return a[0]! * 0.2126 + a[1]! * 0.7152 + a[2]! * 0.0722;
}

function getContrast(hex1: string, hex2: string) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

const ColorSwatchBlock = ({
  name,
  color,
  textColor,
}: {
  name: string;
  color: string;
  textColor?: string;
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "0.5rem",
      backgroundColor: color,
      color: textColor || "#000",
      padding: "1rem",
      borderRadius: "0.5rem",
      minWidth: "100px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    }}
  >
    <div style={{ fontWeight: 600 }}>{name}</div>
    <div style={{ fontSize: "0.875rem", opacity: 0.8, fontFamily: "monospace" }}>{color}</div>
  </div>
);

const ColorScale = ({
  name,
  scale,
  foregroundColor,
}: {
  name: string;
  scale: Record<string, string>;
  foregroundColor: string;
}) => {
  // Utility for text color on scales. Lighter colors get dark text, darker colors get light text.
  // We already know middle gets dark text due to our generation rules.
  const getTextForWeight = (weight: string) =>
    parseInt(weight) < 500 ? "#0f0f13" : foregroundColor;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "3rem" }}>
      <h3 style={{ textTransform: "capitalize", fontSize: "1.5rem", fontWeight: "bold" }}>
        {name}
      </h3>

      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {Object.entries(scale).map(([weight, hex]) => (
          <ColorSwatchBlock
            key={weight}
            name={weight}
            color={hex}
            textColor={weight === "500" ? foregroundColor : getTextForWeight(weight)}
          />
        ))}
      </div>

      <div
        style={{
          marginTop: "1rem",
          padding: "1.5rem",
          backgroundColor: colorData.base.background,
          color: colorData.base.text,
          borderRadius: "0.5rem",
          border: "1px solid #333",
        }}
      >
        <h4 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
          Saavutettavuus (Käytä tätä tämän kanssa)
        </h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem",
              backgroundColor: colorData.base.background,
              border: `1px solid ${scale["500"]}`,
              borderRadius: "0.25rem",
            }}
          >
            <p style={{ color: colorData.base.text }}>
              Tumma tausta ({colorData.base.background})
            </p>
            <p style={{ color: scale["500"], fontWeight: "bold", marginTop: "0.5rem" }}>
              Turvallinen tekstiväri: {name}-500
            </p>
          </div>

          <div
            style={{
              padding: "1rem",
              backgroundColor: scale["500"],
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "0.25rem",
            }}
          >
            <p style={{ color: foregroundColor }}>
              {name}-500 tausta ({scale["500"]})
            </p>
            <p style={{ color: foregroundColor, fontWeight: "bold", marginTop: "0.5rem" }}>
              Turvallinen tekstiväri:{" "}
              {foregroundColor === colorData.base.text ? "Teksti (#f4f4f0)" : "Tausta (#0f0f13)"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const CrossColorCombinations = () => {
  // Collect all colors in the system
  const allColors: { name: string; hex: string; group: string }[] = [
    { name: "Tausta", hex: colorData.base.background, group: "Perus" },
    { name: "Teksti", hex: colorData.base.text, group: "Perus" },
    { name: "Primary (Perus)", hex: colorData.base.primary, group: "Perus" },
    { name: "Secondary (Perus)", hex: colorData.base.secondary, group: "Perus" },
    { name: "Accent (Perus)", hex: colorData.base.accent, group: "Perus" },
    { name: "Royal Purple (Perus)", hex: colorData.base["royal-purple"], group: "Perus" },
  ];

  Object.entries(colorData.scales).forEach(([scaleName, scale]) => {
    Object.entries(scale).forEach(([weight, hex]) => {
      allColors.push({ name: `${scaleName}-${weight}`, hex, group: scaleName });
    });
  });

  // Remove duplicates based on hex (e.g. Primary Base == Primary 500)
  const uniqueColorsMap = new Map<string, (typeof allColors)[0]>();
  allColors.forEach((c) => uniqueColorsMap.set(c.hex, c));
  const uniqueColors = Array.from(uniqueColorsMap.values());

  return (
    <div style={{ marginTop: "5rem", paddingTop: "2rem", borderTop: "1px solid #333" }}>
      <h2
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          fontFamily: "Outfit, sans-serif",
          marginBottom: "1rem",
        }}
      >
        Täysi kontekstimatriisi
      </h2>
      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "3rem",
          maxWidth: "80ch",
          opacity: 0.9,
          lineHeight: 1.6,
        }}
      >
        Tämä on kattava lista kaikista WCAG 2.1 AA (4.5:1) -kelpoisista tekstiväreistä, joita voi
        käyttää jokaisen järjestelmän taustavärin päällä.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "2rem",
        }}
      >
        {uniqueColors.map((bg) => {
          const validForegrounds = uniqueColors.filter((fg) => getContrast(bg.hex, fg.hex) >= 4.5);

          if (validForegrounds.length === 0) return null;

          return (
            <div
              key={bg.name}
              style={{
                backgroundColor: bg.hex,
                borderRadius: "0.75rem",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                border: `1px solid ${getContrast(bg.hex, "#ffffff") >= 4.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
              }}
            >
              <div
                style={{
                  padding: "1.5rem",
                  borderBottom: `1px solid ${getContrast(bg.hex, "#ffffff") >= 4.5 ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}`,
                }}
              >
                <span
                  style={{
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    letterSpacing: "0.05em",
                    fontWeight: "bold",
                    color:
                      getContrast(bg.hex, "#ffffff") >= 4.5
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(0,0,0,0.6)",
                  }}
                >
                  Tausta
                </span>
                <h3
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    marginTop: "0.25rem",
                    color: getContrast(bg.hex, "#ffffff") >= 4.5 ? "#ffffff" : "#000000",
                  }}
                >
                  {bg.name}{" "}
                  <span style={{ opacity: 0.5, fontSize: "1rem", fontWeight: "normal" }}>
                    {bg.hex}
                  </span>
                </h3>
              </div>

              <div style={{ padding: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {validForegrounds.map((fg) => {
                  const ratio = getContrast(bg.hex, fg.hex).toFixed(1);
                  return (
                    <div
                      key={fg.name}
                      style={{
                        color: fg.hex,
                        backgroundColor: "transparent",
                        padding: "0.35rem 0.75rem",
                        borderRadius: "9999px",
                        border: `1px solid ${fg.hex}`,
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        boxShadow: `inset 0 0 0 1px ${fg.hex}20`, // Subtle inner glow using the same color
                      }}
                    >
                      <span>{fg.name}</span>
                      <span style={{ fontSize: "0.75rem", opacity: 0.8 }}>{ratio}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Chart: Story = {
  render: () => (
    <div
      style={{
        padding: "2rem",
        backgroundColor: colorData.base.background,
        color: colorData.base.text,
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          fontFamily: "Outfit, sans-serif",
          marginBottom: "1rem",
        }}
      >
        Värit ja saavutettavuus
      </h1>
      <p
        style={{
          fontSize: "1.1rem",
          marginBottom: "3rem",
          maxWidth: "80ch",
          opacity: 0.9,
          lineHeight: 1.6,
        }}
      >
        Tämä näkymä esittää design-järjestelmän perusvärit niin, että ne täyttävät WCAG 2.1 AA
        -minimikontrastin (4.5:1 normaalille tekstille) oletustummaa taustaa (`#0f0f13`) vasten.
        Mukana on 10-portainen asteikko (50-900) sekä selkeät "käytä tätä tämän kanssa" -parit
        saavutettavaan käyttöön.
      </p>

      {Object.entries(colorData.scales).map(([name, scale]) => (
        <ColorScale
          key={name}
          name={name}
          scale={scale}
          foregroundColor={(colorData.foreground as any)[name]}
        />
      ))}

      <CrossColorCombinations />
    </div>
  ),
};
