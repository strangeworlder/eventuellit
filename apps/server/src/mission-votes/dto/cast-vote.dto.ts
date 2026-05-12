import { IsInt, IsOptional } from "class-validator";

export class CastVoteDto {
  @IsInt()
  primaryOptionId: number;

  @IsOptional()
  @IsInt()
  secondaryOptionId?: number;
}
