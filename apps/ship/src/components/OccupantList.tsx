import { Button } from "@repo/ui/components/Button";
import { Combobox } from "@repo/ui/components/Combobox";
import type { ComboboxOption } from "@repo/ui/components/Combobox";
import { Stack } from "@repo/ui/components/Layout";
import { Text } from "@repo/ui/components/Text";
import { useMemo, useState } from "react";
import type { Character, Occupant } from "../api/ship";

interface OccupantListProps {
  occupants: Occupant[];
  characters: Character[];
  canEdit: boolean;
  onAdd: (characterId: number) => void;
  onRemove: (characterId: number) => void;
  isAddPending: boolean;
  isRemovePending: boolean;
}

export function OccupantList({
  occupants,
  characters,
  canEdit,
  onAdd,
  onRemove,
  isAddPending,
  isRemovePending,
}: OccupantListProps) {
  const [query, setQuery] = useState("");

  const occupiedIds = new Set(occupants.map((o) => o.characterId));

  const options = useMemo<ComboboxOption[]>(
    () =>
      characters
        .filter((c) => !occupiedIds.has(c.id))
        .map((c) => ({
          value: String(c.id),
          label: c.name,
          description: c.archetype + (c.ownerName ? ` · ${c.ownerName}` : ""),
        })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [characters, occupants],
  );

  const handleSelect = (value: string) => {
    onAdd(Number(value));
    setQuery("");
  };

  return (
    <Stack gap={3}>
      {/* Occupant roster */}
      {occupants.length === 0 ? (
        <Text variant="small" className="italic text-text-subtle">
          Ei asukkaita
        </Text>
      ) : (
        <Stack gap={2} as="ul">
          {occupants.map((o) => (
            <li
              key={o.characterId}
              className="flex items-center justify-between px-3 py-2 rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-surface-tint)]"
            >
              <div>
                <Text variant="small" className="font-semibold inline">
                  {o.characterName}
                </Text>
                <Text variant="small" className="ml-2 inline text-text-muted">
                  {o.archetype}
                </Text>
              </div>
              {canEdit && (
                <Button
                  variant="ghost-subtle"
                  size="compact"
                  loading={isRemovePending}
                  onClick={() => onRemove(o.characterId)}
                  aria-label={`Poista ${o.characterName}`}
                >
                  Poista
                </Button>
              )}
            </li>
          ))}
        </Stack>
      )}

      {/* Add occupant via Combobox */}
      {canEdit && (
        <Combobox
          options={options}
          query={query}
          onQueryChange={setQuery}
          onSelect={handleSelect}
          placeholder="Lisää hahmo..."
          size="compact"
          loading={isAddPending}
          disabled={isAddPending}
        />
      )}
    </Stack>
  );
}
