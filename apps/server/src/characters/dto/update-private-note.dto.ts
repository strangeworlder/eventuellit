import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class UpdatePrivateNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string | null;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  content?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  episodeId?: number | null;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
