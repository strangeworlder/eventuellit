import { IsIn, IsInt, IsOptional, IsString, IsUrl, MaxLength, Min } from "class-validator";

export class CreateOptionDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsIn(["kriittinen", "normaali", "joustava"])
  urgency?: "kriittinen" | "normaali" | "joustava";

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
