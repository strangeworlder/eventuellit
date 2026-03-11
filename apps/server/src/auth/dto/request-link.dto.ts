import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestLinkDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
