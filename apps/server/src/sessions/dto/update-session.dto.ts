import { IsBoolean, IsIn, IsOptional, IsString } from "class-validator";

export class UpdateSessionDto {
  @IsOptional()
  @IsString()
  date?: string;

  @IsOptional()
  @IsIn(["planned", "next", "played"])
  status?: string;

  @IsOptional()
  @IsString()
  label?: string;

  @IsOptional()
  @IsString()
  gmRecap?: string;

  @IsOptional()
  @IsBoolean()
  recapPublished?: boolean;
}
