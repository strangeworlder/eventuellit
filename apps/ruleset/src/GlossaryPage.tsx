import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { GameTerm } from "@repo/ui/components/GameTerm";
import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Input } from "@repo/ui/components/Input";
import { Grid } from "@repo/ui/components/Layout";
import { Link } from "@repo/ui/components/Link";
import { PageBody } from "@repo/ui/components/Page";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";
import { scrollElementIntoScrollRoot } from "@repo/ui/components/article-navigation-utils";
import { glossary, GLOSSARY_CATEGORIES, type GlossaryCategory } from "./glossary";

const CATEGORY_BADGE_VARIANT: Record<
  GlossaryCategory,
  "solid" | "outline" | "highlight" | "highlight-solid" | "ghost"
> = {
  Mekaniikka: "highlight-solid",
  Hahmo: "solid",
  Taistelu: "highlight",
  Vaurio: "outline",
  Kehitys: "ghost",
};

interface GlossaryPageProps {
  basePath: string;
}

function scrollToSection(
  pageId: string,
  sectionId: string,
  basePath: string,
  navigate: ReturnType<typeof useNavigate>,
) {
  const targetPath = basePath === "/" ? `/${pageId}` : `${basePath}/${pageId}`;
  navigate(targetPath);
  setTimeout(() => {
    if (!scrollElementIntoScrollRoot(sectionId)) {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, 300);
}

export function GlossaryPage({ basePath }: GlossaryPageProps) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");

  const normalized = filter.toLowerCase().trim();

  const filtered = normalized
    ? glossary.filter(
        (e) =>
          e.term.toLowerCase().includes(normalized) ||
          e.definition.toLowerCase().includes(normalized),
      )
    : glossary;

  const byCategory = GLOSSARY_CATEGORIES.map((cat) => ({
    category: cat,
    entries: filtered.filter((e) => e.category === cat),
  })).filter((g) => g.entries.length > 0);

  const totalCount = filtered.length;

  const handleSectionLink = useCallback(
    (pageId: string, sectionId: string) => {
      scrollToSection(pageId, sectionId, basePath, navigate);
    },
    [basePath, navigate],
  );

  return (
    <HeadingLevelProvider>
      <Hero title="Sanasto" description="Pelin keskeiset termit ja käsitteet selityksineen." />
      <PageBody>
        <Breadcrumb
          className="mb-6"
          items={[
            { label: "Säännöt", to: basePath === "/" ? "/" : basePath },
            { label: "Sanasto" },
          ]}
        />

        <div className="flex flex-col tablet:flex-row tablet:items-end gap-4 mb-8">
          <div className="flex-1 max-w-sm">
            <Input
              placeholder="Etsi termiä tai määritelmää..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              aria-label="Etsi sanastosta"
            />
          </div>
          {filter && (
            <Text variant="muted" className="shrink-0 pb-2">
              {totalCount} {totalCount === 1 ? "tulos" : "tulosta"}
            </Text>
          )}
        </div>

        {byCategory.length === 0 && (
          <div className="py-16 text-center">
            <Text variant="muted">Ei tuloksia haulle &ldquo;{filter}&rdquo;</Text>
          </div>
        )}

        <div className="space-y-16">
          {byCategory.map(({ category, entries }) => (
            <section key={category} aria-labelledby={`category-${category}`}>
              <HeadingLevelProvider>
                <div className="flex items-center gap-3 mb-6">
                  <Heading id={`category-${category}`} variant="h3">
                    {category}
                  </Heading>
                  <Badge variant={CATEGORY_BADGE_VARIANT[category]}>{entries.length}</Badge>
                </div>

                <Separator variant="medium" className="mb-6" />

                <Grid responsive={{ base: 1, tablet: 2 }} gap={4}>
                  {entries.map((entry) => (
                    <div
                      key={entry.term}
                      className="rounded-lg border border-[var(--theme-border-soft)] bg-[var(--theme-bg)] p-5 flex flex-col gap-2 hover:border-[var(--theme-border-medium)] transition-colors duration-300"
                    >
                      <GameTerm variant="label">{entry.term}</GameTerm>
                      <Text className="leading-relaxed">{entry.definition}</Text>
                      {entry.sectionPageId && entry.sectionId && (
                        <div className="mt-1">
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              handleSectionLink(entry.sectionPageId!, entry.sectionId!);
                            }}
                            className="text-sm"
                          >
                            Lue lisää →
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </Grid>
              </HeadingLevelProvider>
            </section>
          ))}
        </div>

        {!filter && (
          <div className="mt-16 pt-8 border-t border-[var(--theme-border-soft)]">
            <Text variant="muted" className="text-sm">
              {glossary.length} termiä yhteensä · {GLOSSARY_CATEGORIES.length} kategoriaa
            </Text>
          </div>
        )}
      </PageBody>
    </HeadingLevelProvider>
  );
}
