import {
  Badge,
  ConfirmDialog,
  ConsoleButton,
  ConsoleRow,
  ConsoleSheet,
  EditableField,
  Input,
  LoadingState,
  MarkdownRenderer,
  NoticePanel,
  Select,
  Text,
  TextArea,
} from "@repo/ui";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  type CabinPossession,
  type ShipOverviewResponse,
  useCabinDetails,
  useCreatePossession,
  useDeletePossession,
  useUpdateCabinInterior,
  useUpdatePossession,
} from "../api/ship";
import { formatCabinCode } from "./ship-zones";

export interface CabinSheetContentProps {
  overview: ShipOverviewResponse;
  basePath: string;
  isGm: boolean;
  onClose?: () => void;
}

/**
 * Compact crew cabin terminal panel inside `ConsoleSheet`.
 */
export function CabinSheetContent({ overview, basePath, isGm, onClose }: CabinSheetContentProps) {
  const navigate = useNavigate();
  const { characterId } = useParams<{ characterId?: string }>();

  const defaultCharacterId = useMemo(() => {
    const withCabin = overview.myCharacters.find((c) => Boolean(c.claimedRoom));
    if (withCabin) return withCabin.id;
    if (overview.myCharacters[0]) return overview.myCharacters[0].id;
    const crewWithCabin = overview.crewCharacters.find((c) => Boolean(c.claimedRoom));
    return crewWithCabin?.id ?? overview.crewCharacters[0]?.id ?? null;
  }, [overview.crewCharacters, overview.myCharacters]);

  const parsedCharId = characterId ? Number(characterId) : defaultCharacterId;
  const resolvedCharacterId =
    parsedCharId !== null && Number.isFinite(parsedCharId) ? parsedCharId : null;

  const { data: cabin, isLoading } = useCabinDetails(resolvedCharacterId);
  const updateInteriorMutation = useUpdateCabinInterior();
  const createPossessionMutation = useCreatePossession();
  const updatePossessionMutation = useUpdatePossession();
  const deletePossessionMutation = useDeletePossession();

  // Decoration preview/edit state
  const [showDecoration, setShowDecoration] = useState(true);
  const [editingDecoration, setEditingDecoration] = useState(false);
  const [decorationDraft, setDecorationDraft] = useState("");

  // Add possession state
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDesc, setNewItemDesc] = useState("");
  const [newItemGmNote, setNewItemGmNote] = useState("");

  // Edit existing possession state
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editItemName, setEditItemName] = useState("");
  const [editItemDesc, setEditItemDesc] = useState("");

  // Edit GM mechanical notes state
  const [editingGmNoteId, setEditingGmNoteId] = useState<number | null>(null);
  const [gmNoteDraft, setGmNoteDraft] = useState("");

  // Delete confirmation state
  const [confirmDeleteItem, setConfirmDeleteItem] = useState<CabinPossession | null>(null);

  const switcherOptions = useMemo(() => {
    const seen = new Set<number>();
    const options: Array<{ value: string; label: string }> = [];
    for (const c of [...overview.myCharacters, ...overview.crewCharacters]) {
      if (seen.has(c.id)) continue;
      seen.add(c.id);
      options.push({
        value: String(c.id),
        label: `${c.name}${c.claimedRoom ? ` (${c.claimedRoom.name})` : " (ei hyttiä)"}`,
      });
    }
    return options;
  }, [overview.crewCharacters, overview.myCharacters]);

  const title = cabin?.claimedRoom
    ? cabin.claimedRoom.cabinCustomTitle || cabin.claimedRoom.name
    : cabin
      ? `${cabin.character.name}: Ei varattua hyttiä`
      : "Miehistöhytit";

  const subtitle = cabin
    ? `${cabin.character.name}, ${cabin.character.archetype}${
        cabin.claimedRoom ? `, Kansi ${cabin.claimedRoom.deckNumber}` : ""
      }`
    : "Valitse hahmo tai varaa vapaa hytti aluksen siivestä.";

  const handleStartDecorationEdit = () => {
    setDecorationDraft(cabin?.claimedRoom?.cabinDecoration ?? "");
    setEditingDecoration(true);
    setShowDecoration(true);
  };

  const handleSaveDecoration = () => {
    if (!cabin) return;
    updateInteriorMutation.mutate(
      {
        characterId: cabin.character.id,
        cabinDecoration: decorationDraft.trim() || null,
      },
      {
        onSuccess: () => setEditingDecoration(false),
      },
    );
  };

  const handleCreatePossession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cabin || !newItemName.trim()) return;
    createPossessionMutation.mutate(
      {
        characterId: cabin.character.id,
        name: newItemName.trim(),
        description: newItemDesc.trim(),
        ...(isGm && newItemGmNote.trim() ? { gmMechanicalNotes: newItemGmNote.trim() } : {}),
      },
      {
        onSuccess: () => {
          setNewItemName("");
          setNewItemDesc("");
          setNewItemGmNote("");
          setAddFormOpen(false);
        },
      },
    );
  };

  const handleStartItemEdit = (item: CabinPossession) => {
    setEditingItemId(item.id);
    setEditItemName(item.name);
    setEditItemDesc(item.description);
    setEditingGmNoteId(null);
  };

  const handleSaveItemEdit = (item: CabinPossession) => {
    if (!cabin || !editItemName.trim()) return;
    updatePossessionMutation.mutate(
      {
        id: item.id,
        name: editItemName.trim(),
        description: editItemDesc.trim(),
      },
      {
        onSuccess: () => setEditingItemId(null),
      },
    );
  };

  const handleStartGmNoteEdit = (item: CabinPossession) => {
    setEditingGmNoteId(item.id);
    setGmNoteDraft(item.gmMechanicalNotes ?? "");
    setEditingItemId(null);
  };

  const handleSaveGmNoteEdit = (item: CabinPossession) => {
    if (!cabin) return;
    updatePossessionMutation.mutate(
      {
        id: item.id,
        gmMechanicalNotes: gmNoteDraft.trim() || null,
      },
      {
        onSuccess: () => setEditingGmNoteId(null),
      },
    );
  };

  return (
    <ConsoleSheet
      headerCode={
        cabin?.claimedRoom
          ? `Kansi ${cabin.claimedRoom.deckNumber} · Hytti ${formatCabinCode(cabin.claimedRoom.key)}`
          : undefined
      }
      title={title}
      subtitle={subtitle}
      defaultSnap="half"
      onClose={onClose}
    >
      {switcherOptions.length > 0 && (
        <Select
          size="compact"
          label="Valitse hahmo"
          value={resolvedCharacterId !== null ? String(resolvedCharacterId) : ""}
          onChange={(e) => {
            if (e.target.value) {
              navigate(`${basePath}/hytti/${e.target.value}`);
            }
          }}
          options={switcherOptions}
        />
      )}

      {isLoading ? (
        <LoadingState message="Ladataan hyttitietoja..." size="default" layout="inline" />
      ) : !cabin ? (
        <NoticePanel variant="info" title="Ei valittua hyttiä">
          <Text variant="small">
            Valitse hahmolle vapaa asuinhuone kannen pohjaleikkauksesta tai luo ensin hahmo
            generaattorissa.
          </Text>
          <div className="mt-3">
            <ConsoleButton variant="outline" onClick={() => navigate(basePath || "/")}>
              Palaa kansikartalle
            </ConsoleButton>
          </div>
        </NoticePanel>
      ) : (
        <div className="space-y-4">
          {!cabin.claimedRoom ? (
            <NoticePanel variant="info" title="Hyttiä ei ole vielä varattu">
              <Text variant="small">
                {`${cabin.character.name} ei ole vielä valinnut asuinhuonetta. Valitse asuinsiipi kansilta 1, 2 tai 3 ja varaa vapaa hytti.`}
              </Text>
              <div className="mt-3">
                <ConsoleButton variant="primary" onClick={() => navigate(basePath || "/")}>
                  Valitse hytti kartalta
                </ConsoleButton>
              </div>
            </NoticePanel>
          ) : (
            <div className="space-y-3 border border-[var(--theme-border-soft)] rounded-[4px] p-3 bg-[color-mix(in_srgb,var(--theme-bg)_92%,var(--theme-surface-tint))]">
              <EditableField
                label="Hytin ovikyltti"
                value={cabin.claimedRoom.cabinCustomTitle || cabin.claimedRoom.name}
                readOnly={!cabin.canEditInterior}
                onSave={(nextTitle) => {
                  updateInteriorMutation.mutate({
                    characterId: cabin.character.id,
                    cabinCustomTitle: nextTitle.trim() || null,
                  });
                }}
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[var(--theme-border-soft)]">
                <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Sisustus ja tunnelma
                </span>
                <div className="flex items-center gap-1.5">
                  <ConsoleButton
                    variant="ghost"
                    size="compact"
                    onClick={() => setShowDecoration((prev) => !prev)}
                  >
                    {showDecoration ? "Piilota sisustus" : "Näytä sisustus"}
                  </ConsoleButton>
                  {cabin.canEditInterior && !editingDecoration && (
                    <ConsoleButton
                      variant="outline"
                      size="compact"
                      onClick={handleStartDecorationEdit}
                    >
                      Muokkaa sisustusta
                    </ConsoleButton>
                  )}
                </div>
              </div>

              {showDecoration && !editingDecoration && (
                <div className="text-sm leading-relaxed">
                  <MarkdownRenderer>
                    {cabin.claimedRoom.cabinDecoration ||
                      "_Hytin sisustusta ei ole vielä kuvattu._"}
                  </MarkdownRenderer>
                </div>
              )}

              {editingDecoration && (
                <div className="space-y-2">
                  <TextArea
                    label="Hytin kuvaus"
                    size="compact"
                    rows={4}
                    value={decorationDraft}
                    onChange={(e) => setDecorationDraft(e.target.value)}
                    placeholder="Kuvaa hytin esineistö, valaistus ja henkilökohtainen jälki."
                  />
                  <div className="flex justify-end gap-2">
                    <ConsoleButton
                      variant="ghost"
                      size="compact"
                      onClick={() => setEditingDecoration(false)}
                    >
                      Peruuta
                    </ConsoleButton>
                    <ConsoleButton
                      variant="primary"
                      size="compact"
                      loading={updateInteriorMutation.isPending}
                      onClick={handleSaveDecoration}
                    >
                      Tallenna sisustus
                    </ConsoleButton>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Special possessions list */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-heading text-xs font-semibold uppercase tracking-wider text-text-muted tabular-nums">
                {`Erikoiset omistukset (${cabin.possessions.length})`}
              </span>
              {(cabin.canEditInterior || isGm) && (
                <ConsoleButton
                  variant="outline"
                  size="compact"
                  iconLeft="plus"
                  onClick={() => setAddFormOpen((prev) => !prev)}
                >
                  {addFormOpen ? "Sulje lomake" : "Lisää omistus"}
                </ConsoleButton>
              )}
            </div>

            {addFormOpen && (
              <form
                onSubmit={handleCreatePossession}
                className="space-y-2.5 border border-[var(--theme-secondary)] rounded-[4px] p-3 bg-[color-mix(in_srgb,var(--theme-secondary)_8%,var(--theme-bg))]"
              >
                <Input
                  label="Omistuksen nimi"
                  size="compact"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Esim. messinkinen sekstantti"
                  required
                />
                <TextArea
                  label="Kuvaus"
                  size="compact"
                  rows={2}
                  value={newItemDesc}
                  onChange={(e) => setNewItemDesc(e.target.value)}
                  placeholder="Miltä esine näyttää ja miksi se on mukana?"
                />
                {isGm && (
                  <>
                    <TextArea
                      label="Pelimekaaninen huomio (PJ)"
                      size="compact"
                      rows={2}
                      value={newItemGmNote}
                      onChange={(e) => setNewItemGmNote(e.target.value)}
                      placeholder="Esim. +1n20 navigointiin kerran jaksossa"
                    />
                    <Text variant="muted" className="text-xs">
                      Pelimekaanisen huomion lisääminen lukitsee omistuksen pelaajan poistoilta.
                    </Text>
                  </>
                )}
                <div className="flex justify-end gap-2">
                  <ConsoleButton
                    type="button"
                    variant="ghost"
                    size="compact"
                    onClick={() => setAddFormOpen(false)}
                  >
                    Peruuta
                  </ConsoleButton>
                  <ConsoleButton
                    type="submit"
                    variant="primary"
                    size="compact"
                    loading={createPossessionMutation.isPending}
                  >
                    Tallenna omistus
                  </ConsoleButton>
                </div>
              </form>
            )}

            {cabin.possessions.length === 0 ? (
              <div className="border border-dashed border-[var(--theme-border-soft)] p-4 text-center rounded-[4px]">
                <Text variant="muted" className="text-sm">
                  Ei vielä kirjattuja omistuksia.
                </Text>
              </div>
            ) : (
              <div className="space-y-2">
                {cabin.possessions.map((item) => {
                  const canEditItem = isGm || (!item.isLockedByGm && cabin.canEditInterior);
                  const isEditingThis = editingItemId === item.id;
                  const isEditingGmThis = editingGmNoteId === item.id;

                  return (
                    <ConsoleRow
                      key={item.id}
                      statusTone={item.isLockedByGm ? "locked" : "normal"}
                      title={item.name}
                      subtitle={item.description || undefined}
                      badge={
                        item.isLockedByGm ? (
                          <Badge variant="highlight">PJ-lukittu ominaisuus</Badge>
                        ) : undefined
                      }
                      actions={
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isGm && (
                            <ConsoleButton
                              variant="outline"
                              size="compact"
                              onClick={() => handleStartGmNoteEdit(item)}
                            >
                              {item.gmMechanicalNotes
                                ? "Muokkaa pelimekaanista huomiota"
                                : "Lisää pelimekaaninen huomio"}
                            </ConsoleButton>
                          )}
                          {canEditItem && (
                            <>
                              <ConsoleButton
                                variant="outline"
                                size="compact"
                                onClick={() => handleStartItemEdit(item)}
                              >
                                Muokkaa
                              </ConsoleButton>
                              <ConsoleButton
                                variant="danger"
                                size="compact"
                                onClick={() => setConfirmDeleteItem(item)}
                              >
                                Poista
                              </ConsoleButton>
                            </>
                          )}
                        </div>
                      }
                    >
                      {item.gmMechanicalNotes && !isEditingGmThis && (
                        <div className="rounded-[3px] border border-[var(--theme-secondary)] bg-[color-mix(in_srgb,var(--theme-secondary)_10%,var(--theme-bg))] px-2.5 py-1.5 text-xs text-[var(--theme-text)]">
                          <span className="font-heading text-xs font-semibold uppercase tracking-wider text-[var(--theme-secondary)] mr-2">
                            Pelimekaniikka:
                          </span>
                          <span>{item.gmMechanicalNotes}</span>
                        </div>
                      )}

                      {isEditingThis && (
                        <div className="space-y-2 pt-2 border-t border-[var(--theme-border-soft)]">
                          <Input
                            label="Nimi"
                            size="compact"
                            value={editItemName}
                            onChange={(e) => setEditItemName(e.target.value)}
                          />
                          <TextArea
                            label="Kuvaus"
                            size="compact"
                            rows={2}
                            value={editItemDesc}
                            onChange={(e) => setEditItemDesc(e.target.value)}
                          />
                          <div className="flex justify-end gap-2">
                            <ConsoleButton
                              variant="ghost"
                              size="compact"
                              onClick={() => setEditingItemId(null)}
                            >
                              Peruuta
                            </ConsoleButton>
                            <ConsoleButton
                              variant="primary"
                              size="compact"
                              loading={updatePossessionMutation.isPending}
                              onClick={() => handleSaveItemEdit(item)}
                            >
                              Tallenna
                            </ConsoleButton>
                          </div>
                        </div>
                      )}

                      {isGm && isEditingGmThis && (
                        <div className="space-y-2 pt-2 border-t border-[var(--theme-border-soft)]">
                          <TextArea
                            label="Pelimekaaninen huomio (PJ)"
                            size="compact"
                            rows={2}
                            value={gmNoteDraft}
                            onChange={(e) => setGmNoteDraft(e.target.value)}
                          />
                          <Text variant="muted" className="text-xs">
                            Pelimekaanisen huomion lisääminen lukitsee omistuksen pelaajan
                            poistoilta.
                          </Text>
                          <div className="flex justify-end gap-2">
                            <ConsoleButton
                              variant="ghost"
                              size="compact"
                              onClick={() => setEditingGmNoteId(null)}
                            >
                              Peruuta
                            </ConsoleButton>
                            <ConsoleButton
                              variant="primary"
                              size="compact"
                              loading={updatePossessionMutation.isPending}
                              onClick={() => handleSaveGmNoteEdit(item)}
                            >
                              Tallenna huomio
                            </ConsoleButton>
                          </div>
                        </div>
                      )}
                    </ConsoleRow>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={Boolean(confirmDeleteItem)}
        onOpenChange={(open) => {
          if (!open) setConfirmDeleteItem(null);
        }}
        title="Poista omistus?"
        description={
          confirmDeleteItem
            ? `Poistetaanko "${confirmDeleteItem.name}" pysyvästi hytin luettelosta?`
            : ""
        }
        confirmLabel="Poista"
        cancelLabel="Peruuta"
        variant="danger"
        onConfirm={() => {
          if (confirmDeleteItem) {
            deletePossessionMutation.mutate(confirmDeleteItem.id);
          }
        }}
      />
    </ConsoleSheet>
  );
}
