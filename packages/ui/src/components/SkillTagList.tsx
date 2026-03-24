import { useState } from "react";
import { AspectTag } from "./AspectTag";
import { Button } from "./Button";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { cn } from "./utils";

export interface SkillTagItem {
  /** Unique identifier for the skill */
  id: string | number;
  /** Display name */
  name: string;
  /** Whether this is a player-created custom skill */
  isCustom?: boolean;
}

export interface SkillTagListProps {
  /** Current list of skills to render */
  items: SkillTagItem[];
  /** Called when a skill is renamed (or its isCustom flag toggled) via inline edit. Omit to disable editing. */
  onItemEdit?: (id: string | number, name: string, isCustom?: boolean) => void;
  /** Called to remove a skill — shows remove button on tags when provided. */
  onItemRemove?: (id: string | number) => void;
  /** Called to add a new skill — shows add input when provided. */
  onItemAdd?: (name: string) => void;
  /** Whether to show the "Oma taito" checkbox in edit mode */
  showCustomToggle?: boolean;
  /** Label for the add-new input field */
  addLabel?: string;
  /** Message shown when the list is empty */
  emptyMessage?: string;
  /** Disable all editing interactions */
  readOnly?: boolean;
  /** Optional className on the root container */
  className?: string;
}

export function SkillTagList({
  items,
  onItemEdit,
  onItemRemove,
  onItemAdd,
  showCustomToggle = false,
  addLabel = "Uusi taito",
  emptyMessage = "Ei taitoja määritetty.",
  readOnly = false,
  className,
}: SkillTagListProps) {
  // ── Inline edit state ──
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftCustom, setDraftCustom] = useState(false);

  // ── Add-new state ──
  const [newName, setNewName] = useState("");

  const canEdit = !readOnly && !!onItemEdit;

  const startEditing = (item: SkillTagItem) => {
    if (!canEdit) return;
    setEditingId(item.id);
    setDraftName(item.name);
    setDraftCustom(item.isCustom ?? false);
  };

  const saveEditing = () => {
    if (editingId === null || !draftName.trim() || !onItemEdit) return;
    onItemEdit(editingId, draftName.trim(), showCustomToggle ? draftCustom : undefined);
    setEditingId(null);
    setDraftName("");
    setDraftCustom(false);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftName("");
    setDraftCustom(false);
  };

  const handleAdd = () => {
    if (!newName.trim() || !onItemAdd) return;
    onItemAdd(newName.trim());
    setNewName("");
  };

  return (
    <div className={cn("space-y-3", className)}>
      {/* ── Tag list ── */}
      {items.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((item) => {
            if (editingId === item.id) {
              return (
                <div key={item.id} className="flex flex-col gap-2 w-full">
                  <Input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEditing();
                      if (e.key === "Escape") cancelEditing();
                    }}
                    // biome-ignore lint/a11y/noAutofocus: intentional for edit mode
                    autoFocus
                  />
                  {showCustomToggle && (
                    <Checkbox
                      label="Oma taito"
                      checked={draftCustom}
                      onChange={(e) => setDraftCustom(e.target.checked)}
                    />
                  )}
                  <div className="flex items-center gap-3">
                    <Button size="sm" onClick={saveEditing} disabled={!draftName.trim()}>
                      Tallenna
                    </Button>
                    <Button size="sm" variant="ghost-subtle" onClick={cancelEditing}>
                      Peruuta
                    </Button>
                  </div>
                </div>
              );
            }
            return (
              <AspectTag
                key={item.id}
                text={item.name}
                variant="skill"
                isCustom={item.isCustom ?? false}
                readOnly={readOnly || !canEdit}
                onClick={canEdit ? () => startEditing(item) : undefined}
                onRemove={!readOnly && onItemRemove ? () => onItemRemove(item.id) : undefined}
                className={canEdit ? "cursor-pointer" : undefined}
                title={canEdit ? "Klikkaa muokataksesi" : undefined}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-text-subtle">{emptyMessage}</p>
      )}

      {/* ── Add-new input ── */}
      {!readOnly && onItemAdd && (
        <div className="flex gap-2 items-end">
          <Input
            label={addLabel}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd} disabled={!newName.trim()}>
            Lisää
          </Button>
        </div>
      )}
    </div>
  );
}
