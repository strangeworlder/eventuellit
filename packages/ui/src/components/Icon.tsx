import {
    AlertTriangle,
    BookMarked,
    BookOpen,
    Calendar,
    CircleCheck,
    CircleX,
    Cog,
    Compass,
    CornerDownLeft,
    ChevronDown,
    ChevronUp,
    Download,
    Drama,
    FileText,
    Flame,
    Hash,
    HeartPulse,
    Home,
    Info,
    ShieldAlert,
    Sparkles,
    Search,
    Dice5,
    ChevronLeft,
    ChevronRight,
    Globe,
    Loader2,
    LogIn,
    LogOut,
    Map,
    Menu,
    Minus,
    Plus,
    Settings,
    Shield,
    Trash2,
    UserCircle,
    X,
    Zap,
} from "lucide-react";
import React from "react";

export const icons = {
    "alert-triangle": AlertTriangle,
    "book-marked": BookMarked,
    calendar: Calendar,
    "circle-check": CircleCheck,
    "circle-x": CircleX,
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
    info: Info,
    "heart-pulse": HeartPulse,
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
    "user-circle": UserCircle,
    x: X,
    zap: Zap,
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGAttributes<SVGElement> {
    name: IconName;
    size?: number;
}

/**
 * Lucide icon wrapper. Always use this instead of importing Lucide icons directly —
 * it enforces a consistent size scale and type-safe `IconName` union.
 * Available names: alert-triangle, book, book-marked, circle-check, circle-x, compass, corner-down-left,
 * file-text, hash, info, loader2, plus, minus, search, trash-2, x, chevron-left/right, menu, settings,
 * map, globe, log-in/out, shield, zap, sparkles, etc.
 *
 * @summary Lucide icon wrapper; use IconName type for valid names; size prop in px (default 16)
 */
export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ name, size = 16, className, ...props }, ref) => {
        const LucideIcon = icons[name];
        if (!LucideIcon) return null;

        return <LucideIcon ref={ref} size={size} className={className} {...props} />;
    }
);

Icon.displayName = "Icon";
