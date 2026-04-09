import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  Calendar,
  Clock,
  Cog,
  Compass,
  CornerDownLeft,
  Dice5,
  Download,
  Drama,
  FileText,
  Flame,
  Globe,
  Hash,
  HeartPulse,
  Home,
  Inbox,
  Info,
  Link,
  Loader2,
  LogIn,
  LogOut,
  Map,
  Menu,
  Minus,
  Pencil,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Trash2,
  User,
  UserCircle,
  UserPlus,
  Zap,
} from "lucide-react";
import React from "react";
import { customIconNames, type CustomIconName } from "../generated/custom-icon-names";
import spriteMarkup from "../generated/icons-custom.svg?raw";
import { CustomIcon } from "./CustomIcon";
import { cn } from "./utils";

// ── Lucide icon map (custom icons removed from here) ──────────────────────

export const lucideIcons = {
  "alert-triangle": AlertTriangle,
  "book-marked": BookMarked,
  calendar: Calendar,
  clock: Clock,
  "corner-down-left": CornerDownLeft,
  "file-text": FileText,
  hash: Hash,
  cog: Cog,
  compass: Compass,
  drama: Drama,
  flame: Flame,
  download: Download,
  home: Home,
  inbox: Inbox,
  info: Info,
  "heart-pulse": HeartPulse,
  link: Link,
  pencil: Pencil,
  send: Send,
  "shield-alert": ShieldAlert,
  sparkles: Sparkles,
  search: Search,
  dice5: Dice5,
  book: BookOpen,
  globe: Globe,
  loader2: Loader2,
  "log-in": LogIn,
  "log-out": LogOut,
  map: Map,
  menu: Menu,
  minus: Minus,
  settings: Settings,
  shield: Shield,
  "trash-2": Trash2,
  user: User,
  "user-circle": UserCircle,
  "user-plus": UserPlus,
  zap: Zap,
} as const;

// ── Custom icon sentinel ───────────────────────────────────────────────────
// Built dynamically from the generated name list so adding a new SVG to
// custom-icons/ and running build:icons is all that's needed — no manual
// edits to this file required.

const CUSTOM = Symbol("custom");

export const customIconEntries = Object.fromEntries(
  customIconNames.map((name) => [name, CUSTOM] as const),
) as Record<CustomIconName, typeof CUSTOM>;

export const icons = {
  ...lucideIcons,
  ...customIconEntries,
} as const;

export type IconName = keyof typeof lucideIcons | CustomIconName;

// ── Props ─────────────────────────────────────────────────────────────────

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number;
  /**
   * Visual variant of the icon.
   * - `default`: Bare SVG icon (current behaviour).
   * - `branded`: Large icon inside a circular themed container with a subtle glow.
   *   Used as a visual anchor on utility pages (login, verify, error). Ignores `size` prop
   *   and uses fixed dimensions.
   */
  variant?: "default" | "branded";
}

/**
 * Unified icon component. Routes to the custom SVG sprite for thematic icons
 * and falls back to Lucide React for all others.
 *
 * Always use `Icon` instead of importing Lucide or CustomIcon directly —
 * it enforces a consistent size scale and type-safe `IconName` union.
 *
 * Custom icons: x, plus (replaces Lucide X and Plus with thematic SVGs; API unchanged)
 * Lucide icons: all others (alert-triangle, book, chevron-*, etc.)
 *
 * Use `variant="branded"` for a large circular icon treatment on utility pages.
 *
 * @summary Unified icon wrapper; custom + Lucide icons; size prop in px (default 16); variant="branded" for hero treatment
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 16, variant = "default", className, ...props }, ref) => {
    // ── Custom icon path ─────────────────────────────────────────────────
    if (name in customIconEntries) {
      const customName = name as CustomIconName;

      if (variant === "branded") {
        return (
          <div className="w-20 h-20 rounded-full border-2 border-[var(--theme-border-medium)] flex items-center justify-center shadow-[0_0_30px_color-mix(in_srgb,var(--theme-secondary)_25%,transparent)]">
            <CustomIcon
              name={customName}
              size={36}
              className={cn("text-[var(--theme-secondary)]", className)}
              _spriteMarkup={spriteMarkup}
            />
          </div>
        );
      }

      return (
        <CustomIcon
          ref={ref}
          name={customName}
          size={size}
          className={className}
          _spriteMarkup={spriteMarkup}
          {...props}
        />
      );
    }

    // ── Lucide path ──────────────────────────────────────────────────────
    const LucideIcon = lucideIcons[name as keyof typeof lucideIcons];
    if (!LucideIcon) return null;

    if (variant === "branded") {
      return (
        <div className="w-20 h-20 rounded-full border-2 border-[var(--theme-border-medium)] flex items-center justify-center shadow-[0_0_30px_color-mix(in_srgb,var(--theme-secondary)_25%,transparent)]">
          <LucideIcon
            ref={ref}
            size={36}
            className={cn("text-[var(--theme-secondary)]", className)}
            {...props}
          />
        </div>
      );
    }

    return <LucideIcon ref={ref} size={size} className={className} {...props} />;
  },
);

Icon.displayName = "Icon";
