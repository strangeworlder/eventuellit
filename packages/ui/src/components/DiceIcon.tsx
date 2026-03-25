import React from "react";
import { cn } from "./utils";

/**
 * A single decorative or semantic die face icon (d4/d6/d8/d10/d12/d20/swirl).
 * Use as a visual accent, in dice-pool UI, or as a station-node shape on the game board.
 *
 * @summary single die face icon: faces 4/6/8/10/12/20/swirl; size sm/md/lg; active changes fill color
 */
export interface DiceIconProps extends React.HTMLAttributes<HTMLDivElement> {
  faces: 4 | 6 | 8 | 10 | 12 | 20 | "swirl";
  value?: number;
  size?: "sm" | "md" | "lg";
  active?: boolean;
  /** When true, hides the number overlay, showing only the dice shape */
  hideValue?: boolean;
}

const DiceSvg = ({
  faces,
  className,
  active,
}: {
  faces: number | "swirl";
  className?: string;
  active?: boolean;
}) => {
  const style: React.CSSProperties = {
    fill: active ? "var(--theme-primary)" : "var(--theme-secondary)",
    fillOpacity: 0.8,
    stroke: active ? "var(--theme-primary)" : "var(--theme-secondary)",
  };

  switch (faces) {
    case 4:
      return (
        <svg
          viewBox="0 0 100 100"
          strokeWidth="6"
          strokeLinejoin="round"
          className={className}
          style={style}
        >
          <polygon points="50,10 90,85 10,85" />
          <path d="M50 60 L50 10 M50 60 L90 85 M50 60 L10 85" fill="none" />
        </svg>
      );
    case 6:
      return (
        <svg
          viewBox="0 0 100 100"
          strokeWidth="6"
          strokeLinejoin="round"
          className={className}
          style={style}
        >
          <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
          <path d="M50 50 L50 90 M50 50 L15 30 M50 50 L85 30" fill="none" />
        </svg>
      );
    case 8:
      return (
        <svg
          viewBox="0 0 100 100"
          strokeWidth="6"
          strokeLinejoin="round"
          className={className}
          style={style}
        >
          <polygon points="50,5 95,30 95,70 50,95 5,70 5,30" />
          <polygon points="50,5 95,70 5,70" fill="none" />
        </svg>
      );
    case 10:
      return (
        <svg
          viewBox="0 0 100 100"
          strokeWidth="6"
          strokeLinejoin="round"
          className={className}
          style={style}
        >
          <polygon points="50,5 90,35 50,95 10,35" />
          <polyline points="50,5 70,40 50,75 30,40 50,5" fill="none" />
          <polyline points="70,40 90,35" fill="none" />
          <polyline points="30,40 10,35" fill="none" />
          <polyline points="50,75 50,95" fill="none" />
        </svg>
      );
    case 12:
      return (
        <svg
          viewBox="0 0 100 100"
          strokeWidth="6"
          strokeLinejoin="round"
          className={className}
          style={style}
        >
          <polygon points="50,5 75,13 93,36 95,64 75,87 50,95 25,87 5,64 7,36 25,13" />
          <polygon points="38,35 62,35 70,55 50,70 30,55" fill="none" />
          <path
            d="M38 35 L25 13 M62 35 L75 13 M70 55 L95 64 M50 70 L50 95 M30 55 L5 64"
            fill="none"
          />
        </svg>
      );
    case 20:
      return (
        <svg
          viewBox="0 0 100 100"
          strokeWidth="6"
          strokeLinejoin="round"
          className={className}
          style={style}
        >
          <polygon points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5" />
          <polygon points="30,35 70,35 50,70" fill="none" />
          <path
            d="M30 35 L50 5 M70 35 L50 5 M70 35 L95 27.5 M70 35 L95 72.5 M50 70 L95 72.5 M50 70 L50 95 M50 70 L5 72.5 M30 35 L5 72.5 M30 35 L5 27.5"
            fill="none"
          />
        </svg>
      );
    case "swirl":
      return (
        <svg
          viewBox="0 0 1200 1200"
          className={className}
        >
          <circle
            cx={600}
            cy={600}
            r={560}
            style={{ fill: active ? "var(--theme-primary)" : "var(--theme-secondary)", fillOpacity: 0.8 }}
          />
          <path
            d="m610.08 131.04c18.719-1.6797 33.48-12 33.602-23.039 0.12109-11.039-15.84-19.801-36.719-19.441h-5.6406c-83.164 5.1172-163.75 30.852-234.48 74.883-71.094 44.969-130.16 106.59-172.08 179.52-41.949 74.184-64.758 157.64-66.371 242.85-1.6133 85.203 18.02 169.47 57.129 245.19 39.543 76.559 97.566 142.04 168.81 190.51 71.246 48.469 153.46 78.391 239.19 87.051 42.598 4.0156 85.492 3.7773 128.04-0.71875 44.113-5.418 86.949-18.449 126.6-38.52 80.152-39.863 144.77-105.25 183.68-185.88 38.91-80.621 49.898-171.89 31.238-259.45-19.113-87.113-66.441-165.49-134.64-222.96-68.062-57.297-153.37-90.125-242.28-93.238-40.078-1.5586-87.84-1.1992-132 15.121-65.289 22.809-119.71 69.184-152.58 130.03-32.875 60.848-41.84 131.78-25.137 198.89 10.996 43.762 32.719 84.094 63.199 117.36 30.48 33.27 68.766 58.426 111.4 73.199 41.801 13.809 86.082 18.473 129.84 13.68 49.215-5.2031 92.574-34.652 115.56-78.477 22.234-43.203 21.469-94.641-2.043-137.16-23.461-41.375-65.973-68.367-113.4-72-24-0.83984-36 9.2383-37.199 20.039s17.52 19.801 33.359 21.238c1.4961 0.125 2.9805 0.36328 4.4414 0.72266 32.352 5.4297 59.812 26.754 73.078 56.758 12.668 28.875 10.148 62.16-6.7188 88.801-16.508 26.16-45.035 42.293-75.961 42.961-35.391 2.0859-70.812-3.5625-103.8-16.562-31.508-13.125-59.312-33.785-80.969-60.172-21.656-26.383-36.5-57.684-43.23-91.148-9.8047-49.469-0.87891-100.82 25.043-144.08s66.992-75.352 115.24-90.039c15.637-4.4727 31.75-7.0898 48-7.8008h27.359c10.199 0 18 0.96094 27.121 1.4414 69.68 4.8672 135.81 32.582 188.14 78.855 52.324 46.273 87.93 108.52 101.29 177.08s3.7227 139.62-27.406 202.15c-31.133 62.531-82.023 113.05-144.78 143.71-31.121 15.387-64.645 25.332-99.121 29.402-35.93 3.1523-72.066 3.1523-108 0-72.082-7.3242-141.25-32.281-201.4-72.676-60.152-40.391-109.43-94.973-143.48-158.93-34.289-64.926-52.152-137.27-52.027-210.69 0.12891-73.426 18.238-145.7 52.746-210.51 35.5-65.914 86.66-122.09 148.98-163.59 62.316-41.496 133.88-67.035 208.38-74.371z"
            style={{ fill: active ? "var(--theme-primary-foreground)" : "var(--theme-secondary-foreground)", fillOpacity: 0.9 }}
          />
        </svg>
      );
    default:
      return null;
  }
};

export const DiceIcon = React.forwardRef<HTMLDivElement, DiceIconProps>(
  ({ className, faces, value, size = "md", active = false, hideValue = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex items-center justify-center font-black transform transition-transform",
          {
            "w-6 h-6 text-xs": size === "sm",
            "w-8 h-8 text-sm": size === "md",
            "w-12 h-12 text-lg": size === "lg",
          },
          className,
        )}
        {...props}
      >
        <DiceSvg
          faces={faces}
          active={active}
          className={cn(
            "absolute inset-0 w-full h-full transition-colors drop-shadow-sm",
            active
              ? "drop-shadow-[2px_2px_0px_color-mix(in_srgb,var(--theme-primary)_40%,transparent)]"
              : "drop-shadow-[2px_2px_0px_color-mix(in_srgb,var(--theme-secondary)_40%,transparent)]",
          )}
        />
        {!hideValue && faces !== "swirl" && (
          <span
            className={cn(
              "relative z-10",
              active
                ? "text-[var(--theme-primary-foreground)]"
                : "text-[var(--theme-secondary-foreground)]",
            )}
          >
            {value ?? faces}
          </span>
        )}
      </div>
    );
  },
);
DiceIcon.displayName = "DiceIcon";
