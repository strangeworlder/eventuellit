import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpdateReadingItemDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  sessionId?: number;

  @IsOptional()
  @IsIn(["world", "ruleset", "custom", "task"])
  contentType?: string;

  @IsOptional()
  @IsString()
  contentRef?: string;

  @IsOptional()
  @IsString()
  title?: string;

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
}
