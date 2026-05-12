import { IsDateString, IsIn, IsInt, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateRoundDto {
  @IsString()
  @MaxLength(200)
  title: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;
}
