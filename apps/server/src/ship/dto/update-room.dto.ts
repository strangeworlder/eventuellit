import { IsOptional, IsString } from "class-validator";

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  function?: string;

  @IsOptional()
  @IsString()
  contents?: string;
}
