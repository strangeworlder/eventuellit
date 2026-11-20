import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ConfirmDialog,
  EmptyState,
  Heading,
  HeadingLevelProvider,
  Icon,
  Input,
  LoadingState,
  MarkdownRenderer,
  NoticePanel,
  requestToast,
  Select,
  Stack,
  Text,
  TextArea,
  ToggleButton,
  ToolButton,
} from "@repo/ui";
import { useMemo, useState } from "react";
import {
  type CharacterPrivateNote,
  useCreatePrivateNote,
  useDeletePrivateNote,
  useUpdatePrivateNote,
} from "./api/private-notes";

export interface CharacterEpisodeOption {
  id: number;
  title: string;
}

export interface CharacterPrivateNotesTabProps {
  characterId: number;
  isOwner: boolean;
  episodes: CharacterEpisodeOption[];
  notes: CharacterPrivateNote[] | undefined;
  isLoading: boolean;
  isError: boolean;
}

function formatNoteTimestamp(createdAtIso: string, updatedAtIso: string): string {
  const created = new Date(createdAtIso);
  const updated = new Date(updatedAtIso);
  if (Number.isNaN(created.getTime())) return "";

  const createdLabel = created.toLocaleDateString("fi-FI", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  if (
    !Number.isNaN(updated.getTime()) &&
    Math.abs(updated.getTime() - created.getTime()) > 60_000
  ) {
    const updatedLabel = updated.toLocaleDateString("fi-FI", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    return createdLabel === updatedLabel
      ? `${createdLabel} (muokattu)`
      : `${createdLabel} · muokattu ${updatedLabel}`;
  }

  return createdLabel;
}

interface PrivateNoteCardProps {
  characterId: number;
  note: CharacterPrivateNote;
  isOwner: boolean;
  episodeOptions: Array<{ value: string; label: string }>;
  hasEpisodes: boolean;
}

function PrivateNoteCard({
  characterId,
  note,
  isOwner,
  episodeOptions,
  hasEpisodes,
}: PrivateNoteCardProps) {
  const updateMutation = useUpdatePrivateNote(characterId);
  const deleteMutation = useDeletePrivateNote(characterId);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title ?? "");
  const [editContent, setEditContent] = useState(note.content);
  const [editEpisodeId, setEditEpisodeId] = useState(
    note.episodeId !== null ? String(note.episodeId) : "",
  );
  const [editIsPinned, setEditIsPinned] = useState(note.isPinned);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleStartEdit = () => {
    setEditTitle(note.title ?? "");
    setEditContent(note.content);
    setEditEpisodeId(note.episodeId !== null ? String(note.episodeId) : "");
    setEditIsPinned(note.isPinned);
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    const trimmedContent = editContent.trim();
    if (!trimmedContent) return;

    updateMutation.mutate(
      {
        noteId: note.id,
        title: editTitle.trim() ? editTitle.trim() : null,
        content: trimmedContent,
        episodeId: editEpisodeId ? Number(editEpisodeId) : null,
        isPinned: editIsPinned,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          requestToast({ message: "Muistiinpano tallennettu.", variant: "success" });
        },
        onError: (err) => {
          requestToast({
            message: err instanceof Error ? err.message : "Tallennus epäonnistui.",
            variant: "error",
          });
        },
      },
    );
  };

  const handleTogglePin = () => {
    updateMutation.mutate(
      {
        noteId: note.id,
        isPinned: !note.isPinned,
      },
      {
        onError: (err) => {
          requestToast({
            message: err instanceof Error ? err.message : "Kiinnityksen päivitys epäonnistui.",
            variant: "error",
          });
        },
      },
    );
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(note.id, {
      onSuccess: () => {
        setConfirmDeleteOpen(false);
        setIsEditing(false);
        requestToast({ message: "Muistiinpano poistettu.", variant: "info" });
      },
      onError: (err) => {
        requestToast({
          message: err instanceof Error ? err.message : "Poisto epäonnistui.",
          variant: "error",
        });
      },
    });
  };

  if (isOwner && isEditing) {
    return (
      <Card variant="highlight">
        <CardHeader>
          <CardTitle>Muokkaa muistiinpanoa</CardTitle>
        </CardHeader>
        <CardContent>
          <Stack gap={4}>
            <Input
              label="Otsikko (valinnainen)"
              placeholder="Esim. Kontaktit, epäilykset tai koodit..."
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            {hasEpisodes && (
              <Select
                label="Liitä jaksoon (valinnainen)"
                value={editEpisodeId}
                onChange={(e) => setEditEpisodeId(e.target.value)}
                options={episodeOptions}
              />
            )}
            <Stack direction="row" align="center" gap={2}>
              <ToggleButton pressed={editIsPinned} onClick={() => setEditIsPinned((p) => !p)}>
                <Icon name="book-marked" size={14} className="mr-1.5" />
                {editIsPinned ? "Kiinnitetty ylös" : "Kiinnitä ylös"}
              </ToggleButton>
            </Stack>
            <TextArea
              label="Sisältö (Markdown tuettu)"
              rows={6}
              placeholder="Kirjoita muistiinpano..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            <Stack direction="row" justify="between" align="center" gap={3} wrap>
              <Stack direction="row" gap={3} wrap>
                <Button
                  onClick={handleSaveEdit}
                  loading={updateMutation.isPending}
                  loadingMessage="Tallennetaan..."
                  disabled={!editContent.trim() || deleteMutation.isPending}
                >
                  Tallenna
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                  disabled={updateMutation.isPending || deleteMutation.isPending}
                >
                  Peruuta
                </Button>
              </Stack>
              <Button
                variant="danger"
                onClick={() => setConfirmDeleteOpen(true)}
                loading={deleteMutation.isPending}
                loadingMessage="Poistetaan..."
                disabled={updateMutation.isPending}
              >
                Poista
              </Button>
            </Stack>
          </Stack>
          <ConfirmDialog
            open={confirmDeleteOpen}
            onOpenChange={setConfirmDeleteOpen}
            title="Poista yksityinen muistiinpano?"
            description="Muistiinpano poistetaan pysyvästi. Tätä toimintoa ei voi peruuttaa."
            confirmLabel="Poista muistiinpano"
            cancelLabel="Peruuta"
            variant="danger"
            onConfirm={handleConfirmDelete}
          />
        </CardContent>
      </Card>
    );
  }

  const timestampLabel = formatNoteTimestamp(note.createdAt, note.updatedAt);

  return (
    <Card variant={note.isPinned ? "callout" : "outline"}>
      <CardHeader>
        <Stack direction="row" justify="between" align="start" gap={3} wrap>
          <Stack gap={1}>
            <Stack direction="row" align="center" gap={2} wrap>
              <CardTitle>{note.title?.trim() || "Muistiinpano"}</CardTitle>
              {note.isPinned && (
                <Badge variant="outline" icon="book-marked">
                  Kiinnitetty
                </Badge>
              )}
              {note.episodeTitle && <Badge variant="ghost">{note.episodeTitle}</Badge>}
            </Stack>
            {timestampLabel && <Text variant="timestamp">{timestampLabel}</Text>}
          </Stack>
          {isOwner && (
            <Stack direction="row" align="center" gap={2} wrap>
              <ToolButton
                onClick={handleTogglePin}
                loading={updateMutation.isPending}
                loadingMessage="Päivitetään..."
              >
                {note.isPinned ? "Irrota kiinnitys" : "Kiinnitä"}
              </ToolButton>
              <ToolButton onClick={handleStartEdit}>Muokkaa</ToolButton>
            </Stack>
          )}
        </Stack>
      </CardHeader>
      <CardContent variant="rule">
        <MarkdownRenderer>{note.content}</MarkdownRenderer>
      </CardContent>
    </Card>
  );
}

export function CharacterPrivateNotesTab({
  characterId,
  isOwner,
  episodes,
  notes,
  isLoading,
  isError,
}: CharacterPrivateNotesTabProps) {
  const createMutation = useCreatePrivateNote(characterId);

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newEpisodeId, setNewEpisodeId] = useState("");
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [episodeFilter, setEpisodeFilter] = useState<string>("all");

  const episodeSelectOptions = useMemo(
    () => [
      { value: "", label: "Yleinen (ei jaksoa)" },
      ...episodes.map((ep) => ({ value: String(ep.id), label: ep.title })),
    ],
    [episodes],
  );

  const filterEpisodes = useMemo(() => {
    const map = new Map<number, string>();
    for (const ep of episodes) {
      map.set(ep.id, ep.title);
    }
    for (const note of notes ?? []) {
      if (note.episodeId !== null && note.episodeTitle && !map.has(note.episodeId)) {
        map.set(note.episodeId, note.episodeTitle);
      }
    }
    return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
  }, [episodes, notes]);

  const filteredNotes = useMemo(() => {
    const allNotes = notes ?? [];
    if (episodeFilter === "all") return allNotes;
    if (episodeFilter === "general") return allNotes.filter((n) => n.episodeId === null);
    const targetEpisodeId = Number(episodeFilter);
    return allNotes.filter((n) => n.episodeId === targetEpisodeId);
  }, [notes, episodeFilter]);

  const handleResetCreate = () => {
    setNewTitle("");
    setNewContent("");
    setNewEpisodeId("");
    setNewIsPinned(false);
    setIsCreating(false);
  };

  const handleCreate = () => {
    const trimmed = newContent.trim();
    if (!trimmed) return;

    createMutation.mutate(
      {
        title: newTitle.trim() ? newTitle.trim() : null,
        content: trimmed,
        episodeId: newEpisodeId ? Number(newEpisodeId) : null,
        isPinned: newIsPinned,
      },
      {
        onSuccess: () => {
          handleResetCreate();
          requestToast({ message: "Yksityinen muistiinpano lisätty.", variant: "success" });
        },
        onError: (err) => {
          requestToast({
            message: err instanceof Error ? err.message : "Muistiinpanon tallennus epäonnistui.",
            variant: "error",
          });
        },
      },
    );
  };

  const totalCount = notes?.length ?? 0;
  const showFilterRow = totalCount > 0 && filterEpisodes.length > 0;

  return (
    <HeadingLevelProvider>
      <Stack gap={6} className="pt-4">
        <NoticePanel variant="info" title={isOwner ? "Yksityisyys" : "Pelinjohtajan lukunäkymä"}>
          <Text variant="small">
            {isOwner
              ? "Yksityiset muistiinpanot näkyvät vain sinulle ja pelinjohtajalle. Muut pelaajat eivät näe niitä."
              : "Näet pelaajan yksityiset muistiinpanot pelinjohtajana. Vain hahmon omistaja voi luoda, muokata ja poistaa merkintöjä."}
          </Text>
        </NoticePanel>

        <Stack direction="row" justify="between" align="center" gap={3} wrap>
          <Heading>Lokimerkinnät</Heading>
          {isOwner && !isCreating && (
            <Button onClick={() => setIsCreating(true)}>
              <Icon name="plus" size={16} />
              Uusi muistiinpano
            </Button>
          )}
        </Stack>

        {isOwner && isCreating && (
          <Card variant="highlight">
            <CardHeader>
              <CardTitle>Uusi yksityinen muistiinpano</CardTitle>
            </CardHeader>
            <CardContent>
              <Stack gap={4}>
                <Input
                  label="Otsikko (valinnainen)"
                  placeholder="Esim. Kontaktit, epäilykset tai koodit..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                {episodes.length > 0 && (
                  <Select
                    label="Liitä jaksoon (valinnainen)"
                    value={newEpisodeId}
                    onChange={(e) => setNewEpisodeId(e.target.value)}
                    options={episodeSelectOptions}
                  />
                )}
                <Stack direction="row" align="center" gap={2}>
                  <ToggleButton pressed={newIsPinned} onClick={() => setNewIsPinned((p) => !p)}>
                    <Icon name="book-marked" size={14} className="mr-1.5" />
                    {newIsPinned ? "Kiinnitetty ylös" : "Kiinnitä ylös"}
                  </ToggleButton>
                </Stack>
                <TextArea
                  label="Sisältö (Markdown tuettu)"
                  rows={6}
                  placeholder="Kirjoita johtolankoja, kontakteja tai hahmosi omia ajatuksia..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
                <Stack direction="row" gap={3} wrap>
                  <Button
                    onClick={handleCreate}
                    loading={createMutation.isPending}
                    loadingMessage="Tallennetaan..."
                    disabled={!newContent.trim()}
                  >
                    Tallenna muistiinpano
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleResetCreate}
                    disabled={createMutation.isPending}
                  >
                    Peruuta
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        )}

        {showFilterRow && (
          <Stack direction="row" align="center" gap={2} wrap>
            <ToggleButton pressed={episodeFilter === "all"} onClick={() => setEpisodeFilter("all")}>
              {`Kaikki (${totalCount})`}
            </ToggleButton>
            <ToggleButton
              pressed={episodeFilter === "general"}
              onClick={() => setEpisodeFilter("general")}
            >
              Yleiset
            </ToggleButton>
            {filterEpisodes.map((ep) => (
              <ToggleButton
                key={ep.id}
                pressed={episodeFilter === String(ep.id)}
                onClick={() => setEpisodeFilter(String(ep.id))}
              >
                {ep.title}
              </ToggleButton>
            ))}
          </Stack>
        )}

        {isLoading ? (
          <LoadingState message="Ladataan yksityisiä muistiinpanoja..." />
        ) : isError ? (
          <NoticePanel variant="error" title="Virhe">
            <Text variant="small">Yksityisten muistiinpanojen lataaminen epäonnistui.</Text>
          </NoticePanel>
        ) : totalCount === 0 ? (
          !isCreating ? (
            <EmptyState
              title="Ei yksityisiä muistiinpanoja"
              description={
                isOwner
                  ? "Kirjaa ylös johtolankoja, kontakteja tai hahmosi omia ajatuksia."
                  : "Pelaaja ei ole vielä kirjannut yksityisiä muistiinpanoja."
              }
              action={
                isOwner ? (
                  <Button onClick={() => setIsCreating(true)}>
                    <Icon name="plus" size={16} />
                    Kirjoita ensimmäinen muistiinpano
                  </Button>
                ) : undefined
              }
            />
          ) : null
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            title="Ei suodatinta vastaavia muistiinpanoja"
            description="Valitse toinen suodatin nähdäksesi muut merkinnät."
            action={
              <Button variant="outline" onClick={() => setEpisodeFilter("all")}>
                Näytä kaikki
              </Button>
            }
          />
        ) : (
          <HeadingLevelProvider>
            <Stack gap={4}>
              {filteredNotes.map((note) => (
                <PrivateNoteCard
                  key={note.id}
                  characterId={characterId}
                  note={note}
                  isOwner={isOwner}
                  episodeOptions={episodeSelectOptions}
                  hasEpisodes={episodes.length > 0}
                />
              ))}
            </Stack>
          </HeadingLevelProvider>
        )}
      </Stack>
    </HeadingLevelProvider>
  );
}
