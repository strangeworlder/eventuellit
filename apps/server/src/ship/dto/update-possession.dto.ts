import { IsInt, IsOptional, IsString, MaxLength, Min, MinLength } from "class-validator";

export class UpdatePossessionDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(4000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  gmMechanicalNotes?: string | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
