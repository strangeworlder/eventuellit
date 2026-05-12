import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateRoundDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsIn(["open", "closed"])
  status?: "open" | "closed";

  @IsOptional()
  @IsDateString()
  deadline?: string | null;
}
