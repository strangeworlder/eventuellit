import { IsInt, Min } from "class-validator";

export class ClaimCabinDto {
  @IsInt()
  @Min(1)
  characterId!: number;
}
