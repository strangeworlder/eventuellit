import {
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
    UserCircle,
    X,
    Zap,
} from "lucide-react";
import React from "react";

export const icons = {
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
    "user-circle": UserCircle,
    x: X,
    zap: Zap,
} as const;

export type IconName = keyof typeof icons;

export interface IconProps extends React.SVGAttributes<SVGElement> {
    name: IconName;
    size?: number;
}

export const Icon = React.forwardRef<SVGSVGElement, IconProps>(
    ({ name, size = 16, className, ...props }, ref) => {
        const LucideIcon = icons[name];
        if (!LucideIcon) return null;

        return <LucideIcon ref={ref} size={size} className={className} {...props} />;
    }
);

Icon.displayName = "Icon";
