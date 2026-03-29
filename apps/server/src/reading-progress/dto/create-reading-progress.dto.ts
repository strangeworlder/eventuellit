import { IsInt, Min } from "class-validator";

export class CreateReadingProgressDto {
  @IsInt()
  @Min(1)
  readingItemId!: number;
}
