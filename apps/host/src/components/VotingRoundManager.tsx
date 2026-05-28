import { Button } from "@repo/ui/components/Button";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Icon } from "@repo/ui/components/Icon";
import { Input } from "@repo/ui/components/Input";
import { Stack } from "@repo/ui/components/Layout";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/RadioGroup";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";
import { TextArea } from "@repo/ui/components/TextArea";
import { useToast } from "@repo/ui/components/Toast";
import React from "react";
import {
  useAddMissionOption,
  useCreateVotingRound,
  useDeleteMissionOption,
  useDeleteVotingRound,
  useUpdateMissionOption,
  useUpdateVotingRound,
  useVotingResultsFull,
  type MissionOption,
  type UrgencyLevel,
  type VotingRound,
} from "../api/mission-votes";

interface VotingRoundManagerProps {
  round: VotingRound | null;
  options: MissionOption[];
  onClose?: () => void;
}

export function VotingRoundManager({ round, options, onClose }: VotingRoundManagerProps) {
  // ── Create-round form state ───────────────────────────────────────────────
  const [newTitle, setNewTitle] = React.useState("");
  const [newDeadline, setNewDeadline] = React.useState("");

  // ── Add-option form state ─────────────────────────────────────────────────
  const [optionTitle, setOptionTitle] = React.useState("");
  const [optionDesc, setOptionDesc] = React.useState("");
  const [optionUrgency, setOptionUrgency] = React.useState<UrgencyLevel>("normaali");

  // ── Confirm dialogs ───────────────────────────────────────────────────────
  const [showCloseConfirm, setShowCloseConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [showReopenConfirm, setShowReopenConfirm] = React.useState(false);

  // ── Inline edit: round metadata ───────────────────────────────────────────
  const [editingRound, setEditingRound] = React.useState(false);
  const [editRoundTitle, setEditRoundTitle] = React.useState("");
  const [editRoundDeadline, setEditRoundDeadline] = React.useState("");

  // ── Inline edit: option details ───────────────────────────────────────────
  const [editingOptionId, setEditingOptionId] = React.useState<number | null>(null);
  const [editOptTitle, setEditOptTitle] = React.useState("");
  const [editOptDesc, setEditOptDesc] = React.useState("");
  const [editOptUrgency, setEditOptUrgency] = React.useState<UrgencyLevel>("normaali");

  // ── Mutations ─────────────────────────────────────────────────────────────
  const createRound = useCreateVotingRound();
  const updateRound = useUpdateVotingRound();
  const deleteRound = useDeleteVotingRound();
  const addOption = useAddMissionOption();
  const deleteOption = useDeleteMissionOption();
  const updateOption = useUpdateMissionOption();
  const { data: fullResults } = useVotingResultsFull(round?.id ?? null);
  const { toast } = useToast();

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleCreateRound(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createRound.mutate(
      { title: newTitle.trim(), deadline: newDeadline || undefined },
      {
        onSuccess: () => {
          setNewTitle("");
          setNewDeadline("");
          toast({ message: "Äänestys luotu.", variant: "success" });
        },
        onError: () => toast({ message: "Äänestyksen luominen epäonnistui.", variant: "error" }),
      },
    );
  }

  function handleAddOption(e: React.FormEvent) {
    e.preventDefault();
    if (!optionTitle.trim() || !round) return;
    addOption.mutate(
      {
        roundId: round.id,
        title: optionTitle.trim(),
        description: optionDesc.trim() || undefined,
        urgency: optionUrgency,
      },
      {
        onSuccess: () => {
          setOptionTitle("");
          setOptionDesc("");
          setOptionUrgency("normaali");
          toast({ message: "Tehtävä lisätty.", variant: "success" });
        },
        onError: () => toast({ message: "Tehtävän lisääminen epäonnistui.", variant: "error" }),
      },
    );
  }

  /** Convert an ISO date string to `datetime-local` input value (YYYY-MM-DDTHH:mm). */
  function toDatetimeLocal(iso: string | null): string {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function startEditingRound() {
    if (!round) return;
    setEditRoundTitle(round.title);
    setEditRoundDeadline(toDatetimeLocal(round.deadline));
    setEditingRound(true);
  }

  function cancelEditingRound() {
    setEditingRound(false);
  }

  function saveRoundEdits() {
    if (!round || !editRoundTitle.trim()) return;
    updateRound.mutate(
      {
        roundId: round.id,
        title: editRoundTitle.trim(),
        deadline: editRoundDeadline || null,
      },
      {
        onSuccess: () => {
          setEditingRound(false);
          toast({ message: "Äänestys päivitetty.", variant: "success" });
        },
        onError: () => toast({ message: "Päivittäminen epäonnistui.", variant: "error" }),
      },
    );
  }

  function startEditingOption(opt: MissionOption) {
    setEditingOptionId(opt.id);
    setEditOptTitle(opt.title);
    setEditOptDesc(opt.description ?? "");
    setEditOptUrgency(opt.urgency);
  }

  function cancelEditingOption() {
    setEditingOptionId(null);
  }

  function saveOptionEdits() {
    if (!round || editingOptionId === null || !editOptTitle.trim()) return;
    updateOption.mutate(
      {
        roundId: round.id,
        optionId: editingOptionId,
        title: editOptTitle.trim(),
        description: editOptDesc.trim() || undefined,
        urgency: editOptUrgency,
      },
      {
        onSuccess: () => {
          setEditingOptionId(null);
          toast({ message: "Tehtävä päivitetty.", variant: "success" });
        },
        onError: () => toast({ message: "Päivittäminen epäonnistui.", variant: "error" }),
      },
    );
  }

  function handleMoveOption(opt: MissionOption, direction: "up" | "down") {
    if (!round) return;
    const sorted = [...options].sort((a, b) => a.orderIndex - b.orderIndex);
    const idx = sorted.findIndex((o) => o.id === opt.id);
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;

    const target = sorted[idx];
    const swap = sorted[swapIdx];

    // Swap orderIndex values between the two options
    updateOption.mutate({
      roundId: round.id,
      optionId: target.id,
      orderIndex: swap.orderIndex,
    });
    updateOption.mutate({
      roundId: round.id,
      optionId: swap.id,
      orderIndex: target.orderIndex,
    });
  }

  const urgencyLabels: Record<UrgencyLevel, string> = {
    kriittinen: "Aikakriittinen",
    normaali: "Normaali",
    joustava: "Joustava",
  };

  const sortedOptions = [...options].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <HeadingLevelProvider>
      <Stack gap={6} className="p-1">

        {/* ── No active round: create form ── */}
        {!round && (
          <div>
            <Heading className="mb-3" variant="h6">Luo uusi äänestys</Heading>
            <Stack as="form" gap={3} onSubmit={handleCreateRound}>
              <Input
                label="Äänestyksen otsikko"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="esim. Valitse seuraava operaatio"
              />
              <Input
                label="Takaraja (valinnainen)"
                type="datetime-local"
                value={newDeadline}
                onChange={(e) => setNewDeadline(e.target.value)}
              />
              <Button type="submit" variant="solid" size="compact" loading={createRound.isPending} disabled={!newTitle.trim()}>
                Luo äänestys
              </Button>
            </Stack>
          </div>
        )}

        {/* ── Active round management ── */}
        {round && (
          <>
            {/* ── Round metadata (view / inline edit) ── */}
            <div>
              <Stack direction="row" align="center" justify="between" className="mb-1">
                <Heading variant="h6">Aktiivinen äänestys</Heading>
                <Text variant={round.status === "open" ? "overline" : "label"}>
                  {round.status === "open" ? "Avoinna" : "Suljettu"}
                </Text>
              </Stack>

              {!editingRound ? (
                <Stack gap={1}>
                  <Stack direction="row" align="center" gap={2}>
                    <Text variant="bold">{round.title}</Text>
                    <Button variant="ghost" size="compact" onClick={startEditingRound}>
                      <Icon name="pencil" size={14} />
                    </Button>
                  </Stack>
                  {round.deadline && (
                    <Text variant="muted" className="mt-0.5">
                      Takaraja: {new Date(round.deadline).toLocaleString("fi-FI")}
                    </Text>
                  )}
                  {!round.deadline && (
                    <Text variant="muted" className="mt-0.5">
                      Ei takarajaa
                    </Text>
                  )}
                </Stack>
              ) : (
                <Stack gap={3} className="mt-2">
                  <Input
                    label="Otsikko"
                    value={editRoundTitle}
                    onChange={(e) => setEditRoundTitle(e.target.value)}
                  />
                  <Input
                    label="Takaraja (valinnainen)"
                    type="datetime-local"
                    value={editRoundDeadline}
                    onChange={(e) => setEditRoundDeadline(e.target.value)}
                  />
                  <Stack direction="row" gap={2}>
                    <Button
                      variant="solid"
                      size="compact"
                      onClick={saveRoundEdits}
                      loading={updateRound.isPending}
                      disabled={!editRoundTitle.trim()}
                    >
                      <Icon name="check" size={14} className="mr-1" />
                      Tallenna
                    </Button>
                    <Button variant="ghost" size="compact" onClick={cancelEditingRound}>
                      Peruuta
                    </Button>
                  </Stack>
                </Stack>
              )}
            </div>

            <Separator />

            {/* Full results (GM-only) */}
            {fullResults && fullResults.length > 0 && (
              <div>
                <Text variant="label" className="mb-2">Täydet tulokset</Text>
                <Stack gap={1} as="ol">
                  {fullResults.map((r, i) => (
                    <Stack key={r.optionId} direction="row" align="center" justify="between" as="li">
                      <Text variant="bold">{i + 1}. {r.title}</Text>
                      <Text variant="caption" className="tabular-nums">
                        {r.score} p ({r.primaryCount}×3 + {r.secondaryCount}×1)
                      </Text>
                    </Stack>
                  ))}
                </Stack>
              </div>
            )}

            <Separator />

            {/* Add option form */}
            {round.status === "open" && (
              <div>
                <Heading className="mb-3" variant="h6">Lisää tehtävä</Heading>
                <Stack as="form" gap={3} onSubmit={handleAddOption}>
                  <Input
                    label="Tehtävän nimi"
                    value={optionTitle}
                    onChange={(e) => setOptionTitle(e.target.value)}
                    placeholder="Operaation koodenimi"
                  />
                  <TextArea
                    label="Kuvaus (valinnainen)"
                    rows={2}
                    size="compact"
                    value={optionDesc}
                    onChange={(e) => setOptionDesc(e.target.value)}
                    placeholder="Lyhyt kuvaus tehtävästä..."
                  />
                  <RadioGroup
                    name="urgency"
                    label="Kiireellisyys"
                    orientation="horizontal"
                    value={optionUrgency}
                    onValueChange={(v) => setOptionUrgency(v as UrgencyLevel)}
                  >
                    {(["kriittinen", "normaali", "joustava"] as const).map((u) => (
                      <RadioGroupItem
                        key={u}
                        value={u}
                        label={urgencyLabels[u]}
                      />
                    ))}
                  </RadioGroup>
                  <Button type="submit" variant="outline" size="compact" loading={addOption.isPending} disabled={!optionTitle.trim()}>
                    <Icon name="plus" size={14} className="mr-1" />
                    Lisää tehtävä
                  </Button>
                </Stack>
              </div>
            )}

            {/* ── Existing options list (with inline edit & reorder) ── */}
            {sortedOptions.length > 0 && (
              <div>
                <Text variant="label" className="mb-2">
                  Tehtävät ({sortedOptions.length})
                </Text>
                <Stack gap={1}>
                  {sortedOptions.map((opt, idx) => {
                    const isEditing = editingOptionId === opt.id;

                    if (isEditing) {
                      return (
                        <Stack
                          key={opt.id}
                          gap={3}
                          className="py-3 px-3 border border-[var(--theme-border)] rounded-md bg-[var(--theme-bg-subtle)]"
                        >
                          <Input
                            label="Tehtävän nimi"
                            value={editOptTitle}
                            onChange={(e) => setEditOptTitle(e.target.value)}
                          />
                          <TextArea
                            label="Kuvaus (valinnainen)"
                            rows={2}
                            size="compact"
                            value={editOptDesc}
                            onChange={(e) => setEditOptDesc(e.target.value)}
                          />
                          <RadioGroup
                            name="edit-urgency"
                            label="Kiireellisyys"
                            orientation="horizontal"
                            value={editOptUrgency}
                            onValueChange={(v) => setEditOptUrgency(v as UrgencyLevel)}
                          >
                            {(["kriittinen", "normaali", "joustava"] as const).map((u) => (
                              <RadioGroupItem
                                key={u}
                                value={u}
                                label={urgencyLabels[u]}
                              />
                            ))}
                          </RadioGroup>
                          <Stack direction="row" gap={2}>
                            <Button
                              variant="solid"
                              size="compact"
                              onClick={saveOptionEdits}
                              loading={updateOption.isPending}
                              disabled={!editOptTitle.trim()}
                            >
                              <Icon name="check" size={14} className="mr-1" />
                              Tallenna
                            </Button>
                            <Button variant="ghost" size="compact" onClick={cancelEditingOption}>
                              Peruuta
                            </Button>
                          </Stack>
                        </Stack>
                      );
                    }

                    return (
                      <Stack
                        key={opt.id}
                        direction="row"
                        align="center"
                        justify="between"
                        gap={2}
                        className="py-1 border-b border-[var(--theme-border-soft)] last:border-0"
                      >
                        <Stack gap={0} className="min-w-0 flex-1">
                          <Text variant="bold" className="truncate">{opt.title}</Text>
                          {opt.description && (
                            <Text variant="muted" className="text-xs truncate">{opt.description}</Text>
                          )}
                        </Stack>
                        <Stack direction="row" gap={0} align="center" className="shrink-0">
                          {/* Reorder arrows */}
                          {round.status === "open" && (
                            <>
                              <Button
                                variant="ghost"
                                size="compact"
                                onClick={() => handleMoveOption(opt, "up")}
                                disabled={idx === 0}
                              >
                                <Icon name="chevron-up" size={14} />
                              </Button>
                              <Button
                                variant="ghost"
                                size="compact"
                                onClick={() => handleMoveOption(opt, "down")}
                                disabled={idx === sortedOptions.length - 1}
                              >
                                <Icon name="chevron-down" size={14} />
                              </Button>
                            </>
                          )}
                          {/* Edit button */}
                          {round.status === "open" && (
                            <Button
                              variant="ghost"
                              size="compact"
                              onClick={() => startEditingOption(opt)}
                            >
                              <Icon name="pencil" size={14} />
                            </Button>
                          )}
                          {/* Delete button */}
                          {round.status === "open" && (
                            <Button
                              variant="ghost"
                              size="compact"
                              onClick={() => deleteOption.mutate({ roundId: round.id, optionId: opt.id })}
                              loading={deleteOption.isPending}
                            >
                              <Icon name="trash-2" size={14} />
                            </Button>
                          )}
                        </Stack>
                      </Stack>
                    );
                  })}
                </Stack>
              </div>
            )}

            <Separator />

            {/* Round actions */}
            <Stack gap={2}>
              {round.status === "open" && (
                <Button
                  variant="outline"
                  size="compact"
                  onClick={() => setShowCloseConfirm(true)}
                >
                  <Icon name="shield" size={14} className="mr-1.5" />
                  Sulje äänestys
                </Button>
              )}
              {round.status === "closed" && (
                <>
                  <NoticePanel variant="info" title="Äänestys suljettu">
                    Tarkastele tuloksia ja luo jakso voittajatehtävästä manuaalisesti.
                  </NoticePanel>
                  <Button
                    variant="outline"
                    size="compact"
                    onClick={() => setShowReopenConfirm(true)}
                  >
                    <Icon name="zap" size={14} className="mr-1.5" />
                    Avaa uudelleen
                  </Button>
                </>
              )}
              <Button
                variant="danger"
                size="compact"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Icon name="trash-2" size={14} className="mr-1.5" />
                Poista äänestys
              </Button>
            </Stack>
          </>
        )}
      </Stack>

      <ConfirmDialog
        open={showCloseConfirm}
        onOpenChange={setShowCloseConfirm}
        title="Sulje äänestys?"
        description="Pelaajat eivät voi enää äänestää sulkemisen jälkeen. Äänestyksen voi avata uudelleen tarvittaessa."
        confirmLabel="Sulje äänestys"
        onConfirm={() => {
          if (round) updateRound.mutate(
            { roundId: round.id, status: "closed" },
            {
              onSuccess: () => toast({ message: "Äänestys suljettu.", variant: "info" }),
              onError: () => toast({ message: "Sulkeminen epäonnistui.", variant: "error" }),
            },
          );
        }}
      />
      <ConfirmDialog
        open={showReopenConfirm}
        onOpenChange={setShowReopenConfirm}
        title="Avaa äänestys uudelleen?"
        description="Pelaajat voivat jälleen äänestää ja muuttaa valintojaan."
        confirmLabel="Avaa uudelleen"
        onConfirm={() => {
          if (round) updateRound.mutate(
            { roundId: round.id, status: "open" },
            {
              onSuccess: () => toast({ message: "Äänestys avattu uudelleen.", variant: "success" }),
              onError: () => toast({ message: "Avaaminen epäonnistui.", variant: "error" }),
            },
          );
        }}
      />
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Poista äänestys?"
        description="Kaikki äänet ja tehtävävaihtoehdot poistetaan pysyvästi."
        confirmLabel="Poista"
        variant="danger"
        onConfirm={() => {
          if (round) deleteRound.mutate(round.id, { onSuccess: onClose });
        }}
      />
    </HeadingLevelProvider>
  );
}
