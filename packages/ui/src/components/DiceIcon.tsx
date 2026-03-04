import React from "react";
import { cn } from "./Button";

export interface DiceIconProps extends React.HTMLAttributes<HTMLDivElement> {
  faces: 4 | 6 | 8 | 10 | 12 | 20;
  value?: number;
  size?: "sm" | "md" | "lg";
  active?: boolean;
}

const DiceSvg = ({
  faces,
  className,
  active,
}: {
  faces: number;
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
    default:
      return null;
  }
};

export const DiceIcon = React.forwardRef<HTMLDivElement, DiceIconProps>(
  ({ className, faces, value, size = "md", active = false, ...props }, ref) => {
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
      </div>
    );
  },
);
DiceIcon.displayName = "DiceIcon";
