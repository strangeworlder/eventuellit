import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Icon, type IconName } from "@repo/ui/components/Icon";
import { Stack } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Text } from "@repo/ui/components/Text";
import { useNavigate } from "react-router-dom";
import {
  type DashboardAction,
  type DashboardEpisode,
  type PendingInvite,
  useDashboard,
  useRespondToInvite,
} from "../api/dashboard";

function actionIcon(type: DashboardAction["type"]): IconName {
  switch (type) {
    case "create_character":
      return "user-plus";
    case "link_character":
      return "link";
    case "update_character":
      return "pencil";
    case "update_names":
      return "pencil";
    case "reading":
      return "book";
    case "task":
      return "check-square";
    case "write_recap":
      return "file-text";
  }
}

function actionVariant(type: DashboardAction["type"]): "solid" | "outline" | "highlight" | "ghost" {
  switch (type) {
    case "create_character":
    case "link_character":
      return "solid";
    case "update_character":
      return "highlight";
    case "update_names":
      return "highlight";
    case "reading":
    case "task":
      return "outline";
    case "write_recap":
      return "highlight";
  }
}

function ActionRow({
  action,
  onNavigate,
}: {
  action: DashboardAction;
  onNavigate: (url: string) => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--theme-border-soft)] last:border-0">
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={actionVariant(action.type)} icon={actionIcon(action.type)}>
            {action.label}
          </Badge>
        </div>
        <Text variant="muted" className="text-xs">
          {action.description}
        </Text>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onNavigate(action.url)}
        className="shrink-0"
      >
        Siirry
      </Button>
    </div>
  );
}

function EpisodeStatusBadge({ status }: { status: string }) {
  if (status === "active")
    return (
      <Badge variant="solid" icon="sparkles">
        Aktiivinen
      </Badge>
    );
  if (status === "completed") return <Badge variant="outline">Arkistoitu</Badge>;
  return <Badge variant="ghost">Tulossa</Badge>;
}

function EpisodeActionsCard({
  episode,
  onNavigate,
}: {
  episode: DashboardEpisode;
  onNavigate: (url: string) => void;
}) {
  const hasActions = episode.actions.length > 0;

  return (
    <Card variant="outline" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle>{episode.episodeTitle}</CardTitle>
          <EpisodeStatusBadge status={episode.episodeStatus} />
        </div>
      </CardHeader>
      <CardContent variant="dense">
        {hasActions ? (
          <div>
            {episode.actions.map((action, i) => (
              <ActionRow key={`${action.type}-${i}`} action={action} onNavigate={onNavigate} />
            ))}
          </div>
        ) : (
          <Text variant="muted" className="py-2">
            Ei avoimia tehtäviä tälle jaksolle.
          </Text>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(`/episodes/${episode.episodeSlug}`)}
        >
          <Icon name="map" size={14} className="mr-1" />
          Jakson tiedot
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate(`/generator/prep/${episode.episodeId}`)}
        >
          <Icon name="list-checks" size={14} className="mr-1" />
          Valmistaudu
        </Button>
      </CardFooter>
    </Card>
  );
}

function InviteCard({
  invite,
  onAccept,
  onDecline,
  isPending,
}: {
  invite: PendingInvite;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
  isPending: boolean;
}) {
  const invitedDate = new Date(invite.createdAt).toLocaleDateString("fi-FI");

  return (
    <NoticePanel
      variant="info"
      title={invite.episodeTitle ?? "Jakso"}
      actions={
        <>
          <Button
            variant="solid"
            size="sm"
            onClick={() => onAccept(invite.id)}
            disabled={isPending}
          >
            Hyväksy kutsu
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDecline(invite.id)}
            disabled={isPending}
          >
            Hylkää
          </Button>
        </>
      }
    >
      <div className="space-y-1">
        {invite.episodeStatus && <EpisodeStatusBadge status={invite.episodeStatus} />}
        <Text className="text-sm">
          {invite.invitedByUsername
            ? `${invite.invitedByUsername} kutsuu sinut tähän jaksoon.`
            : "Sinut on kutsuttu tähän jaksoon."}
        </Text>
        {invite.message && (
          <Text variant="muted" className="text-sm italic">
            "{invite.message}"
          </Text>
        )}
        <Text variant="muted" className="text-xs">
          Kutsuttu: {invitedDate}
        </Text>
      </div>
    </NoticePanel>
  );
}

export function PlayerDashboard() {
  const navigate = useNavigate();
  const { data, isLoading, error } = useDashboard();
  const respondMutation = useRespondToInvite();

  const handleNavigate = (url: string) => {
    navigate(url);
  };

  const handleAccept = (id: number) => {
    respondMutation.mutate({ id, status: "accepted" });
  };

  const handleDecline = (id: number) => {
    respondMutation.mutate({ id, status: "declined" });
  };

  if (isLoading) {
    return <LoadingState message="Ladataan tilannekatsausta..." size="large" className="mt-16" />;
  }

  if (error) {
    return (
      <NoticePanel variant="error" title="Virhe">
        Tilannekatsauksen lataaminen epäonnistui.
      </NoticePanel>
    );
  }

  const hasPendingInvites = (data?.pendingInvites.length ?? 0) > 0;
  const hasEpisodes = (data?.episodes.length ?? 0) > 0;
  const isEmpty = !hasPendingInvites && !hasEpisodes;

  if (isEmpty) {
    return (
      <Stack gap={4} align="center" className="py-24">
        <Icon name="inbox" variant="branded" />
        <Heading>Ei aktiivisia jaksoja</Heading>
        <Text variant="muted">Odota pelinjohtajan kutsua päästäksesi mukaan jaksoon.</Text>
      </Stack>
    );
  }

  return (
    <div className="space-y-10">
      {hasPendingInvites && (
        <section>
          <HeadingLevelProvider>
            <div className="border-b-2 border-[var(--theme-border-medium)] pb-2 mb-4">
              <Heading>Kutsut</Heading>
            </div>
            <div className="space-y-4">
              {data!.pendingInvites.map((invite) => (
                <InviteCard
                  key={invite.id}
                  invite={invite}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  isPending={respondMutation.isPending}
                />
              ))}
            </div>
          </HeadingLevelProvider>
        </section>
      )}

      {hasEpisodes && (
        <section>
          <HeadingLevelProvider>
            <div className="border-b-2 border-[var(--theme-border-medium)] pb-2 mb-4">
              <Heading>Jaksot</Heading>
            </div>
            <div className="space-y-4">
              {data!.episodes.map((episode) => (
                <EpisodeActionsCard
                  key={episode.episodeId}
                  episode={episode}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </HeadingLevelProvider>
        </section>
      )}
    </div>
  );
}
