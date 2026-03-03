import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

const meta = {
    title: 'Design System/Colors',
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// The color data generated from our contrast script
const colorData = {
    "base": {
        "primary": "#da4b4b",
        "secondary": "#0d8c87",
        "accent": "#6e6eff",
        "background": "#0f0f13",
        "text": "#f4f4f0"
    },
    "scales": {
        "primary": {
            "50": "#fdf4f4",
            "100": "#f4caca",
            "200": "#eba0a0",
            "300": "#e37575",
            "400": "#de6060",
            "500": "#da4b4b",
            "600": "#d63636",
            "700": "#c92929",
            "800": "#9e2121",
            "900": "#741818"
        },
        "secondary": {
            "50": "#73f2ed",
            "100": "#44eee7",
            "200": "#16e9e1",
            "300": "#11bbb4",
            "400": "#0fa39e",
            "500": "#0d8c87",
            "600": "#0b7571",
            "700": "#095d5a",
            "800": "#042f2d",
            "900": "#000000"
        },
        "accent": {
            "50": "#ffffff",
            "100": "#ffffff",
            "200": "#d4d4ff",
            "300": "#a1a1ff",
            "400": "#8888ff",
            "500": "#6e6eff",
            "600": "#5555ff",
            "700": "#3b3bff",
            "800": "#0808ff",
            "900": "#0000d4"
        }
    },
    "foreground": {
        "primary": "#0f0f13",
        "secondary": "#0f0f13",
        "accent": "#0f0f13"
    }
};

// Accessibility Contrast Helpers
function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1]!, 16),
        g: parseInt(result[2]!, 16),
        b: parseInt(result[3]!, 16)
    } : { r: 0, g: 0, b: 0 };
}

function getLuminance(r: number, g: number, b: number) {
    const a = [r, g, b].map(function (v) {
        v /= 255;
        return v <= 0.03928
            ? v / 12.92
            : Math.pow((v + 0.055) / 1.055, 2.4);
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

const ColorSwatchBlock = ({ name, color, textColor }: { name: string; color: string; textColor?: string }) => (
    <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        backgroundColor: color,
        color: textColor || '#000',
        padding: '1rem',
        borderRadius: '0.5rem',
        minWidth: '100px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
    }}
    >
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: '0.875rem', opacity: 0.8, fontFamily: 'monospace' }}>{color}</div>
    </div>
);

const ColorScale = ({ name, scale, foregroundColor }: { name: string; scale: Record<string, string>; foregroundColor: string }) => {
    // Utility for text color on scales. Lighter colors get dark text, darker colors get light text.
    // We already know middle gets dark text due to our generation rules.
    const getTextForWeight = (weight: string) => parseInt(weight) < 500 ? '#0f0f13' : foregroundColor;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
            <h3 style={{ textTransform: 'capitalize', fontSize: '1.5rem', fontWeight: 'bold' }}>{name}</h3>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {Object.entries(scale).map(([weight, hex]) => (
                    <ColorSwatchBlock key={weight} name={weight} color={hex} textColor={weight === '500' ? foregroundColor : getTextForWeight(weight)} />
                ))}
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1.5rem',
                backgroundColor: colorData.base.background,
                color: colorData.base.text,
                borderRadius: '0.5rem',
                border: '1px solid #333'
            }}>
                <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Accessibility Chart (Use this with this)</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>

                    <div style={{ padding: '1rem', backgroundColor: colorData.base.background, border: `1px solid ${scale['500']}`, borderRadius: '0.25rem' }}>
                        <p style={{ color: colorData.base.text }}>Dark Background ({colorData.base.background})</p>
                        <p style={{ color: scale['500'], fontWeight: 'bold', marginTop: '0.5rem' }}>Safe Text Color: {name}-500</p>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: scale['500'], border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.25rem' }}>
                        <p style={{ color: foregroundColor }}>{name}-500 Background ({scale['500']})</p>
                        <p style={{ color: foregroundColor, fontWeight: 'bold', marginTop: '0.5rem' }}>Safe Text Color: {foregroundColor === colorData.base.text ? 'Text (#f4f4f0)' : 'Background (#0f0f13)'}</p>
                    </div>

                </div>
            </div>
        </div>
    );
}

const CrossColorCombinations = () => {
    // Collect all colors in the system
    const allColors: { name: string, hex: string, group: string }[] = [
        { name: 'Background', hex: colorData.base.background, group: 'Base' },
        { name: 'Text', hex: colorData.base.text, group: 'Base' },
        { name: 'Primary (Base)', hex: colorData.base.primary, group: 'Base' },
        { name: 'Secondary (Base)', hex: colorData.base.secondary, group: 'Base' },
        { name: 'Accent (Base)', hex: colorData.base.accent, group: 'Base' },
    ];

    Object.entries(colorData.scales).forEach(([scaleName, scale]) => {
        Object.entries(scale).forEach(([weight, hex]) => {
            allColors.push({ name: `${scaleName}-${weight}`, hex, group: scaleName });
        });
    });

    // Remove duplicates based on hex (e.g. Primary Base == Primary 500)
    const uniqueColorsMap = new Map<string, typeof allColors[0]>();
    allColors.forEach(c => uniqueColorsMap.set(c.hex, c));
    const uniqueColors = Array.from(uniqueColorsMap.values());

    return (
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid #333' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '1rem' }}>
                Full Context Matrix
            </h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '80ch', opacity: 0.9, lineHeight: 1.6 }}>
                This is a comprehensive, exhaustive list of every valid WCAG 2.1 AA (4.5:1) text color that can be used on top of every possible background color in our system.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                {uniqueColors.map(bg => {
                    const validForegrounds = uniqueColors.filter(fg => getContrast(bg.hex, fg.hex) >= 4.5);

                    if (validForegrounds.length === 0) return null;

                    return (
                        <div key={bg.name} style={{
                            backgroundColor: bg.hex,
                            borderRadius: '0.75rem',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: `1px solid ${getContrast(bg.hex, '#ffffff') >= 4.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                        }}>
                            <div style={{
                                padding: '1.5rem',
                                borderBottom: `1px solid ${getContrast(bg.hex, '#ffffff') >= 4.5 ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`
                            }}>
                                <span style={{
                                    textTransform: 'uppercase',
                                    fontSize: '0.75rem',
                                    letterSpacing: '0.05em',
                                    fontWeight: 'bold',
                                    color: getContrast(bg.hex, '#ffffff') >= 4.5 ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)'
                                }}>
                                    Background
                                </span>
                                <h3 style={{
                                    fontSize: '1.25rem',
                                    fontWeight: 'bold',
                                    marginTop: '0.25rem',
                                    color: getContrast(bg.hex, '#ffffff') >= 4.5 ? '#ffffff' : '#000000'
                                }}>
                                    {bg.name} <span style={{ opacity: 0.5, fontSize: '1rem', fontWeight: 'normal' }}>{bg.hex}</span>
                                </h3>
                            </div>

                            <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                                {validForegrounds.map(fg => {
                                    const ratio = getContrast(bg.hex, fg.hex).toFixed(1);
                                    return (
                                        <div key={fg.name} style={{
                                            color: fg.hex,
                                            backgroundColor: 'transparent',
                                            padding: '0.35rem 0.75rem',
                                            borderRadius: '9999px',
                                            border: `1px solid ${fg.hex}`,
                                            fontSize: '0.875rem',
                                            fontWeight: 600,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: `inset 0 0 0 1px ${fg.hex}20` // Subtle inner glow using the same color
                                        }}>
                                            <span>{fg.name}</span>
                                            <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>{ratio}</span>
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
        <div style={{
            padding: '2rem',
            backgroundColor: colorData.base.background,
            color: colorData.base.text,
            minHeight: '100vh',
            fontFamily: 'Inter, sans-serif'
        }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', marginBottom: '1rem' }}>
                Colors & Accessibility
            </h1>
            <p style={{ fontSize: '1.1rem', marginBottom: '3rem', maxWidth: '80ch', opacity: 0.9, lineHeight: 1.6 }}>
                This chart displays the base design system colors mathematically adjusted to meet WCAG 2.1 AA minimum
                contrast ratio (4.5:1 for normal text) against the default dark background (`#0f0f13`).
                It provides a 10-step scale (50-900) and strict "use this with this" pairings for accessible design.
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
