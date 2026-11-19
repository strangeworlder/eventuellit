import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export const ALLOWED_CLOCK_SEGMENTS = [4, 6, 8, 10, 12] as const;

export class CreateShipClockDto {
  @IsIn(["tutkimus", "projekti"])
  category!: "tutkimus" | "projekti";

  @IsIn(["ship", "character"])
  scope!: "ship" | "character";

  @IsOptional()
  @IsInt()
  @Min(1)
  characterId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  roomKey?: string | null;

  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsIn(ALLOWED_CLOCK_SEGMENTS)
  segmentsTotal?: 4 | 6 | 8 | 10 | 12 | null;
}
