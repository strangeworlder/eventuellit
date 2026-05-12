import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RequestUploadDto {
	@IsString()
	@IsNotEmpty()
	filename: string;

	@IsString()
	@IsNotEmpty()
	contentType: string;

	@IsString()
	@IsOptional()
	@IsIn(["episodes", "ruleset", "world", "general"])
	context?: string;
}
