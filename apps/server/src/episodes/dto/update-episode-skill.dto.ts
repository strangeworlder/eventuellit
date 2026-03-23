import { IsString } from "class-validator";

export class UpdateEpisodeSkillDto {
  @IsString()
  name!: string;
}
