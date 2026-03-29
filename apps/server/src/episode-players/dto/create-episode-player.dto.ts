import { IsInt, Min } from "class-validator";

export class CreateEpisodePlayerDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsInt()
  @Min(1)
  userId!: number;
}
