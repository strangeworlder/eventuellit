import { IsIn, IsString } from "class-validator";

export class RespondEpisodeInviteDto {
  @IsString()
  @IsIn(["accepted", "declined"])
  status!: "accepted" | "declined";
}
