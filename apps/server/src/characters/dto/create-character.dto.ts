import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateCharacterDto {
  @IsString()
  name!: string;

  @IsString()
  archetype!: string;

  @IsInt()
  @Min(0)
  episodeId!: number;

  @IsOptional()
  @IsIn(["male", "female", "non-binary", "none"])
  sex?: string;

  @IsOptional()
  @IsString()
  motivation?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsInt()
  @Min(0)
  keho!: number;

  @IsInt()
  @Min(0)
  mieli!: number;

  @IsInt()
  @Min(0)
  tera!: number;

  @IsArray()
  @ArrayMaxSize(20)
  sisuDice!: Array<{ id: string; faces: number }>;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  skills?: unknown[];

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
