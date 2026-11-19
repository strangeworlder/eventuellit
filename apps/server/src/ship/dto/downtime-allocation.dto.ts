import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsObject,
  IsString,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class DowntimeAllocationDto {
  @IsArray()
  @ArrayMaxSize(5)
  @IsInt({ each: true })
  @Min(0, { each: true })
  healedHarmiIndices!: number[];

  @IsObject()
  clockDice!: Record<string, number>;

  @IsInt()
  @Min(0)
  @Max(5)
  prepDice!: number;

  @IsString()
  @MaxLength(2000)
  prepDescription!: string;
}
