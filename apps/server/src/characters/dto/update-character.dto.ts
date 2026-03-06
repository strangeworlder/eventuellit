import { ArrayMaxSize, IsArray, IsIn, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class UpdateCharacterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsIn(["soldier", "expert"])
  archetype?: "soldier" | "expert";

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
  @IsIn(["n4", "n6", "n8", "n10", "n12"])
  sisuDie?: "n4" | "n6" | "n8" | "n10" | "n12";

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(12)
  sisuCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(12)
  currentSisuCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  vaurio?: number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(200)
  inventory?: unknown[];
}
