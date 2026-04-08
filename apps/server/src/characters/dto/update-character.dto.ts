import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  archetype?: string;

  @IsOptional()
  @IsIn(["male", "female", "non-binary", "none"])
  sex?: string;

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(5)
  nicknames?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  keho?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentKeho?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  mieli?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentMieli?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  tera?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  currentTera?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  sisuDice?: Array<{ id: string; faces: number }>;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  removedSisuIds?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  harmit?: Array<{ text: string; healed: boolean }>;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  skills?: unknown[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  inventory?: unknown[];

  @IsOptional()
  @IsInt()
  @Min(0)
  fysiikka?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  nopeus?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  ymmarrys?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  persoona?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  nakemys?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  napparyys?: number;
}
