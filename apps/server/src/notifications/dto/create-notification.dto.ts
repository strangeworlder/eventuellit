import { IsOptional, IsString } from "class-validator";

export class CreateNotificationDto {
  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  referenceId?: string;

  @IsOptional()
  @IsString()
  message?: string;
}
