import {
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
} from "class-validator";

export class CreateMediaDto {
	@IsString()
	@IsNotEmpty()
	key: string;

	@IsString()
	@IsNotEmpty()
	filename: string;

	@IsString()
	@IsOptional()
	alt?: string;

	@IsString()
	@IsNotEmpty()
	mimeType: string;

	@IsInt()
	@Min(0)
	sizeBytes: number;

	@IsInt()
	@IsOptional()
	@Min(1)
	width?: number;

	@IsInt()
	@IsOptional()
	@Min(1)
	height?: number;

	@IsString()
	@IsOptional()
	@IsIn(["episodes", "ruleset", "world", "general"])
	context?: string;
}
