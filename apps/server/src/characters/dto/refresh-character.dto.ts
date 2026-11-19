import { IsInt, Min } from "class-validator";

export class RefreshCharacterDto {
  @IsInt()
  @Min(1)
  episodeId!: number;
}
