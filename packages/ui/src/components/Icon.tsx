import {
    AlertTriangle,
    CircleCheck,
    CircleX,
    Compass,
    ChevronDown,
    Download,
    HeartPulse,
    Home,
    Info,
    ShieldAlert,
    Sparkles,
    Dice5,
    BookOpen,
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
    "circle-check": CircleCheck,
    "circle-x": CircleX,
    compass: Compass,
    "chevron-down": ChevronDown,
    download: Download,
    home: Home,
    info: Info,
    "heart-pulse": HeartPulse,
    "shield-alert": ShieldAlert,
    sparkles: Sparkles,
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
 * Available names: alert-triangle, circle-check, circle-x, info, loader2, plus, minus,
 * trash-2, x, chevron-left/right, menu, settings, map, globe, log-in/out, shield, zap, sparkles, etc.
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
