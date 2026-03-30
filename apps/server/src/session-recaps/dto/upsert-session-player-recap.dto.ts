import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class UpsertSessionPlayerRecapDto {
  @IsInt()
  @Min(1)
  sessionId!: number;

  @IsOptional()
  @IsString()
  journal?: string;

  @IsOptional()
  @IsString()
  highlight?: string;

  @IsOptional()
  @IsString()
  surprise?: string;

  @IsOptional()
  @IsString()
  mvp?: string;
}
