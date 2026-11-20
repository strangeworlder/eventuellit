import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class CreatePrivateNoteDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string | null;

  @IsString()
  @MinLength(1)
  @MaxLength(20000)
  content!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  episodeId?: number | null;

  @IsOptional()
  @IsBoolean()
  isPinned?: boolean;
}
