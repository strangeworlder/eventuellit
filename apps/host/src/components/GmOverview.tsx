import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Icon } from "@repo/ui/components/Icon";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Select } from "@repo/ui/components/Select";
import { Text } from "@repo/ui/components/Text";
import { TextArea } from "@repo/ui/components/TextArea";
import { useState } from "react";
import { type GmOverviewPlayer, useGmOverview, useSendInvite } from "../api/dashboard";
import { useEpisodes } from "../api/episodes";
import { usePlayerUsers } from "../api/users";

function InviteStatusBadge({ status }: { status: GmOverviewPlayer["inviteStatus"] }) {
  if (status === "enrolled")
    return (
      <Badge variant="solid" icon="circle-check">
        Mukana
      </Badge>
    );
  if (status === "pending")
    return (
      <Badge variant="highlight" icon="calendar">
        Kutsuttu
      </Badge>
    );
  if (status === "declined") return <Badge variant="ghost">Hylätty</Badge>;
  return <Badge variant="ghost">Ei kutsuttu</Badge>;
}

function ReadingProgressBar({ completed, total }: { completed: number; total: number }) {
  if (total === 0)
    return (
      <Text variant="muted" className="text-xs">
        Ei lukemistoa
      </Text>
    );
  const pct = Math.round((completed / total) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-text-muted">
        <span>Lukemisto</span>
        <span>
          {completed}/{total}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--theme-surface-tint)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--theme-secondary)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function PlayerStatusCard({
  player,
  onSendInvite,
}: {
  player: GmOverviewPlayer;
  episodeId: number;
  onSendInvite: (userId: number) => void;
}) {
  const canInvite = player.inviteStatus === null || player.inviteStatus === "declined";

  return (
    <Card variant="outline">
      <CardHeader>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <CardTitle>{player.username ?? `Pelaaja #${player.userId}`}</CardTitle>
            {player.hasCharacterLinked && player.characterName && (
              <Text variant="muted" className="text-sm">
                <Icon name="user-circle" size={12} className="inline mr-1" />
                {player.characterName}
              </Text>
            )}
          </div>
          <InviteStatusBadge status={player.inviteStatus} />
        </div>
      </CardHeader>
      <CardContent variant="dense">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm flex-wrap">
            {player.hasCharacterLinked ? (
              <span className="flex items-center gap-1 text-[var(--theme-secondary)]">
                <Icon name="circle-check" size={14} />
                Hahmo yhdistetty
              </span>
            ) : (
              <span className="flex items-center gap-1 text-text-muted">
                <Icon name="circle-x" size={14} />
                Ei hahmoa
              </span>
            )}

            {player.pendingRecaps > 0 && (
              <span className="flex items-center gap-1 text-text-muted">
                <Icon name="file-text" size={14} />
                {player.pendingRecaps} kertaus kirjoittamatta
              </span>
            )}
          </div>

          <ReadingProgressBar
            completed={player.readingProgress.completed}
            total={player.readingProgress.total}
          />

          {canInvite && (
            <div className="pt-1">
              <Button variant="outline" size="sm" onClick={() => onSendInvite(player.userId)}>
                <Icon name="send" size={14} className="mr-1" />
                Lähetä kutsu
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function InviteForm({ episodeId, onClose }: { episodeId: number; onClose: () => void }) {
  const { data: allUsers } = usePlayerUsers();
  const sendInviteMutation = useSendInvite();
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [message, setMessage] = useState("");

  const userOptions = (allUsers ?? []).map((u) => ({
    value: String(u.id),
    label: `${u.username} (${u.email})`,
  }));

  const handleSubmit = () => {
    const userId = parseInt(selectedUserId, 10);
    if (!userId) return;
    sendInviteMutation.mutate(
      { episodeId, userId, message: message.trim() || undefined },
      {
        onSuccess: () => {
          setSelectedUserId("");
          setMessage("");
          onClose();
        },
      },
    );
  };

  return (
    <Card variant="callout" className="p-4">
      <HeadingLevelProvider>
        <div className="space-y-3">
          <Heading>Kutsu pelaaja</Heading>
          <Select
            label="Pelaaja"
            placeholder="Valitse pelaaja..."
            options={userOptions}
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          />
          <TextArea
            label="Viesti (valinnainen)"
            placeholder="Kirjoita pelaajalle viesti..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <Button
              variant="solid"
              size="sm"
              onClick={handleSubmit}
              disabled={!selectedUserId || sendInviteMutation.isPending}
            >
              Lähetä kutsu
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Peruuta
            </Button>
          </div>
          {sendInviteMutation.isError && (
            <Text variant="muted" className="text-xs text-[var(--theme-accent)]">
              {(sendInviteMutation.error as Error).message}
            </Text>
          )}
        </div>
      </HeadingLevelProvider>
    </Card>
  );
}

export function GmOverview() {
  const { data: episodes } = useEpisodes();
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<number | null>(null);
  const [showInviteForm, setShowInviteForm] = useState(false);

  const activeEpisodes = (episodes ?? []).filter(
    (e) => e.status === "active" || e.status === "planned",
  );

  const episodeOptions = activeEpisodes.map((e) => ({
    value: String(e.id),
    label: e.title,
  }));

  const { data: overviewData, isLoading } = useGmOverview(selectedEpisodeId);

  const handleSendInvite = (_userId: number) => {
    setShowInviteForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-[var(--theme-border-medium)] pb-2">
        <Heading>Pelinjohtajan näkymä</Heading>
      </div>

      <Select
        label="Valitse jakso"
        placeholder="Valitse jakso..."
        options={episodeOptions}
        value={selectedEpisodeId ? String(selectedEpisodeId) : ""}
        onChange={(e) => {
          const val = parseInt(e.target.value, 10);
          setSelectedEpisodeId(val || null);
          setShowInviteForm(false);
        }}
      />

      {selectedEpisodeId && (
        <>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowInviteForm((v) => !v)}>
              <Icon name="user-circle" size={14} className="mr-1" />
              {showInviteForm ? "Sulje lomake" : "Kutsu pelaaja"}
            </Button>
          </div>

          {showInviteForm && (
            <InviteForm episodeId={selectedEpisodeId} onClose={() => setShowInviteForm(false)} />
          )}

          {isLoading ? (
            <LoadingState message="Ladataan pelaajatilannetta..." />
          ) : overviewData?.players.length === 0 ? (
            <NoticePanel variant="info">
              Tähän jaksoon ei ole kutsuttu tai ilmoittautunut pelaajia.
            </NoticePanel>
          ) : (
            <HeadingLevelProvider>
              <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
                {overviewData?.players.map((player) => (
                  <PlayerStatusCard
                    key={player.userId}
                    player={player}
                    episodeId={selectedEpisodeId}
                    onSendInvite={handleSendInvite}
                  />
                ))}
              </div>
            </HeadingLevelProvider>
          )}
        </>
      )}
    </div>
  );
}
