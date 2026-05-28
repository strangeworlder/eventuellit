import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { PageBody } from "@repo/ui/components/Page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/Tabs";
import { Text } from "@repo/ui/components/Text";
import { useArticleScrollProgress } from "@repo/ui/components/useArticleScrollProgress";
import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEpisodePlayers } from "../api/episode-players";
import {
  type Episode,
  useDeleteEpisode,
  useEpisode,
  useEpisodes,
  useUpdateEpisode,
} from "../api/episodes";
import { useSessions } from "../api/sessions";
import { EpisodeEditForm } from "./EpisodeEditForm";
import { EpisodeRecapTab } from "./EpisodeRecapTab";
import { GmToolsPanel } from "./GmToolsPanel";
import { TyrannyRollBadge } from "./TyrannyRollBadge";

export function EpisodeDetails({
  id,
  onCreateNew,
  basePath,
}: {
  id: string;
  onCreateNew?: () => void;
  basePath: string;
}) {
  const { data: episodes, isLoading: isEpisodesLoading } = useEpisodes();
  const episode = episodes?.find((e) => e.slug === id);
  const episodeId = episode?.id ?? 0;
  const { data: fullEpisode, isLoading: isEpisodeLoading } = useEpisode(episodeId);
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode } = useUpdateEpisode();
  const { mutate: deleteEpisode } = useDeleteEpisode();
  const { data: sessions, isLoading: isSessionsLoading } = useSessions(episodeId);
  const { data: episodePlayers } = useEpisodePlayers(episodeId);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const articleRef = useRef<HTMLDivElement>(null);
  const recapRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteEpisodeOpen, setDeleteEpisodeOpen] = useState(false);

  const activeTab = pathname.endsWith("/kertaus") ? "kertaus" : "tiedot";

  useArticleScrollProgress({
    articleRef,
    source: "episodes",
    route: pathname,
    enabled: activeTab === "tiedot",
  });

  useArticleScrollProgress({
    articleRef: recapRef,
    source: "episodes",
    route: pathname,
    enabled: activeTab === "kertaus",
  });

  const slugBase = basePath === "/" ? `/${id}` : `${basePath}/${id}`;
  const tabPath = (tab: string) => (tab === "kertaus" ? `${slugBase}/kertaus` : slugBase);

  if (isEpisodesLoading || isEpisodeLoading) return <LoadingState message="Ladataan jaksoa..." />;
  if (!episode || !fullEpisode)
    return <EmptyState title="Jaksoa ei löytynyt." className="min-h-[50vh]" />;

  if (isEditing && isGm) {
    return (
      <EpisodeEditForm
        episode={fullEpisode}
        onCancel={() => setIsEditing(false)}
        onSave={(data) => {
          updateEpisode(
            { ...data, id: fullEpisode.id },
            {
              onSuccess: () => setIsEditing(false),
            },
          );
        }}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <HeadingLevelProvider>
        <Hero title={fullEpisode.title} description={fullEpisode.description || ""}>
          <div className="flex flex-wrap gap-2 mt-4">
            {fullEpisode.status === "active" && (
              <Badge variant="solid" icon="sparkles">
                Aktiivinen Jakso
              </Badge>
            )}
            {fullEpisode.status === "completed" && <Badge variant="outline">Arkistoitu</Badge>}
            {fullEpisode.status === "planned" && <Badge variant="outline">Tulossa</Badge>}
          </div>
          <TyrannyRollBadge
            episodeId={fullEpisode.id}
            tyrannyRoll={fullEpisode.tyrannyRoll}
            sessions={sessions}
          />
        </Hero>

        {isGm && onCreateNew && (
          <>
            <GmToolsPanel
              episode={fullEpisode}
              onEdit={() => setIsEditing(true)}
              onDelete={() => setDeleteEpisodeOpen(true)}
              onCreateNew={onCreateNew}
            />
            <ConfirmDialog
              open={deleteEpisodeOpen}
              onOpenChange={setDeleteEpisodeOpen}
              title="Poista jakso?"
              description="Jakso poistetaan pysyvästi. Tätä toimintoa ei voi peruuttaa."
              confirmLabel="Poista jakso"
              cancelLabel="Peruuta"
              variant="danger"
              onConfirm={() => {
                deleteEpisode(fullEpisode.id, {
                  onSuccess: () => navigate("/"),
                });
              }}
            />
          </>
        )}

        <PageBody>
          <Breadcrumb
            className="mb-4"
            items={[
              { label: "Jaksot", to: basePath === "/" ? "/" : basePath },
              { label: fullEpisode.title },
            ]}
          />

          <Tabs value={activeTab} onValueChange={(tab) => navigate(tabPath(tab))} className="mb-8">
            <TabsList>
              <TabsTrigger value="tiedot">Tiedot</TabsTrigger>
              <TabsTrigger value="kertaus">Kertaus</TabsTrigger>
            </TabsList>

            <TabsContent value="tiedot" className="pt-8">
              <div className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8">
                <div ref={articleRef} className="space-y-6">
                  <HeadingLevelProvider>
                    {fullEpisode.content && (
                      <MarkdownRenderer headingIdPrefix={`episode-${fullEpisode.id}`}>
                        {fullEpisode.content}
                      </MarkdownRenderer>
                    )}
                  </HeadingLevelProvider>
                </div>

                <div className="space-y-8 pt-6">
                  {fullEpisode.image && (
                    <ImageElement
                      src={fullEpisode.image}
                      sizes="(max-width: 1024px) 100vw, 24rem"
                      alt={fullEpisode.imageAlt || fullEpisode.title}
                      variant="outline"
                    />
                  )}

                  <div className="space-y-4">
                    <Card variant="outline" className="gap-2">
                      <CardHeader>
                        <CardTitle>Tiedot</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HeadingLevelProvider>
                          {episodePlayers && episodePlayers.length > 0 && (
                            <div className="mb-4">
                              <Heading>Pelaajat</Heading>
                              <List variant="unbulleted">
                                {episodePlayers.map((ep) => (
                                  <ListItem key={ep.id}>{ep.username ?? "—"}</ListItem>
                                ))}
                              </List>
                            </div>
                          )}
                          {sessions && sessions.length > 0 && (
                            <div className="mb-4">
                              <Heading>Sessiot</Heading>
                              <List variant="unbulleted">
                                {sessions.map((s) => {
                                  const formatted = s.date
                                    ? new Date(s.date).toLocaleDateString("fi-FI")
                                    : "—";
                                  return (
                                    <ListItem key={s.id}>
                                      #{String(s.sessionNumber).padStart(2, "0")}{" "}
                                      {s.label ? `${s.label} ` : ""}
                                      {formatted}
                                    </ListItem>
                                  );
                                })}
                              </List>
                            </div>
                          )}
                          {fullEpisode.location && (
                            <>
                              <Heading>Sijainti</Heading>
                              <Link href={fullEpisode.locationLink || "#"}>
                                {fullEpisode.location}
                              </Link>
                            </>
                          )}
                        </HeadingLevelProvider>
                      </CardContent>
                    </Card>
                  </div>

                  {fullEpisode.mechanicalAdditions && (
                    <div className="space-y-4">
                      <Card iconName="zap">
                        <CardHeader>
                          <CardTitle>Mekaaniset Lisäykset</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 tablet:pt-0">
                          <MarkdownRenderer>{fullEpisode.mechanicalAdditions}</MarkdownRenderer>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="kertaus" className="pt-8">
              <div ref={recapRef} className="max-w-3xl mx-auto">
                <EpisodeRecapTab
                  episode={fullEpisode}
                  sessions={sessions}
                  isLoading={isSessionsLoading}
                />
              </div>
            </TabsContent>
          </Tabs>
        </PageBody>
      </HeadingLevelProvider>
    </div>
  );
}
