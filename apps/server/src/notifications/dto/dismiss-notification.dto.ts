import { IsOptional, IsString } from "class-validator";

export class DismissNotificationDto {
  @IsString()
  type!: string;

  @IsOptional()
  @IsString()
  referenceId?: string;
}
