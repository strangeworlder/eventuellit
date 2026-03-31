import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateEpisodeInviteDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsInt()
  @Min(1)
  userId!: number;

  @IsOptional()
  @IsString()
  message?: string;
}
