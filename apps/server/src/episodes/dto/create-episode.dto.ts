import { Transform } from "class-transformer";
import { IsArray, IsInt, IsOptional, IsString, Matches, Min } from "class-validator";
import { normalizeTyrannyRollInput, TYRANNY_ROLL_REGEX } from "./tyranny-roll.validation";

export class CreateEpisodeDto {
  @IsString()
  slug!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  order?: number;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  locationLink?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  imageAlt?: string;

  @IsOptional()
  @IsString()
  theme?: string;

  @IsOptional()
  @IsString()
  players?: string;

  @IsOptional()
  @IsString()
  sessionDates?: string;

  @IsOptional()
  @IsString()
  mechanicalAdditions?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @Transform(({ value }) => normalizeTyrannyRollInput(value))
  @IsArray()
  @IsString({ each: true })
  @Matches(TYRANNY_ROLL_REGEX, {
    each: true,
    message: "Each tyranny roll must be an integer 1–12 or a single letter (A–Z, Å, Ä, Ö)",
  })
  tyrannyRolls?: string[];

  @IsOptional()
  @IsInt()
  mediaId?: number;
}
