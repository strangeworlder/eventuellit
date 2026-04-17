import { IsInt, Min } from "class-validator";

export class AddOccupantDto {
  @IsInt()
  @Min(1)
  characterId!: number;
}
