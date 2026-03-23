import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from "class-validator";

export class CreateCharacterDto {
  @IsString()
  name!: string;

  @IsIn(["soldier", "expert"])
  archetype!: "soldier" | "expert";

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

  @IsIn(["n4", "n6", "n8", "n10", "n12"])
  sisuDie!: "n4" | "n6" | "n8" | "n10" | "n12";

  @IsInt()
  @Min(0)
  @Max(12)
  sisuCount!: number;

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
