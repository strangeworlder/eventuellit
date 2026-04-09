import { cn } from "@repo/ui";
import { Button } from "@repo/ui/components/Button";
import { Dialog } from "@repo/ui/components/Dialog";
import { GameTerm } from "@repo/ui/components/GameTerm";
import { Icon } from "@repo/ui/components/Icon";
import { Input } from "@repo/ui/components/Input";
import { Text } from "@repo/ui/components/Text";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { glossary } from "./glossary";

interface SearchablePage {
  id: string;
  title: string;
  description?: string;
  content: string;
}

interface SearchResult {
  type: "section" | "glossary";
  pageId?: string;
  pageTitle?: string;
  sectionId?: string;
  label: string;
  snippet: string;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\\\./g, ".")
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractSnippet(text: string, query: string, maxLength = 130): string {
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text.slice(0, maxLength) + (text.length > maxLength ? "…" : "");

  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + query.length + 90);
  const snippet = text.slice(start, end);
  return (start > 0 ? "…" : "") + snippet + (end < text.length ? "…" : "");
}

function buildSectionIndex(pages: SearchablePage[]) {
  const sections: Array<{
    pageId: string;
    pageTitle: string;
    sectionId: string;
    sectionTitle: string;
    body: string;
  }> = [];

  for (const page of pages) {
    const lines = page.content.split(/\r?\n/);
    const usageMap = new Map<string, number>();
    let currentSection: { id: string; title: string; lines: string[] } | null = null;

    const flush = () => {
      if (currentSection) {
        sections.push({
          pageId: page.id,
          pageTitle: page.title,
          sectionId: currentSection.id,
          sectionTitle: currentSection.title,
          body: stripMarkdown(currentSection.lines.join("\n")),
        });
      }
    };

    for (const line of lines) {
      const h3Match = line.match(/^###\s+(.+?)\s*$/);
      if (h3Match) {
        flush();
        const rawLabel = h3Match[1]!
          .replace(/\\([\\`*_{}[\]()#+.!-])/g, "$1")
          .replace(/[`*_~]/g, "")
          .trim();
        const slug =
          rawLabel
            .normalize("NFKD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "") || "osio";
        const count = (usageMap.get(slug) ?? 0) + 1;
        usageMap.set(slug, count);
        const id = count > 1 ? `${page.id}-${slug}-${count}` : `${page.id}-${slug}`;
        currentSection = { id, title: rawLabel, lines: [] };
      } else if (currentSection) {
        currentSection.lines.push(line);
      }
    }
    flush();

    // Also add page-level entry if no sections (or always)
    sections.unshift({
      pageId: page.id,
      pageTitle: page.title,
      sectionId: "",
      sectionTitle: page.title,
      body: page.description ?? "",
    });
  }

  return sections;
}

function search(query: string, sectionIndex: ReturnType<typeof buildSectionIndex>): SearchResult[] {
  if (!query.trim()) return [];

  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];
  const seen = new Set<string>();

  // Search sections
  for (const sec of sectionIndex) {
    const haystack = `${sec.sectionTitle} ${sec.body}`.toLowerCase();
    if (!haystack.includes(q)) continue;

    const key = `${sec.pageId}#${sec.sectionId}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      type: "section",
      pageId: sec.pageId,
      pageTitle: sec.pageTitle,
      sectionId: sec.sectionId || undefined,
      label: sec.sectionTitle,
      snippet: extractSnippet(sec.body || sec.pageTitle, query),
    });

    if (results.length >= 8) break;
  }

  // Search glossary terms
  for (const entry of glossary) {
    const haystack = `${entry.term} ${entry.definition}`.toLowerCase();
    if (!haystack.includes(q)) continue;

    const key = `glossary-${entry.term}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      type: "glossary",
      label: entry.term,
      snippet: extractSnippet(entry.definition, query),
    });

    if (results.length >= 12) break;
  }

  return results;
}

interface RulesetSearchProps {
  open: boolean;
  onClose: () => void;
  pages: SearchablePage[];
  basePath: string;
}

export function RulesetSearch({ open, onClose, pages, basePath }: RulesetSearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const sectionIndex = useMemo(() => buildSectionIndex(pages), [pages]);
  const results = useMemo(() => search(query, sectionIndex), [query, sectionIndex]);

  useEffect(() => {
    setActiveIndex(0);
  }, [results.length]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      onClose();

      if (result.type === "glossary") {
        const target = basePath === "/" ? "/sanasto" : `${basePath}/sanasto`;
        navigate(target);
        return;
      }

      const pageId = result.pageId!;
      const target = basePath === "/" ? `/${pageId}` : `${basePath}/${pageId}`;
      navigate(target, {
        state: result.sectionId ? { scrollToSection: result.sectionId } : undefined,
      });
    },
    [navigate, onClose, basePath],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[activeIndex]) {
      handleSelect(results[activeIndex]);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Hae säännöistä" size="md" hideCloseButton>
      <div className="-mx-6 -mt-5">
        {/* Custom search input */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-[var(--theme-border-soft)]">
          <Icon name="search" size={18} className="text-text-muted shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0 [&>div]:mt-0 [&>div]:gap-0">
            <Input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Hae termiä, sääntöä tai osiota..."
              className="border-0 shadow-none bg-transparent rounded-none h-auto min-h-0 py-1.5 px-0 text-base font-normal focus-visible:ring-0 focus-visible:border-transparent"
              aria-label="Hakukenttä"
              aria-autocomplete="list"
              aria-activedescendant={
                results[activeIndex] ? `search-result-${activeIndex}` : undefined
              }
            />
          </div>
          {query && (
            <Button
              type="button"
              variant="ghost-subtle"
              size="icon"
              onClick={() => setQuery("")}
              aria-label="Tyhjennä haku"
            >
              <Icon name="x" size={16} />
            </Button>
          )}
          <kbd className="hidden mobile:inline-flex items-center gap-1 px-2 py-0.5 text-xs text-text-subtle border border-[var(--theme-border-soft)] rounded font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[56vh] overflow-y-auto" role="listbox" aria-label="Hakutulokset">
          {query && results.length === 0 && (
            <div className="px-5 py-10 text-center">
              <Text variant="muted">Ei tuloksia haulle &ldquo;{query}&rdquo;</Text>
            </div>
          )}

          {!query && (
            <div className="px-5 py-6 text-center">
              <Text variant="small" className="text-center">
                Kirjoita hakusana löytääksesi sääntöjä, termejä ja osioita.
              </Text>
            </div>
          )}

          {results.length > 0 && (
            <ul className="py-2">
              {results.map((result, i) => (
                <li key={`${result.type}-${result.label}-${i}`}>
                  <Button
                    id={`search-result-${i}`}
                    type="button"
                    variant="ghost-subtle"
                    role="option"
                    aria-selected={i === activeIndex}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={cn(
                      "w-full h-auto min-h-0 rounded-none text-left px-5 py-3 flex items-start gap-3 transition-colors duration-150 font-normal justify-start",
                      i === activeIndex
                        ? "bg-[var(--theme-surface-tint)]"
                        : "hover:bg-[var(--theme-surface-tint)]",
                    )}
                  >
                    <span className="mt-0.5 shrink-0 text-text-muted">
                      {result.type === "glossary" ? (
                        <Icon name="rulebook" size={16} aria-hidden="true" />
                      ) : result.sectionId ? (
                        <Icon name="hash" size={16} aria-hidden="true" />
                      ) : (
                        <Icon name="file-text" size={16} aria-hidden="true" />
                      )}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="flex items-center gap-2 mb-0.5">
                        <GameTerm variant="emphasis" className="text-sm">
                          {result.label}
                        </GameTerm>
                        {result.pageTitle && result.pageTitle !== result.label && (
                          <Text variant="caption" className="truncate">
                            {result.pageTitle}
                          </Text>
                        )}
                        {result.type === "glossary" && <Text variant="caption">Sanasto</Text>}
                      </span>
                      <Text variant="small" className="text-text-muted line-clamp-2">
                        {result.snippet}
                      </Text>
                    </span>
                    <Icon
                      name="corner-down-left"
                      size={14}
                      className={cn(
                        "mt-1 shrink-0 transition-opacity",
                        i === activeIndex ? "opacity-100 text-text-muted" : "opacity-0",
                      )}
                      aria-hidden="true"
                    />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--theme-border-soft)] px-5 py-2.5 flex items-center gap-4">
          <Text variant="caption" className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs border border-[var(--theme-border-soft)] rounded font-mono">
              ↑↓
            </kbd>
            Navigoi
          </Text>
          <Text variant="caption" className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs border border-[var(--theme-border-soft)] rounded font-mono">
              ↵
            </kbd>
            Avaa
          </Text>
          <Text variant="caption" className="flex items-center gap-1.5">
            <kbd className="inline-flex items-center px-1.5 py-0.5 text-xs border border-[var(--theme-border-soft)] rounded font-mono">
              Esc
            </kbd>
            Sulje
          </Text>
        </div>
      </div>
    </Dialog>
  );
}
