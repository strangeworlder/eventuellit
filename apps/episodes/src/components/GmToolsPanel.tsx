import { Button } from "@repo/ui/components/Button";
import { Drawer } from "@repo/ui/components/Drawer";
import { Heading } from "@repo/ui/components/Heading";
import type { Episode } from "../api/episodes";
import { ReadingListEditor } from "../ReadingListEditor";
import { EpisodePlayersEditor } from "./EpisodePlayersEditor";
import { EpisodeSkillsEditor } from "./EpisodeSkillsEditor";

export function GmToolsPanel({
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
