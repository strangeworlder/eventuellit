import { Button } from "@repo/ui/components/Button";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Icon } from "@repo/ui/components/Icon";
import { Input } from "@repo/ui/components/Input";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";
import { useToast } from "@repo/ui/components/Toast";
import React from "react";
import {
  useAddMissionOption,
  useCreateVotingRound,
  useDeleteMissionOption,
  useDeleteVotingRound,
  useUpdateVotingRound,
  useVotingResultsFull,
  type MissionOption,
  type VotingRound,
} from "../api/mission-votes";

interface VotingRoundManagerProps {
  round: VotingRound | null;
  options: MissionOption[];
  onClose?: () => void;
}

export function VotingRoundManager({ round, options, onClose }: VotingRoundManagerProps) {
  const [newTitle, setNewTitle] = React.useState("");
  const [newDeadline, setNewDeadline] = React.useState("");
  const [optionTitle, setOptionTitle] = React.useState("");
  const [optionDesc, setOptionDesc] = React.useState("");
  const [optionUrgency, setOptionUrgency] = React.useState<"kriittinen" | "normaali" | "joustava">("normaali");
  const [showCloseConfirm, setShowCloseConfirm] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const createRound = useCreateVotingRound();
  const updateRound = useUpdateVotingRound();
  const deleteRound = useDeleteVotingRound();
  const addOption = useAddMissionOption();
  const deleteOption = useDeleteMissionOption();
  const { data: fullResults } = useVotingResultsFull(round?.id ?? null);
  const { toast } = useToast();

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

  return (
    <HeadingLevelProvider>
      <div className="flex flex-col gap-6 p-1">

        {/* ── No active round: create form ── */}
        {!round && (
          <div>
            <Heading className="text-sm mb-3">Luo uusi äänestys</Heading>
            <form onSubmit={handleCreateRound} className="flex flex-col gap-3">
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
              <Button type="submit" variant="solid" loading={createRound.isPending} disabled={!newTitle.trim()}>
                Luo äänestys
              </Button>
            </form>
          </div>
        )}

        {/* ── Active round management ── */}
        {round && (
          <>
            <div>
              <div className="flex items-center justify-between mb-1">
                <Heading className="text-sm">Aktiivinen äänestys</Heading>
                <span className={`text-xs font-heading font-black uppercase tracking-widest ${round.status === "open" ? "text-[var(--theme-secondary)]" : "text-[var(--theme-text-subtle)]"}`}>
                  {round.status === "open" ? "Avoinna" : "Suljettu"}
                </span>
              </div>
              <Text className="text-sm font-semibold">{round.title}</Text>
              {round.deadline && (
                <Text variant="muted" className="text-xs mt-0.5">
                  Takaraja: {new Date(round.deadline).toLocaleString("fi-FI")}
                </Text>
              )}
            </div>

            <Separator />

            {/* Full results (GM-only) */}
            {fullResults && fullResults.length > 0 && (
              <div>
                <Heading className="text-xs mb-2 text-[var(--theme-text-subtle)]">Täydet tulokset</Heading>
                <ol className="space-y-1">
                  {fullResults.map((r, i) => (
                    <li key={r.optionId} className="flex items-center justify-between text-sm">
                      <span className="font-heading font-bold">{i + 1}. {r.title}</span>
                      <span className="text-[var(--theme-text-subtle)] tabular-nums text-xs">
                        {r.score} p ({r.primaryCount}×3 + {r.secondaryCount}×1)
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <Separator />

            {/* Add option form */}
            {round.status === "open" && (
              <div>
                <Heading className="text-sm mb-3">Lisää tehtävä</Heading>
                <form onSubmit={handleAddOption} className="flex flex-col gap-3">
                  <Input
                    label="Tehtävän nimi"
                    value={optionTitle}
                    onChange={(e) => setOptionTitle(e.target.value)}
                    placeholder="Operaation koodenimi"
                  />
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--theme-text-muted)]">
                      Kuvaus (valinnainen)
                    </label>
                    <textarea
                      rows={2}
                      value={optionDesc}
                      onChange={(e) => setOptionDesc(e.target.value)}
                      placeholder="Lyhyt kuvaus tehtävästä..."
                      className="resize-none rounded-sm border border-[var(--theme-border-soft)] bg-[var(--theme-surface-tint)] px-3 py-2 text-sm text-[var(--theme-text)] placeholder:text-[var(--theme-text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--theme-secondary)] focus:ring-offset-2 focus:ring-offset-[var(--theme-bg)]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-black uppercase tracking-widest text-[var(--theme-text-muted)]">
                      Kiireellisyys
                    </label>
                    <div className="flex gap-2">
                      {(["kriittinen", "normaali", "joustava"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setOptionUrgency(u)}
                          className={`px-3 py-1 rounded-sm border text-xs font-heading font-bold uppercase tracking-widest transition-colors ${optionUrgency === u ? "border-[var(--theme-secondary)] text-[var(--theme-secondary)] bg-[var(--theme-surface-tint)]" : "border-[var(--theme-border-soft)] text-[var(--theme-text-subtle)]"}`}
                        >
                          {u === "kriittinen" ? "aikakriittinen" : u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" variant="outline" size="sm" loading={addOption.isPending} disabled={!optionTitle.trim()}>
                    <Icon name="plus" size={14} className="mr-1" />
                    Lisää tehtävä
                  </Button>
                </form>
              </div>
            )}

            {/* Existing options list */}
            {options.length > 0 && (
              <div>
                <Heading className="text-xs mb-2 text-[var(--theme-text-subtle)]">
                  Tehtävät ({options.length})
                </Heading>
                <ul className="space-y-1">
                  {options.map((opt) => (
                    <li key={opt.id} className="flex items-center justify-between gap-2 py-1 border-b border-[var(--theme-border-soft)] last:border-0">
                      <span className="text-sm font-semibold truncate">{opt.title}</span>
                      {round.status === "open" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteOption.mutate({ roundId: round.id, optionId: opt.id })}
                          loading={deleteOption.isPending}
                        >
                          <Icon name="trash-2" size={14} />
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Round actions */}
            <div className="flex flex-col gap-2">
              {round.status === "open" && (
                <Button
                  variant="outline"
                  onClick={() => setShowCloseConfirm(true)}
                >
                  <Icon name="shield" size={14} className="mr-1.5" />
                  Sulje äänestys
                </Button>
              )}
              {round.status === "closed" && (
                <NoticePanel variant="info" title="Äänestys suljettu">
                  Tarkastele tuloksia ja luo jakso voittajatehtävästä manuaalisesti.
                </NoticePanel>
              )}
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Icon name="trash-2" size={14} className="mr-1.5" />
                Poista äänestys
              </Button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={showCloseConfirm}
        onOpenChange={setShowCloseConfirm}
        title="Sulje äänestys?"
        description="Pelaajat eivät voi enää äänestää sulkemisen jälkeen. Tätä ei voi peruuttaa."
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
