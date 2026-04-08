import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/Accordion";
import { Badge } from "@repo/ui/components/Badge";
import { Card, CardContent, CardHeader } from "@repo/ui/components/Card";
import { Heading, HeadingLevelContext, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Icon } from "@repo/ui/components/Icon";
import { Stack } from "@repo/ui/components/Layout";
import { Link } from "@repo/ui/components/Link";
import { Page, PageBody } from "@repo/ui/components/Page";
import { Pagination } from "@repo/ui/components/Pagination";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";
import { useState } from "react";
import { CHANGELOG_RELEASES, type ChangelogRelease } from "../changelog-data";

const RELEASES_PER_PAGE = 3;

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fi-FI", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function ReleaseCard({ release }: { release: ChangelogRelease }) {
  const hasFeatures = release.features.length > 0;
  const hasMajor = release.major.length > 0;
  const hasMinor = release.minor.length > 0;

  return (
    <Card variant="outline">
      {/* H3: release name */}
      <CardHeader className="gap-3">
        <Stack direction="row" gap={3} align="baseline" wrap>
          <Badge variant="highlight-solid" className="font-mono shrink-0">
            v{release.version}
          </Badge>
          <Text variant="caption" className="m-0">
            {formatDate(release.date)}
          </Text>
        </Stack>
        {release.name && <Heading className="m-0">{release.name}</Heading>}
      </CardHeader>

      {/* Bump to H4 for section headings */}
      <HeadingLevelProvider>
        <CardContent variant="dense">
          <Stack gap={6}>
            {hasFeatures && (
              <section>
                <Stack direction="row" gap={2} align="center" className="mb-3">
                  <Icon name="sparkles" size={14} className="text-[var(--theme-primary)]" />
                  {/* H4: section heading */}
                  <Heading className="m-0">Ominaisuudet</Heading>
                </Stack>
                {/* Bump to H5 for item titles */}
                <HeadingLevelProvider>
                  <Stack as="ul" gap={4}>
                    {release.features.map((item) => (
                      <Stack as="li" gap={1} key={item.title}>
                        {/* H5: item title */}
                        <Heading className="m-0">{item.title}</Heading>
                        <Text className="m-0">{item.description}</Text>
                        {item.link && (
                          <Link href={item.link.to} className="mt-1">
                            <Icon name="link" size={13} className="inline-block mr-1" />
                            {item.link.label}
                          </Link>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </HeadingLevelProvider>
              </section>
            )}

            {hasFeatures && hasMajor && <Separator />}

            {hasMajor && (
              <section>
                <Stack direction="row" gap={2} align="center" className="mb-3">
                  <Icon name="zap" size={14} className="text-[var(--theme-accent)]" />
                  {/* H4: section heading */}
                  <Heading className="m-0">Suuremmat muutokset</Heading>
                </Stack>
                {/* Bump to H5 for item titles */}
                <HeadingLevelProvider>
                  <Stack as="ul" gap={4}>
                    {release.major.map((item) => (
                      <Stack as="li" gap={1} key={item.title}>
                        {/* H5: item title */}
                        <Heading className="m-0">{item.title}</Heading>
                        <Text variant="muted" className="m-0">
                          {item.description}
                        </Text>
                        {item.link && (
                          <Link href={item.link.to} className="mt-1">
                            <Icon name="link" size={13} className="inline-block mr-1" />
                            {item.link.label}
                          </Link>
                        )}
                      </Stack>
                    ))}
                  </Stack>
                </HeadingLevelProvider>
              </section>
            )}

            {hasMinor && (hasFeatures || hasMajor) && <Separator />}

            {hasMinor && (
              <Accordion>
                <AccordionItem variant="ghost">
                  <AccordionTrigger className="py-2">
                    <Stack direction="row" gap={2} align="center">
                      <Icon name="cog" size={14} className="text-[var(--theme-text-subtle)]" />
                      {/* H4: section heading */}
                      <Heading className="m-0">Korjaukset ({release.minor.length})</Heading>
                    </Stack>
                  </AccordionTrigger>
                  <AccordionContent>
                    {/* Bump to H5 for item titles */}
                    <HeadingLevelProvider>
                      <Stack as="ul" gap={4} className="pt-2">
                        {release.minor.map((item) => (
                          <Stack as="li" gap={1} key={item.title}>
                            {/* H5: item title */}
                            <Heading className="m-0">{item.title}</Heading>
                            <Text variant="muted" className="m-0">
                              {item.description}
                            </Text>
                            {item.link && (
                              <Link href={item.link.to} className="mt-1">
                                <Icon name="link" size={13} className="inline-block mr-1" />
                                {item.link.label}
                              </Link>
                            )}
                          </Stack>
                        ))}
                      </Stack>
                    </HeadingLevelProvider>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </Stack>
        </CardContent>
      </HeadingLevelProvider>
    </Card>
  );
}

export function ChangelogPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(CHANGELOG_RELEASES.length / RELEASES_PER_PAGE);
  const pageStart = (currentPage - 1) * RELEASES_PER_PAGE;
  const pagedReleases = CHANGELOG_RELEASES.slice(pageStart, pageStart + RELEASES_PER_PAGE);
  const latestVersion = CHANGELOG_RELEASES[0]?.version ?? "0.1.0";

  return (
    <Page>
      {/* H1 is the rotated sidebar title — override Page's context=1 to start at 2 */}
      <HeadingLevelContext.Provider value={2}>
        {/* H2: Hero title */}
        <Hero title="Muutosloki" description={`Nykyinen versio: v${latestVersion}`} />
        {/* Bump to H3 for release names */}
        <HeadingLevelProvider>
          <PageBody className="max-w-3xl">
            <Stack gap={8}>
              {pagedReleases.map((release) => (
                <ReleaseCard key={release.version} release={release} />
              ))}
            </Stack>

            {totalPages > 1 && (
              <Stack align="center" className="mt-10">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </Stack>
            )}
          </PageBody>
        </HeadingLevelProvider>
      </HeadingLevelContext.Provider>
    </Page>
  );
}
