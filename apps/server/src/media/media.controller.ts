/// <reference types="multer" />
import {
	BadRequestException,
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
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/auth.guard";
import { CreateMediaDto } from "./dto/create-media.dto";
import { ImageOptimizerService } from "./image-optimizer.service";
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
	constructor(
		private readonly mediaService: MediaService,
		private readonly imageOptimizer: ImageOptimizerService,
	) {}

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

	/**
	 * Upload an image, optimize it (AVIF/WebP/JPG × responsive sizes),
	 * upload variants to R2, update the manifest, and register in DB.
	 * GM only. Max 15 MB.
	 */
	@UseGuards(JwtAuthGuard)
	@Post("upload")
	@UseInterceptors(FileInterceptor("file", { limits: { fileSize: 15 * 1024 * 1024 } }))
	async upload(
		@UploadedFile() file: Express.Multer.File,
		@Body("context") context: string,
		@Body("alt") alt: string,
		@Req() req: Request,
	) {
		const user = ensureGm(req);
		if (!file) {
			throw new BadRequestException("No file provided");
		}

		const result = await this.imageOptimizer.optimize(
			file.buffer,
			file.originalname,
			context ?? "general",
		);

		const record = await this.mediaService.create(
			{
				key: result.key,
				filename: file.originalname,
				alt: alt ?? "",
				mimeType: file.mimetype,
				sizeBytes: file.size,
				width: result.width,
				height: result.height,
				context: context ?? "general",
			},
			user.id,
		);

		return { ...record, publicUrl: result.publicUrl };
	}

	/** Delete a media record and its R2 object. GM only. */
	@UseGuards(JwtAuthGuard)
	@Delete(":id")
	async remove(@Param("id", ParseIntPipe) id: number, @Req() req: Request) {
		ensureGm(req);
		return this.mediaService.remove(id);
	}
}
