import { IsInt, IsObject, IsOptional, IsString, Max, Min } from "class-validator";

export class CreateMonkPowerDto {
  @IsString()
  name!: string;

  @IsInt()
  @Min(1)
  @Max(8)
  tier!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsObject()
  properties?: Record<string, unknown>;
}
