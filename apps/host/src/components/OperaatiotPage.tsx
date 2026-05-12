import { useAuth } from "@repo/auth/use-auth";
import { Button } from "@repo/ui/components/Button";
import { CountdownDisplay } from "@repo/ui/components/CountdownDisplay";
import { Drawer } from "@repo/ui/components/Drawer";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Icon } from "@repo/ui/components/Icon";
import { Stack } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page, PageBody } from "@repo/ui/components/Page";
import { SelectionCardGroup } from "@repo/ui/components/SelectionCard";
import { Text } from "@repo/ui/components/Text";
import { useToast } from "@repo/ui/components/Toast";
import { VotingStandings } from "@repo/ui/components/VotingStandings";
import React from "react";
import {
  useActiveVotingRound,
  useCastVote,
  useDeleteVote,
  useVotingResults,
} from "../api/mission-votes";
import { MissionOptionCard } from "./MissionOptionCard";
import { VotingRoundManager } from "./VotingRoundManager";

export function OperaatiotPage() {
  const { user } = useAuth();
  const isGm = user?.role === "gm";

  const { data, isLoading, error } = useActiveVotingRound();
  const round = data?.round ?? null;
  const options = data?.options ?? [];
  const myVote = data?.myVote ?? null;

  const { data: results = [] } = useVotingResults(round?.id ?? null);

  const [selectionValue, setSelectionValue] = React.useState<{
    primary: string | null;
    secondary: string | null;
  }>({ primary: null, secondary: null });

  const [managerOpen, setManagerOpen] = React.useState(false);

  React.useEffect(() => {
    if (myVote) {
      setSelectionValue({
        primary: String(myVote.primaryOptionId),
        secondary: myVote.secondaryOptionId ? String(myVote.secondaryOptionId) : null,
      });
    }
  }, [myVote]);

  const castVote = useCastVote();
  const deleteVote = useDeleteVote();
  const { toast } = useToast();
  const isVotingClosed = round?.status === "closed";
  const hasVoted = !!myVote;

  function handleSelectionChange(value: { primary: string | null; secondary: string | null }) {
    if (isVotingClosed || !round) return;
    setSelectionValue(value);

    if (!value.primary) {
      // Player fully deselected — remove their vote from the server
      deleteVote.mutate(round.id, {
        onSuccess: () => toast({ message: "Äänesi on poistettu.", variant: "info" }),
        onError: () => toast({ message: "Äänen poistaminen epäonnistui.", variant: "error" }),
      });
      return;
    }

    castVote.mutate(
      {
        roundId: round.id,
        primaryOptionId: Number(value.primary),
        secondaryOptionId: value.secondary ? Number(value.secondary) : undefined,
      },
      {
        onSuccess: () => toast({ message: "Äänesi on rekisteröity.", variant: "success" }),
        onError: () => toast({ message: "Äänestäminen epäonnistui. Yritä uudelleen.", variant: "error" }),
      },
    );
  }

  // ── Hero title: round name when active, generic fallback ──────────────────

  const heroTitle = round?.title ?? "Operaatiot";
  const heroDescription =
    round?.status === "closed"
      ? "Äänestys on suljettu"
      : undefined;

  return (
    <Page>
      {/* Hero — Page sets context=1, HeadingLevelProvider bumps to h2 */}
      <HeadingLevelProvider>
        <Hero title={heroTitle} description={heroDescription}>
          <Stack direction="row" gap={3} align="center" className="mt-3">
            {round?.status === "open" && round.deadline && (
              <CountdownDisplay deadline={round.deadline} size="compact" />
            )}
            {round?.status === "open" && !round.deadline && (
              <Text variant="overline">Avoinna</Text>
            )}
            {isGm && (
              <Button variant="outline" size="sm" onClick={() => setManagerOpen(true)}>
                <Icon name="settings" size={14} className="mr-1.5" />
                Hallinnoi
              </Button>
            )}
          </Stack>
        </Hero>
      </HeadingLevelProvider>

      {/* GM Drawer */}
      {isGm && (
        <Drawer
          title="Äänestyksen hallinta"
          expanded={managerOpen}
          onExpandedChange={setManagerOpen}
        >
          <VotingRoundManager round={round} options={options} onClose={() => setManagerOpen(false)} />
        </Drawer>
      )}

      {/* Content — HeadingLevelProvider bumps to h2 → h3 for sections */}
      <HeadingLevelProvider>
        <PageBody>

          {isLoading && (
            <LoadingState message="Ladataan operaatioita..." size="large" className="mt-8" />
          )}

          {error && (
            <NoticePanel variant="error" title="Virhe">
              Operaatioiden lataaminen epäonnistui.
            </NoticePanel>
          )}

          {/* No active round — player */}
          {!isLoading && !error && !round && !isGm && (
            <Stack gap={4} align="center" className="py-16">
              <Icon name="inbox" variant="branded" />
              <Heading>Ei aktiivista äänestystä</Heading>
              <Text variant="muted">
                Odota pelinjohtajan seuraavaa tehtäväjakoa. Pääset äänestämään täällä heti, kun äänestys avautuu.
              </Text>
            </Stack>
          )}

          {/* No active round — GM */}
          {!isLoading && !error && !round && isGm && (
            <Stack gap={4}>
              <NoticePanel variant="info" title="Ei aktiivista äänestystä">
                Luo uusi äänestys, jotta pelaajat voivat äänestää seuraavasta operaatiosta.
              </NoticePanel>
              <Button variant="solid" onClick={() => setManagerOpen(true)}>
                <Icon name="plus" size={14} className="mr-1.5" />
                Luo äänestys
              </Button>
            </Stack>
          )}

          {/* Active round */}
          {!isLoading && !error && round && (
            <Stack gap={6}>

              {isVotingClosed && (
                <NoticePanel variant="info" title="Äänestys suljettu">
                  Pelinjohtaja päättää seuraavasta operaatiosta tulosten perusteella.
                </NoticePanel>
              )}

              {/* Current standings — shown before the cards so players can see the race */}
              {results.length > 0 && (
                <VotingStandings
                  items={results.map((r) => ({ id: r.optionId, title: r.title }))}
                />
              )}

              {/* Empty options */}
              {options.length === 0 && (
                <Stack gap={3} align="center" className="py-16">
                  <Icon name="inbox" variant="branded" />
                  <Heading>Ei tehtävävaihtoehtoja</Heading>
                  <Text variant="muted">
                    {isGm
                      ? "Lisää tehtäviä äänestyksen hallintapaneelista."
                      : "Pelinjohtaja lisää pian äänestettävät tehtävät."}
                  </Text>
                </Stack>
              )}

              {/* Mission cards */}
              {options.length > 0 && (
                <HeadingLevelProvider>
                  <Stack gap={2}>
                    <Heading>Tehtävä</Heading>
                    <Text variant="muted">
                      Valitse ensisijainen tehtäväsi (3 pistettä) napauttamalla. Napauta uudelleen lisätäksesi toissijainen valinta (1 piste). Eniten ääniä saanut operaatio käynnistyy täysimittaisena episodina. Toiseksi tullut ratkaistaan nopanheitolla.
                    </Text>
                  </Stack>
                  <SelectionCardGroup
                    value={selectionValue}
                    onValueChange={handleSelectionChange}
                    disabled={isVotingClosed}
                  >
                    {options.map((option) => {
                      const selectionState =
                        selectionValue.primary === String(option.id)
                          ? "primary"
                          : selectionValue.secondary === String(option.id)
                            ? "secondary"
                            : "none";

                      return (
                        <MissionOptionCard
                          key={option.id}
                          roundId={round.id}
                          option={option}
                          selectionState={selectionState}
                          votingClosed={isVotingClosed}
                        />
                      );
                    })}
                  </SelectionCardGroup>

                  {/* Confirmation — shown below the cards after voting */}
                  {hasVoted && !isVotingClosed && (
                    <NoticePanel variant="success" title="Äänesi on rekisteröity">
                      Voit vielä muuttaa valintaasi ennen äänestyksen sulkeutumista.
                    </NoticePanel>
                  )}
                </HeadingLevelProvider>
              )}

            </Stack>
          )}


        </PageBody>
      </HeadingLevelProvider>
    </Page>
  );
}
