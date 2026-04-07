import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/Accordion";
import { Badge } from "@repo/ui/components/Badge";
import { HeadingLevelProvider, Heading } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Link } from "@repo/ui/components/Link";
import { Page, PageBody } from "@repo/ui/components/Page";
import { Pagination } from "@repo/ui/components/Pagination";
import { Separator } from "@repo/ui/components/Separator";
import { Text } from "@repo/ui/components/Text";
import { useState } from "react";
import {
  changelog,
  changeTypeMeta,
  type ChangelogItem as ChangelogItemType,
  type ChangeType,
} from "../data/changelog";

const ENTRIES_PER_PAGE = 5;

const dateFormatter = new Intl.DateTimeFormat("fi-FI", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function ChangeItem({ item }: { item: ChangelogItemType }) {
  const meta = changeTypeMeta[item.type];
  return (
    <div className="flex items-start gap-3 py-1.5">
      <Badge variant={meta.badgeVariant} icon={meta.icon} className="shrink-0 mt-0.5">
        {meta.label}
      </Badge>
      <Text variant="body" className="flex-1">
        {item.description}
        {item.links?.map((link) => (
          <span key={link.href}>
            {" "}
            <Link href={link.href} external={link.external}>
              {link.label}
            </Link>
          </span>
        ))}
      </Text>
    </div>
  );
}

function groupByType(items: ChangelogItemType[]) {
  const groups: Record<ChangeType, ChangelogItemType[]> = {
    feature: [],
    major: [],
    minor: [],
  };
  for (const item of items) {
    groups[item.type].push(item);
  }
  return groups;
}

export function ChangelogPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(changelog.length / ENTRIES_PER_PAGE);
  const start = (currentPage - 1) * ENTRIES_PER_PAGE;
  const paginatedEntries = changelog.slice(start, start + ENTRIES_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const scrollRoot = document.getElementById("app-scroll-root");
    scrollRoot?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Page>
      <Hero title="Muutosloki" description="Kaikki päivitykset ja muutokset" />
      <HeadingLevelProvider>
        <PageBody className="max-w-3xl">
          {paginatedEntries.map((entry, index) => {
            const { feature, major, minor } = groupByType(entry.items);
            const formattedDate = dateFormatter.format(new Date(entry.date));

            return (
              <section key={entry.version} className="space-y-4">
                <div>
                  <Heading>
                    v{entry.version}
                    {entry.title && ` — ${entry.title}`}
                  </Heading>
                  <Text variant="caption" className="mt-1">
                    {formattedDate}
                  </Text>
                </div>

                {feature.length > 0 && (
                  <div className="space-y-1">
                    {feature.map((item) => (
                      <ChangeItem key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {major.length > 0 && (
                  <div className="space-y-1">
                    {major.map((item) => (
                      <ChangeItem key={item.id} item={item} />
                    ))}
                  </div>
                )}

                {minor.length > 0 && (
                  <Accordion>
                    <AccordionItem value="minor">
                      <AccordionTrigger>
                        Pienet muutokset ({minor.length})
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-1">
                          {minor.map((item) => (
                            <ChangeItem key={item.id} item={item} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                )}

                {index < paginatedEntries.length - 1 && (
                  <Separator className="mt-6" />
                )}
              </section>
            );
          })}

          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            className="pt-4"
          />
        </PageBody>
      </HeadingLevelProvider>
    </Page>
  );
}
