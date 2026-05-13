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

  const urgencyLabels: Record<typeof optionUrgency, string> = {
    kriittinen: "Aikakriittinen",
    normaali: "Normaali",
    joustava: "Joustava",
  };

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
              <Button type="submit" variant="solid" loading={createRound.isPending} disabled={!newTitle.trim()}>
                Luo äänestys
              </Button>
            </Stack>
          </div>
        )}

        {/* ── Active round management ── */}
        {round && (
          <>
            <div>
              <Stack direction="row" align="center" justify="between" className="mb-1">
                <Heading variant="h6">Aktiivinen äänestys</Heading>
                <Text variant={round.status === "open" ? "overline" : "label"}>
                  {round.status === "open" ? "Avoinna" : "Suljettu"}
                </Text>
              </Stack>
              <Text variant="bold">{round.title}</Text>
              {round.deadline && (
                <Text variant="muted" className="mt-0.5">
                  Takaraja: {new Date(round.deadline).toLocaleString("fi-FI")}
                </Text>
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
                    onValueChange={(v) => setOptionUrgency(v as typeof optionUrgency)}
                  >
                    {(["kriittinen", "normaali", "joustava"] as const).map((u) => (
                      <RadioGroupItem
                        key={u}
                        value={u}
                        label={urgencyLabels[u]}
                      />
                    ))}
                  </RadioGroup>
                  <Button type="submit" variant="outline" size="sm" loading={addOption.isPending} disabled={!optionTitle.trim()}>
                    <Icon name="plus" size={14} className="mr-1" />
                    Lisää tehtävä
                  </Button>
                </Stack>
              </div>
            )}

            {/* Existing options list */}
            {options.length > 0 && (
              <div>
                <Text variant="label" className="mb-2">
                  Tehtävät ({options.length})
                </Text>
                <Stack gap={1}>
                  {options.map((opt) => (
                    <Stack key={opt.id} direction="row" align="center" justify="between" gap={2} className="py-1 border-b border-[var(--theme-border-soft)] last:border-0">
                      <Text variant="bold" className="truncate">{opt.title}</Text>
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
                    </Stack>
                  ))}
                </Stack>
              </div>
            )}

            <Separator />

            {/* Round actions */}
            <Stack gap={2}>
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
            </Stack>
          </>
        )}
      </Stack>

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
