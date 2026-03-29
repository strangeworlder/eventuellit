import { IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateReadingItemDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  sessionId?: number;

  @IsIn(["world", "ruleset", "custom", "task"])
  contentType!: string;

  @IsOptional()
  @IsString()
  contentRef?: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsBoolean()
  autoSuggested?: boolean;
}
