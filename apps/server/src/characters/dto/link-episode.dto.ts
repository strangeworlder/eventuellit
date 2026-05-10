import { IsInt, Min } from "class-validator";

export class LinkEpisodeDto {
  @IsInt()
  @Min(1)
  episodeId!: number;
}
