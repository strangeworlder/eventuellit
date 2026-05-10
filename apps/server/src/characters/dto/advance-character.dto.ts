import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

const ATTRIBUTE_KEYS = ["fysiikka", "nopeus", "ymmarrys", "persoona", "nakemys", "napparyys"] as const;

export class AdvanceCharacterDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsIn(ATTRIBUTE_KEYS)
  attribute!: (typeof ATTRIBUTE_KEYS)[number];

  @IsIn(["skills_plus_n6", "skill_plus_n8"])
  reward!: "skills_plus_n6" | "skill_plus_n8";

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @IsString({ each: true })
  newSkills?: string[];
}
