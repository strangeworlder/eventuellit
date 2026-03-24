import {
  mapSectionOffsetsToProgressPositions,
  resolveActiveSectionFromProgress,
} from "@repo/ui/components/article-navigation-utils";
import {
  ARTICLE_JUMP_EVENT,
  ARTICLE_PROGRESS_EVENT,
  type ArticleJumpPayload,
  type ArticleProgressPayload,
} from "@repo/ui/components/article-progress-events";
import { useAuth } from "@repo/auth/use-auth";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { Link } from "@repo/ui/components/Link";
import { List, ListItem } from "@repo/ui/components/List";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Page, PageBody } from "@repo/ui/components/Page";
import { Tabs, TabsLink, TabsList } from "@repo/ui/components/Tabs";
import { Input } from "@repo/ui/components/Input";
import { Select } from "@repo/ui/components/Select";
import { TextArea } from "@repo/ui/components/TextArea";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

function EpisodeEditForm({ episode, onCancel, onSave }: { episode?: Episode; onCancel: () => void; onSave: (data: Partial<Episode>) => void }) {
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
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
          <Input label="Otsikko" name="title" value={formData.title ?? ""} onChange={handleChange} />
          <Input label="Slug (URL)" name="slug" value={formData.slug ?? ""} onChange={handleChange} />
          <Input label="Järjestys" type="number" name="order" value={formData.order?.toString() ?? "99"} onChange={handleChange} />

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

        <Input label="Lyhyt Kuvaus" name="description" value={formData.description ?? ""} onChange={handleChange} />

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
          <Input label="Pelaajat" name="players" value={formData.players ?? ""} onChange={handleChange} />
          <Input label="Sessiot" name="sessionDates" value={formData.sessionDates ?? ""} onChange={handleChange} />
          <Input label="Sijainti" name="location" value={formData.location ?? ""} onChange={handleChange} />
          <Input label="Sijainti (Linkki)" name="locationLink" value={formData.locationLink ?? ""} onChange={handleChange} />
          <Input label="Kuva (URL)" name="image" value={formData.image ?? ""} onChange={handleChange} />
          <Input label="Kuva (Alt)" name="imageAlt" value={formData.imageAlt ?? ""} onChange={handleChange} />
        </div>

        <div className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onCancel}>Peruuta</Button>
          <Button onClick={() => {
            const { id, gmId, createdAt, updatedAt, ...editableData } = formData as Episode;
            onSave(editableData);
          }}>Tallenna</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EpisodeSkillsEditor({ episodeId }: { episodeId: number }) {
  const { data: skills, isLoading } = useEpisodeSkills(episodeId);
  const { mutate: addSkill } = useCreateEpisodeSkill();
  const { mutate: removeSkill } = useDeleteEpisodeSkill();
  const { mutate: updateSkill } = useUpdateEpisodeSkill();

  const [newSkillName, setNewSkillName] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);
  const [editingSkillName, setEditingSkillName] = useState("");

  if (isLoading) return <LoadingState message="Ladataan taitoja..." />;

  const handleAdd = () => {
    if (!newSkillName.trim()) return;
    addSkill({ episodeId, name: newSkillName.trim() }, {
      onSuccess: () => setNewSkillName("")
    });
  };

  const handleUpdate = (skillId: number) => {
    if (!editingSkillName.trim()) return;
    updateSkill({ episodeId, skillId, name: editingSkillName.trim() }, {
      onSuccess: () => {
        setEditingSkillId(null);
        setEditingSkillName("");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hallitse Taitoja (GM)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {skills && skills.length > 0 ? (
          <List variant="unbulleted">
            {skills.map((skill) => (
              <ListItem key={skill.id} className="flex justify-between items-center group">
                {editingSkillId === skill.id ? (
                  <div className="flex gap-2 w-full">
                    <Input value={editingSkillName} onChange={(e) => setEditingSkillName(e.target.value)} />
                    <Button variant="solid" onClick={() => handleUpdate(skill.id)}>Save</Button>
                    <Button variant="outline" onClick={() => setEditingSkillId(null)}>Cancel</Button>
                  </div>
                ) : (
                  <>
                    <span>{skill.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => {
                        setEditingSkillId(skill.id);
                        setEditingSkillName(skill.name);
                      }}>Edit</Button>
                      <Button size="sm" variant="danger" onClick={() => removeSkill({ episodeId, skillId: skill.id })}>✖</Button>
                    </div>
                  </>
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <p className="text-sm text-secondary">Ei taitoja määritetty.</p>
        )}

        <div className="flex gap-2 items-end pt-4 border-t">
          <Input
            label="Uusi taito"
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd}>Lisää</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EpisodeDetails({ id }: { id: string }) {
  const { data: episodes, isLoading: isEpisodesLoading } = useEpisodes();
  const episode = episodes?.find((e) => e.slug === id);
  const { data: fullEpisode, isLoading: isEpisodeLoading } = useEpisode(episode?.id as number);
  const { user } = useAuth();
  const isGm = user?.role === "gm";
  const { mutate: updateEpisode } = useUpdateEpisode();
  const { mutate: deleteEpisode } = useDeleteEpisode();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const articleRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const scrollRoot = document.getElementById("app-scroll-root");
    if (!scrollRoot) {
      return;
    }

    const getOffsetWithinScrollRoot = (element: HTMLElement) => {
      const elementRect = element.getBoundingClientRect();
      const rootRect = scrollRoot.getBoundingClientRect();
      return elementRect.top - rootRect.top + scrollRoot.scrollTop;
    };

    const dispatchProgress = (payload: ArticleProgressPayload) => {
      window.dispatchEvent(
        new CustomEvent<ArticleProgressPayload>(ARTICLE_PROGRESS_EVENT, { detail: payload }),
      );
    };

    const updateScrollState = () => {
      const scrollY = scrollRoot.scrollTop;
      const maxScroll = Math.max(scrollRoot.scrollHeight - scrollRoot.clientHeight, 1);
      const headingElements = Array.from(
        articleRef.current?.querySelectorAll<HTMLElement>("h3[id]") ?? [],
      );
      const renderedSections = headingElements.map((heading) => ({
        id: heading.id,
        label: heading.textContent?.trim() ?? heading.id,
      }));

      const sectionOffsets = headingElements.map((heading) => ({
        id: heading.id,
        top: getOffsetWithinScrollRoot(heading),
      }));

      const nextProgress = Math.min(100, Math.max(0, (scrollY / maxScroll) * 100));
      const nextMarkerPositions = mapSectionOffsetsToProgressPositions(
        sectionOffsets,
        0,
        scrollRoot.scrollHeight,
      );
      const nextActiveSectionId = resolveActiveSectionFromProgress(
        nextProgress,
        renderedSections.map((s) => s.id),
        nextMarkerPositions,
      );

      dispatchProgress({
        source: "episodes",
        route: pathname,
        sections: renderedSections,
        progress: nextProgress,
        activeSectionId: nextActiveSectionId,
        markerPositions: nextMarkerPositions,
      });
    };

    const onJumpRequested = (event: Event) => {
      const customEvent = event as CustomEvent<ArticleJumpPayload>;
      const payload = customEvent.detail;
      if (!payload || payload.source !== "episodes") {
        return;
      }

      const element = document.getElementById(payload.sectionId);
      if (element) {
        const targetTop = Math.max(getOffsetWithinScrollRoot(element) - 96, 0);
        scrollRoot.scrollTo({ top: targetTop, behavior: "smooth" });
      }
    };

    updateScrollState();
    scrollRoot.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    window.addEventListener(ARTICLE_JUMP_EVENT, onJumpRequested as EventListener);

    return () => {
      scrollRoot.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      window.removeEventListener(ARTICLE_JUMP_EVENT, onJumpRequested as EventListener);
    };
  }, [pathname]);

  if (isEpisodesLoading || isEpisodeLoading) return <LoadingState message="Ladataan jaksoa..." />;
  if (!episode || !fullEpisode) return <div className="p-8 text-center">Jaksoa ei löytynyt.</div>;

  if (isEditing && isGm) {
    return (
      <EpisodeEditForm
        episode={fullEpisode}
        onCancel={() => setIsEditing(false)}
        onSave={(data) => {
          updateEpisode({ ...data, id: fullEpisode.id }, {
            onSuccess: () => setIsEditing(false)
          });
        }}
      />
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <HeadingLevelProvider>
        {isGm && (
          <div className="flex gap-2 justify-end mb-4 px-4 tablet:p-0">
            <Button variant="outline" onClick={() => setIsEditing(true)}>Muokkaa Jaksoa</Button>
            <Button variant="danger" onClick={() => {
              if (window.confirm("Oletko varma että haluat poistaa jakson?")) {
                deleteEpisode(fullEpisode.id, {
                  onSuccess: () => navigate("/")
                });
              }
            }}>Poista Jakso</Button>
          </div>
        )}

        <Hero title={fullEpisode.title} description={fullEpisode.description || ""}>
          <div className="flex gap-2 mt-4">
            {fullEpisode.status === "active" && (
              <Badge variant="solid" icon="sparkles">
                Aktiivinen Jakso
              </Badge>
            )}
            {fullEpisode.status === "completed" && <Badge variant="outline">Arkistoitu</Badge>}
            {fullEpisode.status === "planned" && <Badge variant="outline">Tulossa</Badge>}
          </div>
        </Hero>

        <PageBody className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8">
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
                    {fullEpisode.players && (
                      <>
                        <Heading>Pelaajat</Heading>
                        <p>{fullEpisode.players}</p>
                      </>
                    )}
                    {fullEpisode.sessionDates && (
                      <>
                        <Heading>Sessiot</Heading>
                        <List variant="unbulleted">
                          {fullEpisode.sessionDates.split(",").map((dateStr) => {
                            const date = new Date(dateStr.trim());
                            const formattedDate = Number.isNaN(date.getTime())
                              ? dateStr.trim()
                              : date.toLocaleDateString("fi-FI");
                            return <ListItem key={dateStr.trim()}>{formattedDate}</ListItem>;
                          })}
                        </List>
                      </>
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
              <div className="desktop:col-span-1 space-y-4">
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

            {isGm && (
              <EpisodeSkillsEditor episodeId={fullEpisode.id} />
            )}
          </div>
        </PageBody>
      </HeadingLevelProvider>
    </div>
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
    return <Page><LoadingState message="Ladataan jaksoja..." /></Page>;
  }

  const getBasePath = () => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return "/";
    if (episodes?.some((p) => p.slug === segments[0])) return "/";
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();
  const defaultPath = episodes && episodes.length > 0 ? episodes[0].slug : "";

  return (
    <Page>
      {isGm && (
        <div className="mb-6 flex justify-end">
          <Button onClick={() => setIsCreating(!isCreating)}>
            {isCreating ? "Peruuta" : "Luo Uusi Jakso"}
          </Button>
        </div>
      )}

      {isCreating && isGm ? (
        <EpisodeEditForm
          onCancel={() => setIsCreating(false)}
          onSave={(data) => {
            createEpisode(data, {
              onSuccess: () => setIsCreating(false)
            });
          }}
        />
      ) : (
        <>
          {episodes && episodes.length > 0 && (
            <Tabs>
              <TabsList>
                {episodes.map((episode) => (
                  <TabsLink
                    key={episode.id}
                    to={basePath === "/" ? `/${episode.slug}` : `${basePath}/${episode.slug}`}
                  >
                    #{episode.order}: {episode.title}
                  </TabsLink>
                ))}
              </TabsList>

              <div>
                <Routes>
                  <Route path="/" element={<Navigate to={defaultPath} replace />} />
                  {episodes.map((episode) => (
                    <Route
                      key={episode.id}
                      path={episode.slug}
                      element={<EpisodeDetails id={episode.slug} />}
                    />
                  ))}
                </Routes>
              </div>
            </Tabs>
          )}

          {episodes && episodes.length === 0 && (
            <div className="flex items-center justify-center min-h-[50vh]">
              <p className="text-secondary">Ei jaksoja löydetty.</p>
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
