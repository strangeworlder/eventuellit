import { IsInt, Min } from "class-validator";

export class AdvanceMonkDto {
  @IsInt()
  @Min(1)
  powerId!: number;
}
