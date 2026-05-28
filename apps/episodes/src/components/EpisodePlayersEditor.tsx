import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Heading } from "@repo/ui/components/Heading";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Text } from "@repo/ui/components/Text";
import { useEpisodeInvites, useSendInvite } from "../api/episode-invites";
import { useDisenrollPlayer, useEnrollPlayer, useEpisodePlayers } from "../api/episode-players";
import { usePlayerUsers } from "../api/users";

export function EpisodePlayersEditor({ episodeId }: { episodeId: number }) {
  const { data: allPlayers, isLoading: isPlayersLoading } = usePlayerUsers();
  const { data: enrolled, isLoading: isEnrolledLoading } = useEpisodePlayers(episodeId);
  const { data: invites, isLoading: isInvitesLoading } = useEpisodeInvites(episodeId);
  const { mutate: enroll, isPending: isEnrolling } = useEnrollPlayer();
  const { mutate: disenroll, isPending: isDisenrolling } = useDisenrollPlayer();
  const { mutate: sendInvite, isPending: isSendingInvite } = useSendInvite();

  const isPending = isEnrolling || isDisenrolling || isSendingInvite;

  if (isPlayersLoading || isEnrolledLoading || isInvitesLoading)
    return <LoadingState message="Ladataan pelaajia..." />;

  const enrolledUserIds = new Set((enrolled ?? []).map((e) => e.userId));
  const enrollmentByUserId = new Map((enrolled ?? []).map((e) => [e.userId, e]));
  const pendingInviteUserIds = new Set(
    (invites ?? []).filter((i) => i.status === "pending").map((i) => i.userId),
  );

  return (
    <div className="space-y-2">
      <Heading>Pelaajat</Heading>
      {!allPlayers || allPlayers.length === 0 ? (
        <Text variant="muted">Ei pelaajatilejä rekisteröity.</Text>
      ) : (
        <div className="space-y-1">
          {allPlayers.map((player) => {
            const isEnrolled = enrolledUserIds.has(player.id);
            const hasPendingInvite = pendingInviteUserIds.has(player.id);
            const enrollment = enrollmentByUserId.get(player.id);
            return (
              <div
                key={player.id}
                className="flex items-center justify-between gap-2 py-1.5 border-b border-[var(--theme-border-soft)] last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)] truncate">
                    {player.username}
                  </span>
                  <Text variant="caption" className="truncate block">
                    {player.email}
                  </Text>
                  {hasPendingInvite && !isEnrolled && (
                    <Badge variant="highlight" className="mt-0.5">
                      Kutsu lähetetty
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  {!isEnrolled && !hasPendingInvite && (
                    <Button
                      size="compact"
                      variant="ghost"
                      disabled={isPending}
                      onClick={() => sendInvite({ episodeId, userId: player.id })}
                      title="Lähetä kutsu"
                    >
                      Kutsu
                    </Button>
                  )}
                  <Button
                    size="compact"
                    variant={isEnrolled ? "danger" : "outline"}
                    disabled={isPending}
                    onClick={() => {
                      if (isEnrolled && enrollment) {
                        disenroll({ id: enrollment.id, episodeId });
                      } else {
                        enroll({ episodeId, userId: player.id });
                      }
                    }}
                  >
                    {isEnrolled ? "Poista" : "Lisää"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
