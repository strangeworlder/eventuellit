import { IsString } from "class-validator";

export class CreateEpisodeSkillDto {
  @IsString()
  name!: string;
}
