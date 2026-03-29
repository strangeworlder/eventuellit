import React from "react";
import { Button } from "./Button";
import { Dialog } from "./Dialog";
import type { Theme } from "./Theme";

export interface ConfirmDialogProps {
  /** Controls visibility */
  open: boolean;
  /** Called when dialog should close (cancel, backdrop, escape) */
  onOpenChange: (open: boolean) => void;
  /** Dialog title */
  title: string;
  /** Body copy below the title */
  description?: React.ReactNode;
  /** Primary (confirm) button label */
  confirmLabel?: string;
  /** Secondary (cancel) button label */
  cancelLabel?: string;
  /** When `danger`, confirm uses destructive styling */
  variant?: "default" | "danger";
  /** Called when user confirms */
  onConfirm: () => void;
  /** Theme for the dialog panel */
  theme?: Theme;
}

/**
 * Opinionated confirmation modal built on {@link Dialog}.
 * Use instead of `window.confirm` for accessible, themed destructive flows.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Vahvista",
  cancelLabel = "Peruuta",
  variant = "default",
  onConfirm,
  theme,
}: ConfirmDialogProps) {
  const handleConfirm = React.useCallback(() => {
    onConfirm();
    onOpenChange(false);
  }, [onConfirm, onOpenChange]);

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      title={title}
      description={description}
      theme={theme}
      footer={
        <>
          <Button type="button" variant="ghost-subtle" onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={variant === "danger" ? "danger" : "solid"}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
