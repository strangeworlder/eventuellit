import { useAuth } from "@repo/auth/use-auth";
import { Button } from "@repo/ui/components/Button";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { MfeNotFoundRedirect } from "@repo/ui/components/MfeNotFoundRedirect";
import { Page } from "@repo/ui/components/Page";
import { Text } from "@repo/ui/components/Text";
import { TopNav, TopNavLink, TopNavList } from "@repo/ui/components/TopNav";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useCreateEpisode, useEpisodes } from "../api/episodes";
import { EpisodeDetails } from "./EpisodeDetails";
import { EpisodeEditForm } from "./EpisodeEditForm";
import { EpisodesIndex } from "./EpisodesIndex";

export function EpisodeWrapper() {
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
