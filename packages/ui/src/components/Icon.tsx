import {
    Sparkles,
    Dice5,
    BookOpen,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Zap,
} from "lucide-react";
import React from "react";

export const icons = {
    sparkles: Sparkles,
    dice5: Dice5,
    book: BookOpen,
    "chevron-left": ChevronLeft,
    "chevron-right": ChevronRight,
    minus: Minus,
    plus: Plus,
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
