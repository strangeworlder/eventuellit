import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/Accordion";
import { Badge } from "@repo/ui/components/Badge";
import { Button } from "@repo/ui/components/Button";
import { DatePicker } from "@repo/ui/components/DatePicker";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Input } from "@repo/ui/components/Input";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { Select } from "@repo/ui/components/Select";
import { Text } from "@repo/ui/components/Text";
import { ConfirmDialog } from "@repo/ui/components/ConfirmDialog";
import { useState } from "react";
import {
  type ReadingItem,
  type SuggestedItem,
  useCreateReadingItem,
  useDeleteReadingItem,
  useEpisodeProgress,
  useEpisodeReadingItems,
  useReadingSuggestions,
  useUpdateReadingItem,
} from "./api/reading";
import {
  type Session,
  useCreateSession,
  useDeleteSession,
  useMigrateSessionDates,
  useSessions,
  useUpdateSession,
} from "./api/sessions";

function typeLabel(contentType: string) {
  if (contentType === "world") return "Maailma";
  if (contentType === "ruleset") return "Säännöt";
  if (contentType === "task") return "Tehtävä";
  return "Muut";
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <Text variant="kicker" className="pt-3 pb-1 border-b border-[var(--theme-border-soft)] block">
      {children}
    </Text>
  );
}

function ReadingItemRow({ item, episodeId }: { item: ReadingItem; episodeId: number }) {
  const { mutate: deleteItem, isPending: isDeleting } = useDeleteReadingItem();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateReadingItem();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(item.title);
  const [editUrl, setEditUrl] = useState(item.url ?? "");

  if (isEditing) {
    return (
      <div className="py-2 border-b border-[var(--theme-border-soft)] last:border-0 space-y-2">
        <Input label="Otsikko" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
        {item.contentType !== "task" && (
          <Input label="Linkki" value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />
        )}
        <div className="flex gap-2">
          <Button
            size="compact"
            loading={isUpdating}
            onClick={() =>
              updateItem(
                { id: item.id, episodeId, title: editTitle, url: editUrl || undefined },
                { onSuccess: () => setIsEditing(false) },
              )
            }
          >
            Tallenna
          </Button>
          <Button size="compact" variant="outline" onClick={() => setIsEditing(false)}>
            Peruuta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="gap-2 py-1.5 border-b border-[var(--theme-border-soft)] last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)] truncate">
            {item.title}
          </span>
          <Badge variant="ghost">{typeLabel(item.contentType)}</Badge>
          {item.autoSuggested && <Badge variant="highlight">Auto</Badge>}
        </div>
      </div>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button size="compact" variant="outline" onClick={() => setIsEditing(true)}>
          Muokkaa
        </Button>
        <Button
          size="compact"
          variant="danger"
          loading={isDeleting}
          onClick={() => deleteItem({ id: item.id, episodeId })}
        >
          Poista
        </Button>
      </div>
    </div>
  );
}

function AddItemForm({
  episodeId,
  sessionId,
  onAdded,
}: {
  episodeId: number;
  sessionId: number | undefined;
  onAdded: () => void;
}) {
  const { mutate: createItem, isPending } = useCreateReadingItem();
  const [contentType, setContentType] = useState<"world" | "ruleset" | "custom" | "task">("world");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!title.trim()) return;
    createItem(
      {
        episodeId,
        sessionId,
        contentType,
        title: title.trim(),
        url: contentType !== "task" ? url.trim() || undefined : undefined,
        description: description.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTitle("");
          setUrl("");
          setDescription("");
          onAdded();
        },
      },
    );
  };

  return (
    <div className="space-y-2 pt-3 border-t border-[var(--theme-border-soft)]">
      <div className="flex gap-2">
        <div className="w-28 shrink-0">
          <Select
            label="Tyyppi"
            value={contentType}
            onChange={(e) => setContentType(e.target.value as typeof contentType)}
            options={[
              { value: "world", label: "Maailma" },
              { value: "ruleset", label: "Säännöt" },
              { value: "custom", label: "Muut" },
              { value: "task", label: "Tehtävä" },
            ]}
          />
        </div>
        <div className="flex-1">
          <Input
            label="Otsikko"
            placeholder={contentType === "task" ? "Esim. Päivitä hahmolomake" : "Esim. Ekklesia"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
      </div>
      {contentType !== "task" && (
        <Input
          label="Linkki (valinnainen)"
          placeholder="/world/ekklesia"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      )}
      {contentType === "task" && (
        <Input
          label="Kuvaus (valinnainen)"
          placeholder="Lisätietoja tehtävästä"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      )}
      <div className="flex gap-2">
        <Button size="compact" loading={isPending} disabled={!title.trim()} onClick={handleAdd}>
          Lisää
        </Button>
        <Button size="compact" variant="outline" onClick={onAdded}>
          Peruuta
        </Button>
      </div>
    </div>
  );
}

function SuggestionRow({
  suggestion,
  episodeId,
  sessionId,
}: {
  suggestion: SuggestedItem;
  episodeId: number;
  sessionId: number | undefined;
}) {
  const { mutate: createItem, isPending, isSuccess } = useCreateReadingItem();

  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-[var(--theme-border-soft)] last:border-0">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)] truncate">
            {suggestion.title}
          </span>
          <Badge variant="ghost">{typeLabel(suggestion.contentType)}</Badge>
        </div>
        <p className="text-[10px] text-[var(--theme-secondary)]/70 italic truncate">
          {suggestion.reason}
        </p>
      </div>
      <Button
        size="compact"
        variant={isSuccess ? "outline" : "solid"}
        loading={isPending}
        disabled={isSuccess}
        onClick={() =>
          createItem({
            episodeId,
            sessionId,
            contentType: suggestion.contentType,
            contentRef: suggestion.contentRef,
            title: suggestion.title,
            description: suggestion.description,
            url: suggestion.url,
            autoSuggested: true,
          })
        }
      >
        {isSuccess ? "Lisätty" : "Lisää"}
      </Button>
    </div>
  );
}

function SessionStatusSelect({ session, episodeId }: { session: Session; episodeId: number }) {
  const { mutate: updateSession, isPending } = useUpdateSession();
  return (
    <Select
      label=""
      value={session.status}
      disabled={isPending}
      onChange={(e) => updateSession({ id: session.id, episodeId, status: e.target.value })}
      options={[
        { value: "planned", label: "Tulossa" },
        { value: "next", label: "Seuraava" },
        { value: "played", label: "Pelattu" },
      ]}
    />
  );
}

function AddSessionForm({
  episodeId,
  nextNumber,
  onAdded,
}: {
  episodeId: number;
  nextNumber: number;
  onAdded: () => void;
}) {
  const { mutate: createSession, isPending } = useCreateSession();
  const [date, setDate] = useState<string | undefined>(undefined);
  const [label, setLabel] = useState("");

  const handleAdd = () => {
    createSession(
      { episodeId, sessionNumber: nextNumber, date, label: label.trim() || undefined },
      { onSuccess: onAdded },
    );
  };

  return (
    <div className="space-y-2 pt-3 border-t border-[var(--theme-border-soft)]">
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Input
            label="Nimi (valinnainen)"
            placeholder={`Sessio ${nextNumber}`}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <div className="w-40 shrink-0">
          <DatePicker label="Päivämäärä" value={date} onChange={setDate} size="default" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button size="compact" loading={isPending} onClick={handleAdd}>
          Lisää sessio
        </Button>
        <Button size="compact" variant="outline" onClick={onAdded}>
          Peruuta
        </Button>
      </div>
    </div>
  );
}

function SessionPanel({ session, episodeId }: { session: Session; episodeId: number }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [deleteSessionOpen, setDeleteSessionOpen] = useState(false);
  const { mutate: deleteSession, isPending: isDeleting } = useDeleteSession();
  const { mutate: updateSession, isPending: isUpdatingDate } = useUpdateSession();
  const { data: items, isLoading } = useEpisodeReadingItems(episodeId, session.id);
  const { data: suggestions, isLoading: isSuggestionsLoading } = useReadingSuggestions(
    episodeId,
    showSuggestions,
    session.id,
  );

  const sessionDate = session.date ? new Date(session.date).toLocaleDateString("fi-FI") : null;

  return (
    <div className="space-y-1 pt-2 border-t border-[var(--theme-border-soft)]">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-text-subtle">
            #{String(session.sessionNumber).padStart(2, "0")}
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]">
            {session.label || `Sessio ${session.sessionNumber}`}
          </span>
          {sessionDate && !isEditingDate && (
            <Button
              type="button"
              variant="ghost-subtle"
              size="compact"
              onClick={() => setIsEditingDate(true)}
              className="h-auto min-h-0 py-0 px-1 text-[length:var(--font-size-2xs)] font-normal text-text-placeholder hover:text-text-muted"
            >
              {sessionDate}
            </Button>
          )}
          {isEditingDate && (
            <div className="flex items-center gap-2">
              <div className="w-36">
                <DatePicker
                  value={session.date ? session.date.split("T")[0] : undefined}
                  onChange={(iso) => {
                    updateSession(
                      { id: session.id, episodeId, date: iso },
                      { onSuccess: () => setIsEditingDate(false) },
                    );
                  }}
                  size="compact"
                  disabled={isUpdatingDate}
                />
              </div>
              <Button
                type="button"
                variant="ghost-subtle"
                size="icon"
                onClick={() => setIsEditingDate(false)}
                className="h-6 w-6 min-w-0 shrink-0"
                aria-label="Peruuta päivämäärän muokkaus"
              >
                <span className="text-text-subtle text-sm leading-none" aria-hidden>
                  ✕
                </span>
              </Button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-28">
            <SessionStatusSelect session={session} episodeId={episodeId} />
          </div>
          <Button
            size="compact"
            variant="danger"
            loading={isDeleting}
            onClick={() => setDeleteSessionOpen(true)}
          >
            Poista
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteSessionOpen}
        onOpenChange={setDeleteSessionOpen}
        title={`Poista sessio ${session.sessionNumber}?`}
        description="Sessioon liittyvät lukusuunnitelmat ja edistyminen poistetaan."
        confirmLabel="Poista sessio"
        cancelLabel="Peruuta"
        variant="danger"
        onConfirm={() => deleteSession({ id: session.id, episodeId })}
      />

      <div className="flex gap-1 pb-1">
        <Button
          size="compact"
          variant="outline"
          onClick={() => {
            setShowSuggestions((v) => !v);
            setShowAddForm(false);
          }}
        >
          {showSuggestions ? "Piilota ehdotukset" : "Hae ehdotukset"}
        </Button>
        <Button
          size="compact"
          variant="outline"
          onClick={() => {
            setShowAddForm((v) => !v);
            setShowSuggestions(false);
          }}
        >
          {showAddForm ? "Peruuta" : "Lisää kohde"}
        </Button>
      </div>

      {showSuggestions && (
        <>
          <SectionHeader>Automaattiset ehdotukset</SectionHeader>
          {isSuggestionsLoading ? (
            <LoadingState message="Haetaan..." />
          ) : !suggestions || suggestions.length === 0 ? (
            <Text variant="muted">Ei ehdotuksia.</Text>
          ) : (
            suggestions.map((s) => (
              <SuggestionRow
                key={s.contentRef}
                suggestion={s}
                episodeId={episodeId}
                sessionId={session.id}
              />
            ))
          )}
        </>
      )}

      <SectionHeader>Kohteet ({items?.length ?? 0})</SectionHeader>
      {isLoading ? (
        <LoadingState message="Ladataan..." />
      ) : !items || items.length === 0 ? (
        <Text variant="muted">Ei kohteita vielä.</Text>
      ) : (
        items.map((item) => <ReadingItemRow key={item.id} item={item} episodeId={episodeId} />)
      )}
      {showAddForm && (
        <AddItemForm
          episodeId={episodeId}
          sessionId={session.id}
          onAdded={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}

export function ReadingListEditor({ episodeId }: { episodeId: number }) {
  const { data: sessions, isLoading: isSessionsLoading } = useSessions(episodeId);
  const { mutate: migrateSessionDates, isPending: isMigrating } = useMigrateSessionDates();
  const [showAddSession, setShowAddSession] = useState(false);
  const [episodeLevelOpen, setEpisodeLevelOpen] = useState(false);
  const [showEpisodeSuggestions, setShowEpisodeSuggestions] = useState(false);
  const [showEpisodeAddForm, setShowEpisodeAddForm] = useState(false);

  const { data: episodeLevelItems, isLoading: isEpisodeItemsLoading } =
    useEpisodeReadingItems(episodeId);
  const unassignedItems = (episodeLevelItems ?? []).filter((i) => i.sessionId === null);
  const { data: episodeSuggestions, isLoading: isEpisodeSuggestionsLoading } =
    useReadingSuggestions(episodeId, showEpisodeSuggestions);

  const { data: progress, isLoading: isProgressLoading } = useEpisodeProgress(episodeId);

  const nextSessionNumber = sessions ? sessions.length + 1 : 1;

  return (
    <HeadingLevelProvider>
      <div className="space-y-1">
        <Heading>Sessiot & Valmistautuminen</Heading>

        {isSessionsLoading ? (
          <LoadingState message="Ladataan sessioita..." />
        ) : !sessions || sessions.length === 0 ? (
          <div className="space-y-2 pt-2">
            <Text variant="muted">
              Ei sessioita. Voit luoda ne automaattisesti jakson sessiopäivistä tai lisätä
              manuaalisesti.
            </Text>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="compact"
                loading={isMigrating}
                onClick={() => migrateSessionDates(episodeId)}
              >
                Luo sessiopäivistä
              </Button>
              <Button size="compact" variant="outline" onClick={() => setShowAddSession(true)}>
                Lisää sessio
              </Button>
            </div>
            {showAddSession && (
              <AddSessionForm
                episodeId={episodeId}
                nextNumber={nextSessionNumber}
                onAdded={() => setShowAddSession(false)}
              />
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <SessionPanel key={session.id} session={session} episodeId={episodeId} />
            ))}

            <div className="pt-2 border-t border-[var(--theme-border-soft)]">
              {showAddSession ? (
                <AddSessionForm
                  episodeId={episodeId}
                  nextNumber={nextSessionNumber}
                  onAdded={() => setShowAddSession(false)}
                />
              ) : (
                <Button size="compact" variant="outline" onClick={() => setShowAddSession(true)}>
                  + Lisää sessio
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Episode-level (unassigned) items */}
        <div className="pt-2">
          <AccordionItem
            variant="ghost"
            open={episodeLevelOpen}
            onOpenChange={setEpisodeLevelOpen}
          >
            <AccordionTrigger>
              <Text variant="kicker" className="border-0 pt-0 pb-0">
                Jakson yleiset kohteet ({unassignedItems.length})
              </Text>
            </AccordionTrigger>
            <AccordionContent className="space-y-1 pt-1">
              {episodeLevelOpen ? (
                <>
                  <div className="flex gap-1 pt-1">
                    <Button
                      size="compact"
                      variant="outline"
                      onClick={() => {
                        setShowEpisodeSuggestions((v) => !v);
                        setShowEpisodeAddForm(false);
                      }}
                    >
                      {showEpisodeSuggestions ? "Piilota ehdotukset" : "Hae ehdotukset"}
                    </Button>
                    <Button
                      size="compact"
                      variant="outline"
                      onClick={() => {
                        setShowEpisodeAddForm((v) => !v);
                        setShowEpisodeSuggestions(false);
                      }}
                    >
                      {showEpisodeAddForm ? "Peruuta" : "Lisää kohde"}
                    </Button>
                  </div>

                  {showEpisodeSuggestions && (
                    <>
                      <SectionHeader>Automaattiset ehdotukset</SectionHeader>
                      {isEpisodeSuggestionsLoading ? (
                        <LoadingState message="Haetaan..." />
                      ) : !episodeSuggestions || episodeSuggestions.length === 0 ? (
                        <Text variant="muted">Ei ehdotuksia.</Text>
                      ) : (
                        episodeSuggestions.map((s) => (
                          <SuggestionRow
                            key={s.contentRef}
                            suggestion={s}
                            episodeId={episodeId}
                            sessionId={undefined}
                          />
                        ))
                      )}
                    </>
                  )}

                  <SectionHeader>Kohteet ({unassignedItems.length})</SectionHeader>
                  {isEpisodeItemsLoading ? (
                    <LoadingState message="Ladataan..." />
                  ) : unassignedItems.length === 0 ? (
                    <Text variant="muted">Ei kohteita vielä.</Text>
                  ) : (
                    unassignedItems.map((item) => (
                      <ReadingItemRow key={item.id} item={item} episodeId={episodeId} />
                    ))
                  )}
                  {showEpisodeAddForm && (
                    <AddItemForm
                      episodeId={episodeId}
                      sessionId={undefined}
                      onAdded={() => setShowEpisodeAddForm(false)}
                    />
                  )}
                </>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        </div>

        {/* Player progress */}
        <SectionHeader>Pelaajien edistyminen</SectionHeader>
        {isProgressLoading ? (
          <LoadingState message="Ladataan..." />
        ) : !progress || progress.length === 0 ? (
          <Text variant="muted">Ei edistymistä vielä.</Text>
        ) : (
          <div className="space-y-2">
            {progress.map((entry) => {
              const pct =
                entry.totalCount > 0
                  ? Math.round((entry.completedCount / entry.totalCount) * 100)
                  : 0;
              return (
                <div key={entry.userId} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--theme-text)]">
                      {entry.username ?? `Pelaaja #${entry.userId}`}
                    </span>
                    <span className="text-[length:var(--font-size-2xs)] text-text-subtle">
                      {entry.completedCount}/{entry.totalCount}
                    </span>
                  </div>
                  <div className="h-1 rounded-full bg-[var(--theme-surface-tint)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[var(--theme-secondary)] transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </HeadingLevelProvider>
  );
}
