import { ArrayMaxSize, IsArray, IsInt, IsOptional, Min } from "class-validator";

export class RefreshCharacterDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Min(0, { each: true })
  healedHarmitIndexes?: number[];
}
