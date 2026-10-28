import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RequestLinkDto {
  @Transform(({ value }) => (typeof value === "string" ? value.trim().toLowerCase() : value))
  @IsEmail()
  @IsNotEmpty()
  email!: string;
}
