import { IsIn, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";
import { ALLOWED_CLOCK_SEGMENTS } from "./create-ship-clock.dto";

export class UpdateShipClockDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsIn(["tutkimus", "projekti"])
  category?: "tutkimus" | "projekti";

  @IsOptional()
  @IsIn(["ship", "character"])
  scope?: "ship" | "character";

  @IsOptional()
  @IsInt()
  @Min(1)
  characterId?: number | null;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  roomKey?: string | null;

  @IsOptional()
  @IsIn(ALLOWED_CLOCK_SEGMENTS)
  segmentsTotal?: 4 | 6 | 8 | 10 | 12 | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  segmentsFilled?: number;

  @IsOptional()
  @IsIn(["active", "completed", "archived"])
  status?: "active" | "completed" | "archived";

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  completionNotes?: string | null;
}
