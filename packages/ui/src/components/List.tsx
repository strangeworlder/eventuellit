import React from "react";
import { cn } from "./Heading"; // Reusing the utility

export interface ListProps extends React.HTMLAttributes<HTMLUListElement | HTMLOListElement> {
    as?: "ul" | "ol";
    variant?: "default" | "unbulleted";
}

/**
 * A standardized List component for the Design System.
 */
export const List = React.forwardRef<HTMLUListElement | HTMLOListElement, ListProps>(
    ({ className, as: Component = "ul", variant = "default", ...props }, ref) => {
        return (
            <Component
                ref={ref as React.Ref<any>}
                className={cn(
                    "text-[var(--theme-text)] space-y-2 mb-4",
                    {
                        "list-disc ml-6": Component === "ul" && variant === "default",
                        "list-decimal ml-6": Component === "ol" && variant === "default",
                        "list-none ml-0": variant === "unbulleted",
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
List.displayName = "List";

export interface ListItemProps extends React.LiHTMLAttributes<HTMLLIElement> { }

export const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
    ({ className, ...props }, ref) => {
        return (
            <li
                ref={ref}
                className={cn("text-[1.05rem] leading-[1.7]", className)}
                {...props}
            />
        );
    }
);
ListItem.displayName = "ListItem";
