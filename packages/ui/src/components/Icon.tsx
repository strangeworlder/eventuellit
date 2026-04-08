import {
  AlertTriangle,
  BookMarked,
  BookOpen,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleCheck,
  CircleX,
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
  ListChecks,
  Loader2,
  LogIn,
  LogOut,
  Map,
  Menu,
  Minus,
  Pencil,
  Plus,
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
  X,
  Zap,
} from "lucide-react";
import React from "react";
import { cn } from "./utils";

export const icons = {
  "alert-triangle": AlertTriangle,
  "book-marked": BookMarked,
  calendar: Calendar,
  check: Check,
  "check-square": CheckSquare,
  "circle-check": CircleCheck,
  "circle-x": CircleX,
  clock: Clock,
  "corner-down-left": CornerDownLeft,
  "file-text": FileText,
  hash: Hash,
  cog: Cog,
  compass: Compass,
  drama: Drama,
  flame: Flame,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  download: Download,
  home: Home,
  inbox: Inbox,
  info: Info,
  "heart-pulse": HeartPulse,
  link: Link,
  "list-checks": ListChecks,
  pencil: Pencil,
  send: Send,
  "shield-alert": ShieldAlert,
  sparkles: Sparkles,
  search: Search,
  dice5: Dice5,
  book: BookOpen,
  "chevron-left": ChevronLeft,
  "chevron-right": ChevronRight,
  globe: Globe,
  loader2: Loader2,
  "log-in": LogIn,
  "log-out": LogOut,
  map: Map,
  menu: Menu,
  minus: Minus,
  plus: Plus,
  settings: Settings,
  shield: Shield,
  "trash-2": Trash2,
  user: User,
  "user-circle": UserCircle,
  "user-plus": UserPlus,
  x: X,
  zap: Zap,
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number;
  /**
   * Visual variant of the icon.
   * - `default`: Bare SVG icon (current behavior).
   * - `branded`: Large icon inside a circular themed container with a subtle glow.
   *   Used as a visual anchor on utility pages (login, verify, error). Ignores `size` prop
   *   and uses fixed dimensions.
   */
  variant?: "default" | "branded";
}

/**
 * Lucide icon wrapper. Always use this instead of importing Lucide icons directly —
 * it enforces a consistent size scale and type-safe `IconName` union.
 * Available names: alert-triangle, book, book-marked, circle-check, circle-x, compass, corner-down-left,
 * file-text, hash, info, loader2, plus, minus, search, trash-2, x, chevron-left/right, menu, settings,
 * map, globe, log-in/out, shield, zap, sparkles, etc.
 *
 * Use `variant="branded"` for a large circular icon treatment on utility pages.
 *
 * @summary Lucide icon wrapper; use IconName type for valid names; size prop in px (default 16); variant="branded" for hero treatment
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
  ({ name, size = 16, variant = "default", className, ...props }, ref) => {
    const LucideIcon = icons[name];
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
