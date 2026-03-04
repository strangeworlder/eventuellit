import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import "../styles.css";

const meta = {
  title: "Design System/Typography",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SampleText = "The quick brown fox jumps over the lazy dog";

export const Chart: Story = {
  render: () => (
    <div
      style={{
        padding: "2rem",
        backgroundColor: "#0f0f13",
        color: "#f4f4f0",
        minHeight: "100vh",
      }}
    >
      <div style={{ marginBottom: "4rem" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: 700,
            fontFamily: "var(--font-heading)",
            marginBottom: "1rem",
          }}
        >
          Typography
        </h1>
        <p
          style={{
            fontSize: "1.1rem",
            fontFamily: "var(--font-sans)",
            maxWidth: "80ch",
            opacity: 0.9,
            lineHeight: 1.6,
          }}
        >
          The design system relies on two font families. Headings prioritize structural clarity and
          personality, while body text prioritizes legibility at smaller sizes.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {/* Headings */}
        <div>
          <div
            style={{ borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "2rem" }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontFamily: "var(--font-heading)",
                color: "var(--color-primary)",
              }}
            >
              Headings (Outfit)
            </h2>
            <code style={{ fontSize: "0.875rem", opacity: 0.7 }}>
              font-family: var(--font-heading)
            </code>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Heading 1 (h1) - Bold 700
              </span>
              <div
                style={{
                  fontSize: "3rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                }}
              >
                {SampleText}
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Heading 2 (h2) - Bold 700
              </span>
              <div
                style={{
                  fontSize: "2.25rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                }}
              >
                {SampleText}
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Heading 3 (h3) - Bold 700
              </span>
              <div
                style={{
                  fontSize: "1.875rem",
                  fontFamily: "var(--font-heading)",
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                }}
              >
                {SampleText}
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ marginTop: "2rem" }}>
          <div
            style={{ borderBottom: "1px solid #333", paddingBottom: "1rem", marginBottom: "2rem" }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                fontFamily: "var(--font-heading)",
                color: "var(--color-secondary)",
              }}
            >
              Body Content (Inter)
            </h2>
            <code style={{ fontSize: "0.875rem", opacity: 0.7 }}>
              font-family: var(--font-sans)
            </code>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Large Text (1.125rem) - Regular 400
              </span>
              <div
                style={{
                  fontSize: "1.125rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  lineHeight: 1.6,
                }}
              >
                {SampleText}
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Base Text (1rem) - Regular 400
              </span>
              <div
                style={{
                  fontSize: "1rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                {SampleText}
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Small Text (0.875rem) - Regular 400
              </span>
              <div
                style={{
                  fontSize: "0.875rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 400,
                  lineHeight: 1.4,
                }}
              >
                {SampleText}
              </div>
            </div>
            <div>
              <span
                style={{
                  fontSize: "0.875rem",
                  opacity: 0.6,
                  display: "block",
                  marginBottom: "0.25rem",
                }}
              >
                Body Text - Bold 600
              </span>
              <div style={{ fontSize: "1rem", fontFamily: "var(--font-sans)", fontWeight: 600 }}>
                {SampleText}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
