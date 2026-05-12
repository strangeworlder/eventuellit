import {
	Body,
	Controller,
	Delete,
	ForbiddenException,
	Get,
	Param,
	ParseIntPipe,
	Post,
	Query,
	Req,
	UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CreateMediaDto } from "./dto/create-media.dto";
import { RequestUploadDto } from "./dto/request-upload.dto";
import { MediaService } from "./media.service";

function ensureGm(req: Request) {
	const user = (req as any).user;
	if (!user || user.role !== "gm") {
		throw new ForbiddenException("Only GMs can perform this action");
	}
	return user;
}

@Controller("media")
export class MediaController {
	constructor(private readonly mediaService: MediaService) {}

	/** List all media, optionally filtered by context. */
	@UseGuards(JwtAuthGuard)
	@Get()
	findAll(@Query("context") context?: string) {
		return this.mediaService.findAll(context);
	}

	/** Get a single media record by ID. */
	@UseGuards(JwtAuthGuard)
	@Get(":id")
	findOne(@Param("id", ParseIntPipe) id: number) {
		return this.mediaService.findOne(id);
	}

	/** Generate a presigned PUT URL for direct R2 upload. GM only. */
	@UseGuards(JwtAuthGuard)
	@Post("upload-url")
	async requestUploadUrl(@Body() dto: RequestUploadDto, @Req() req: Request) {
		ensureGm(req);
		return this.mediaService.requestUploadUrl(
			dto.filename,
			dto.contentType,
			dto.context ?? "general",
		);
	}

	/** Register a completed upload in the DB. GM only. */
	@UseGuards(JwtAuthGuard)
	@Post()
	async create(@Body() dto: CreateMediaDto, @Req() req: Request) {
		const user = ensureGm(req);
		return this.mediaService.create(dto, user.id);
	}

	/** Delete a media record and its R2 object. GM only. */
	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		ensureGm(req);
		return this.mediaService.remove(id);
	}
}
