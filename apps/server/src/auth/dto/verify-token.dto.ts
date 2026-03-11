import { IsNotEmpty, IsUUID } from "class-validator";

export class VerifyTokenDto {
  @IsUUID()
  @IsNotEmpty()
  token!: string;
}
