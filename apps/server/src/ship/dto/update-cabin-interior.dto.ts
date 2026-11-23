import { IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateCabinInteriorDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  cabinCustomTitle?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(8000)
  cabinDecoration?: string | null;
}
