import { Heading } from "@repo/ui/components/Heading";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { SkillTagList } from "@repo/ui/components/SkillTagList";
import {
  useCreateEpisodeSkill,
  useDeleteEpisodeSkill,
  useEpisodeSkills,
  useUpdateEpisodeSkill,
} from "../api/episodes";

export function EpisodeSkillsEditor({ episodeId }: { episodeId: number }) {
  const { data: skills, isLoading } = useEpisodeSkills(episodeId);
  const { mutate: addSkill } = useCreateEpisodeSkill();
  const { mutate: removeSkill } = useDeleteEpisodeSkill();
  const { mutate: updateSkill } = useUpdateEpisodeSkill();

  if (isLoading) return <LoadingState message="Ladataan taitoja..." />;

  return (
    <div className="space-y-3">
      <Heading>Jakson Taidot</Heading>
      <SkillTagList
        items={(skills ?? []).map((s) => ({ id: s.id, name: s.name }))}
        onItemEdit={(id, name) => updateSkill({ episodeId, skillId: id as number, name })}
        onItemRemove={(id) => removeSkill({ episodeId, skillId: id as number })}
        onItemAdd={(name) => addSkill({ episodeId, name })}
      />
    </div>
  );
}
