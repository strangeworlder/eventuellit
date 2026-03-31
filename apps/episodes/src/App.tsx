import { SkillTagList } from "@repo/ui/components/SkillTagList";
import { useArticleScrollProgress } from "@repo/ui/components/useArticleScrollProgress";
import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Drawer } from "@repo/ui/components/Drawer";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page, PageBody } from "@repo/ui/components/Page";
import { TopNav, TopNavLink, TopNavList } from "@repo/ui/components/TopNav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/Tabs";
import { Input } from "@repo/ui/components/Input";
import { Select } from "@repo/ui/components/Select";
import { TextArea } from "@repo/ui/components/TextArea";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Text } from "@repo/ui/components/Text";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { MfeNotFoundRedirect } from "@repo/ui/components/MfeNotFoundRedirect";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  type Episode,
  useCreateEpisode,
  useCreateEpisodeSkill,
  useDeleteEpisode,
  useDeleteEpisodeSkill,
  useEpisode,
  useEpisodes,
  useEpisodeSkills,
  useUpdateEpisode,
  useUpdateEpisodeSkill,
} from "./api/episodes";
import { ReadingListEditor } from "./ReadingListEditor";
import { useDisenrollPlayer, useEnrollPlayer, useEpisodePlayers } from "./api/episode-players";
import { useEpisodeInvites, useSendInvite } from "./api/episode-invites";
import { usePlayerUsers } from "./api/users";
import { useSessions } from "./api/sessions";
import { TyrannyRollBadge } from "./components/TyrannyRollBadge";
import { EpisodeRecapTab } from "./components/EpisodeRecapTab";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function EpisodeEditForm({
  episode,
  onCancel,
  onSave,
}: {
  episode?: Episode;
  onCancel: () => void;
  onSave: (data: Partial<Episode>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Episode>>(
    episode || {
      title: "",
      slug: "",
      order: 99,
      status: "planned",
      description: "",
      content: "",
      players: "",
      sessionDates: "",
      location: "",
      locationLink: "",
      image: "",
      imageAlt: "",
      mechanicalAdditions: "",
      summary: "",
    },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === "order" ? parseInt(value) || 0 : value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{episode ? "Muokkaa Jaksoa" : "Uusi Jakso"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Otsikko"
            name="title"
            value={formData.title ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Slug (URL)"
            name="slug"
            value={formData.slug ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Järjestys"
            type="number"
            name="order"
            value={formData.order?.toString() ?? "99"}
            onChange={handleChange}
          />

          <Select
            label="Tila"
            name="status"
            value={formData.status ?? "planned"}
            onChange={handleChange}
            options={[
              { value: "active", label: "Aktiivinen" },
              { value: "completed", label: "Arkistoitu" },
              { value: "planned", label: "Tulossa" },
            ]}
          />
        </div>

        <Input
          label="Lyhyt Kuvaus"
          name="description"
          value={formData.description ?? ""}
          onChange={handleChange}
        />

        <TextArea
          label="Sisältö (Markdown)"
          name="content"
          variant="monospace"
          className="h-64"
          value={formData.content ?? ""}
          onChange={handleChange}
        />

        <TextArea
          label="Mekaaniset Lisäykset (Markdown)"
          name="mechanicalAdditions"
          variant="monospace"
          className="h-32"
          value={formData.mechanicalAdditions ?? ""}
          onChange={handleChange}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Pelaajat"
            name="players"
            value={formData.players ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Sessiot"
            name="sessionDates"
            value={formData.sessionDates ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Sijainti"
            name="location"
            value={formData.location ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Sijainti (Linkki)"
            name="locationLink"
            value={formData.locationLink ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Kuva (URL)"
            name="image"
            value={formData.image ?? ""}
            onChange={handleChange}
          />
          <Input
            label="Kuva (Alt)"
            name="imageAlt"
            value={formData.imageAlt ?? ""}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>
            Peruuta
          </Button>
          <Button
            onClick={() => {
              const { id, gmId, createdAt, updatedAt, ...editableData } = formData as Episode;
              onSave(editableData);
            }}
          >
            Tallenna
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EpisodePlayersEditor({ episodeId }: { episodeId: number }) {
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

function EpisodeSkillsEditor({ episodeId }: { episodeId: number }) {
  const { data: skills, isLoading } = useEpisodeSkills(episodeId);
  const { mutate: addSkill } = useCreateEpisodeSkill();
  const { mutate: removeSkill } = useDeleteEpisodeSkill();
  const { mutate: updateSkill } = useUpdateEpisodeSkill();

  if (isLoading) return <LoadingState message="Ladataan taitoja..." />;

  return (
    <div className="space-y-3">
      <Heading>Jakson Taidot</Heading>
      <SkillTagList
        items={(skills ?? []).map((s) => ({ id: s.id, name: s.name }))}
        onItemEdit={(id, name) => updateSkill({ episodeId, skillId: id as number, name })}
        onItemRemove={(id) => removeSkill({ episodeId, skillId: id as number })}
        onItemAdd={(name) => addSkill({ episodeId, name })}
      />
    </div>
  );
}

function GmToolsPanel({
  episode,
  onEdit,
  onDelete,
  onCreateNew,
}: {
  episode: Episode;
  onEdit: () => void;
  onDelete: () => void;
  onCreateNew: () => void;
}) {
  return (
    <Drawer title="Pelinjohtajan Työkalut">
      <div className="space-y-3">
        <Heading>Toiminnot</Heading>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="compact" onClick={onEdit}>
            Muokkaa Jaksoa
          </Button>
          <br />
          <Button variant="danger" size="compact" onClick={onDelete}>
            Poista Jakso
          </Button>
          <br />
          <Button size="compact" onClick={onCreateNew}>
            Luo Uusi Jakso
          </Button>
        </div>
      </div>
      <div className="space-y-3">
        <EpisodeSkillsEditor episodeId={episode.id} />
      </div>
      <div className="space-y-3">
        <EpisodePlayersEditor episodeId={episode.id} />
      </div>
      <div className="space-y-3">
        <ReadingListEditor episodeId={episode.id} />
      </div>
    </Drawer>
  );
}

function EpisodeDetails({
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
  const { data: fullEpisode, isLoading: isEpisodeLoading } = useEpisode(episode?.id as number);
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode } = useUpdateEpisode();
  const { mutate: deleteEpisode } = useDeleteEpisode();
  const { data: sessions, isLoading: isSessionsLoading } = useSessions(episode?.id ?? 0);
  const { data: episodePlayers } = useEpisodePlayers(episode?.id ?? 0);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const articleRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [deleteEpisodeOpen, setDeleteEpisodeOpen] = useState(false);

  useArticleScrollProgress({
    articleRef,
    source: "episodes",
    route: pathname,
  });

  const activeTab = pathname.endsWith("/kertaus") ? "kertaus" : "tiedot";

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

          <Tabs
            value={activeTab}
            onValueChange={(tab) => navigate(tabPath(tab))}
            className="mb-8"
          >
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
              <EpisodeRecapTab
                episode={fullEpisode}
                sessions={sessions}
                isLoading={isSessionsLoading}
              />
            </TabsContent>
          </Tabs>
        </PageBody>
      </HeadingLevelProvider>
    </div>
  );
}

function EpisodesIndex({ episodes, basePath }: { episodes: Episode[]; basePath: string }) {
  return (
    <>
      <HeadingLevelProvider>
        <Hero title="Jaksot" description="Kampanjan jaksot — aktiiviset, arkistoidut ja tulevat." />
      </HeadingLevelProvider>
      <PageBody>
        <Breadcrumb className="mb-6" items={[{ label: "Jaksot" }]} />
        <HeadingLevelProvider>
          <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-4">
            {episodes.map((episode) => (
              <a
                key={episode.id}
                href={basePath === "/" ? `/${episode.slug}` : `${basePath}/${episode.slug}`}
                className="no-underline text-inherit"
              >
                <Card variant="interactive" className="h-full cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle>{episode.title}</CardTitle>
                      <span className="text-xs font-mono shrink-0 mt-0.5">
                        #{String(episode.order).padStart(2, "0")}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {episode.description && (
                      <Text className="text-sm mb-2">{episode.description}</Text>
                    )}
                    <div className="flex gap-2">
                      {episode.status === "active" && (
                        <Badge variant="solid" icon="sparkles">
                          Aktiivinen
                        </Badge>
                      )}
                      {episode.status === "completed" && (
                        <Badge variant="outline">Arkistoitu</Badge>
                      )}
                      {episode.status === "planned" && <Badge variant="outline">Tulossa</Badge>}
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </HeadingLevelProvider>
      </PageBody>
    </>
  );
}

function EpisodeWrapper() {
  const { pathname } = useLocation();
  const { data: episodes, isLoading } = useEpisodes();
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: createEpisode } = useCreateEpisode();

  const [isCreating, setIsCreating] = useState(false);

  if (isLoading) {
    return (
      <Page>
        <LoadingState message="Ladataan jaksoja..." />
      </Page>
    );
  }

  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    if (episodes?.some((p) => p.slug === segments[0])) return "/";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  const navEpisodes = (episodes ?? []).filter(
    (e) => e.status === "active" || e.status === "planned",
  );

  const activeEpisode = (episodes ?? []).find((e) => e.status === "active") ?? episodes?.[0];
  const latestPath = activeEpisode
    ? basePath === "/"
      ? `/${activeEpisode.slug}`
      : `${basePath}/${activeEpisode.slug}`
    : basePath === "/"
      ? "/"
      : basePath;

  const listingPath = basePath === "/" ? "/" : basePath;

  return (
    <Page>
      {isCreating && isGm ? (
        <EpisodeEditForm
          onCancel={() => setIsCreating(false)}
          onSave={(data) => {
            createEpisode(data, {
              onSuccess: () => setIsCreating(false),
            });
          }}
        />
      ) : (
        <>
          {episodes && episodes.length > 0 && (
            <TopNav>
              <TopNavList>
                <TopNavLink variant="parent" to={listingPath}>
                  Jaksot
                </TopNavLink>
                {navEpisodes.map((episode) => (
                  <TopNavLink
                    key={episode.id}
                    to={basePath === "/" ? `/${episode.slug}` : `${basePath}/${episode.slug}`}
                  >
                    #{episode.order}: {episode.title}
                  </TopNavLink>
                ))}
              </TopNavList>

              <div>
                <Routes>
                  <Route
                    path="/"
                    element={<EpisodesIndex episodes={episodes} basePath={basePath} />}
                  />
                  <Route path="latest" element={<Navigate to={latestPath} replace />} />
                  {episodes.map((episode) => (
                    <Route
                      key={episode.id}
                      path={`${episode.slug}/*`}
                      element={
                        <EpisodeDetails
                          id={episode.slug}
                          onCreateNew={() => setIsCreating(true)}
                          basePath={basePath}
                        />
                      }
                    />
                  ))}
                  <Route path="*" element={<MfeNotFoundRedirect to={listingPath} />} />
                </Routes>
              </div>
            </TopNav>
          )}

          {episodes && episodes.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[50vh]">
              <Text variant="muted">Ei jaksoja löydetty.</Text>
              {isGm && <Button onClick={() => setIsCreating(true)}>Luo ensimmäinen jakso</Button>}
            </div>
          )}
        </>
      )}
    </Page>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EpisodeWrapper />
    </QueryClientProvider>
  );
}
