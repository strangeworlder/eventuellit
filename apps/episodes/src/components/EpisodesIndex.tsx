import { Badge } from "@repo/ui/components/Badge";
import { Breadcrumb } from "@repo/ui/components/Breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { PageBody } from "@repo/ui/components/Page";
import { Text } from "@repo/ui/components/Text";
import { Link } from "react-router-dom";
import type { Episode } from "../api/episodes";

export function EpisodesIndex({ episodes, basePath }: { episodes: Episode[]; basePath: string }) {
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
              <Link
                key={episode.id}
                to={basePath === "/" ? `/${episode.slug}` : `${basePath}/${episode.slug}`}
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
              </Link>
            ))}
          </div>
        </HeadingLevelProvider>
      </PageBody>
    </>
  );
}
