import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateSessionDto {
  @IsInt()
  @Min(1)
  episodeId!: number;

  @IsInt()
  @Min(1)
  sessionNumber!: number;

  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsString()
  label?: string;
}
