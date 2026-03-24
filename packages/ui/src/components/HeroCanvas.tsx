import React, { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    radius: number;
    opacity: number;
    twinkleSpeed: number;
    twinkleOffset: number;
    parallaxFactor: number;
}

const THEME_COLOR_VARS = [
    "--theme-primary",
    "--theme-secondary",
    "--theme-accent",
] as const;

interface Planet {
    /** X position as fraction of canvas width (0-1) */
    xFrac: number;
    /** Y position as fraction of canvas height (0-1) */
    yFrac: number;
    /** Radius as fraction of canvas height */
    radiusFrac: number;
    /** Index into THEME_COLOR_VARS */
    colorIndex: number;
}

interface HeroCanvasProps {
    className?: string;
}

const STAR_COUNT = 180;

function buildPlanet(): Planet {
    return {
        xFrac: Math.random() * 0.35 + 0.55,
        yFrac: Math.random() * 0.45 + 0.7,
        radiusFrac: Math.random() * 0.3 + 0.25,
        colorIndex: Math.floor(Math.random() * THEME_COLOR_VARS.length),
    };
}

/** Resolve a CSS custom property to an rgba string with custom alpha */
function resolveThemeColor(el: Element, varName: string, alpha: number): string {
    const raw = getComputedStyle(el).getPropertyValue(varName).trim();
    const ctx = document.createElement("canvas").getContext("2d");
    if (!ctx) return `rgba(136,136,204,${alpha})`;
    ctx.fillStyle = raw || "#8888cc";
    const resolved = ctx.fillStyle;
    if (resolved.startsWith("#")) {
        const r = parseInt(resolved.slice(1, 3), 16);
        const g = parseInt(resolved.slice(3, 5), 16);
        const b = parseInt(resolved.slice(5, 7), 16);
        return `rgba(${r},${g},${b},${alpha})`;
    }
    return resolved.replace(/rgba?\(([^)]+)\)/, (_, inner) => {
        const parts = inner.split(",").map((s: string) => s.trim());
        return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha})`;
    });
}

function buildStars(width: number, height: number): Star[] {
    const stars: Star[] = [];
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 0.8 + 0.1,
            opacity: Math.random() * 0.6 + 0.05,
            twinkleSpeed: Math.random() * 0.8 + 0.3,
            twinkleOffset: Math.random() * Math.PI * 2,
            parallaxFactor: Math.random() * 0.3 + 0.05,
        });
    }
    return stars;
}

export const HeroCanvas = React.forwardRef<HTMLCanvasElement, HeroCanvasProps>(
    ({ className }, ref) => {
        const internalRef = useRef<HTMLCanvasElement>(null);
        const canvasRef = (ref as React.RefObject<HTMLCanvasElement>) ?? internalRef;
        const animationRef = useRef<number>(0);
        const starsRef = useRef<Star[]>([]);
        const planetRef = useRef<Planet>(buildPlanet());
        const mouseRef = useRef({ x: 0, y: 0 });
        const targetMouseRef = useRef({ x: 0, y: 0 });

        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            let width = 0;
            let height = 0;
            let cachedRimColor = "rgba(136,136,204,0.2)";

            function resize() {
                if (!canvas) return;
                width = canvas.offsetWidth;
                height = canvas.offsetHeight;
                canvas.width = width;
                canvas.height = height;
                starsRef.current = buildStars(width, height);
                cachedRimColor = resolveThemeColor(
                    canvas,
                    THEME_COLOR_VARS[planetRef.current.colorIndex] ?? "--theme-secondary",
                    0.2
                );
            }

            resize();

            const ro = new ResizeObserver(resize);
            ro.observe(canvas);

            const handleMouseMove = (e: MouseEvent) => {
                const rect = canvas!.getBoundingClientRect();
                targetMouseRef.current = {
                    x: (e.clientX - rect.left) / rect.width - 0.5,
                    y: (e.clientY - rect.top) / rect.height - 0.5,
                };
            };
            document.addEventListener("mousemove", handleMouseMove);

            let t = 0;

            function draw() {
                if (!ctx) return;
                ctx.clearRect(0, 0, width, height);

                // Smooth parallax mouse tracking
                mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.05;
                mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.05;

                const mx = mouseRef.current.x;
                const my = mouseRef.current.y;

                // --- Stars ---
                for (const star of starsRef.current) {
                    const twinkle = Math.sin(t * star.twinkleSpeed + star.twinkleOffset) * 0.3 + 0.7;
                    const px = star.x + mx * star.parallaxFactor * width * 0.2;
                    const py = star.y + my * star.parallaxFactor * height * 0.1;

                    ctx.beginPath();
                    ctx.arc(px, py, star.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255,255,255,${(star.opacity * twinkle).toFixed(3)})`;
                    ctx.fill();
                }

                // --- Planet silhouette ---
                const planet = planetRef.current;
                const pr = Math.min(width, height) * planet.radiusFrac;
                const pcx = width * planet.xFrac + mx * 20;
                const pcy = height * planet.yFrac + my * 15;

                // Planet body (dark silhouette)
                ctx.beginPath();
                ctx.arc(pcx, pcy, pr, 0, Math.PI * 2);
                const planetGrad = ctx.createRadialGradient(
                    pcx - pr * 0.3,
                    pcy - pr * 0.3,
                    pr * 0.05,
                    pcx,
                    pcy,
                    pr
                );
                planetGrad.addColorStop(0, "rgba(30,25,45,0.95)");
                planetGrad.addColorStop(0.7, "rgba(15,10,28,0.98)");
                planetGrad.addColorStop(1, "rgba(5,3,12,1)");
                ctx.fillStyle = planetGrad;
                ctx.fill();

                // Planet rim glow (atmospheric halo) — color from design system
                const rimGrad = ctx.createRadialGradient(pcx, pcy, pr * 0.82, pcx, pcy, pr * 1.18);
                rimGrad.addColorStop(0, "rgba(0,0,0,0)");
                rimGrad.addColorStop(0.4, cachedRimColor);
                rimGrad.addColorStop(1, "rgba(0,0,0,0)");
                ctx.beginPath();
                ctx.arc(pcx, pcy, pr * 1.18, 0, Math.PI * 2);
                ctx.fillStyle = rimGrad;
                ctx.fill();

                // Surface detail: subtle horizontal bands
                ctx.save();
                ctx.beginPath();
                ctx.arc(pcx, pcy, pr, 0, Math.PI * 2);
                ctx.clip();
                for (let band = 0; band < 4; band++) {
                    const bandY = pcy - pr * 0.5 + band * pr * 0.38;
                    const bandH = pr * 0.12;
                    const grad = ctx.createLinearGradient(pcx - pr, bandY, pcx + pr, bandY);
                    grad.addColorStop(0, "rgba(255,255,255,0)");
                    grad.addColorStop(0.35, "rgba(255,255,255,0.025)");
                    grad.addColorStop(0.5, "rgba(255,255,255,0.04)");
                    grad.addColorStop(0.65, "rgba(255,255,255,0.025)");
                    grad.addColorStop(1, "rgba(255,255,255,0)");
                    ctx.fillStyle = grad;
                    ctx.fillRect(pcx - pr, bandY - bandH / 2, pr * 2, bandH);
                }
                ctx.restore();

                t += 0.016;
                animationRef.current = requestAnimationFrame(draw);
            }

            animationRef.current = requestAnimationFrame(draw);

            return () => {
                cancelAnimationFrame(animationRef.current);
                ro.disconnect();
                document.removeEventListener("mousemove", handleMouseMove);
            };
        }, [canvasRef]);

        return (
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className={className}
                style={{ display: "block", width: "100%", height: "100%" }}
            />
        );
    }
);

HeroCanvas.displayName = "HeroCanvas";
