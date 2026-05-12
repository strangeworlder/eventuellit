import { Inject, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DATABASE_CONNECTION } from "../db/db.module";
import type * as schema from "../db/schema";
import { media } from "../db/schema";
import type { CreateMediaDto } from "./dto/create-media.dto";
import { R2Service } from "./r2.service";

@Injectable()
export class MediaService {
	private readonly logger = new Logger(MediaService.name);

	constructor(
		@Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<typeof schema>,
		private readonly r2: R2Service,
	) {}

	async findAll(context?: string) {
		if (context) {
			return this.db
				.select()
				.from(media)
				.where(eq(media.context, context))
				.orderBy(media.createdAt);
		}
		return this.db.select().from(media).orderBy(media.createdAt);
	}

	async findOne(id: number) {
		const rows = await this.db.select().from(media).where(eq(media.id, id));
		if (!rows[0]) {
			throw new NotFoundException("Media not found");
		}
		return rows[0];
	}

	async requestUploadUrl(filename: string, contentType: string, context: string) {
		const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
		const uniqueSuffix = Date.now().toString(36);
		const key = `${context}/${uniqueSuffix}-${sanitizedFilename}`;

		const uploadUrl = await this.r2.getPresignedUploadUrl(key, contentType);
		const publicUrl = this.r2.getPublicUrl(key);

		return { uploadUrl, key, publicUrl };
	}

	async create(data: CreateMediaDto, uploadedBy: number) {
		const insertData: typeof media.$inferInsert = {
			key: data.key,
			filename: data.filename,
			alt: data.alt ?? "",
			mimeType: data.mimeType,
			sizeBytes: data.sizeBytes,
			width: data.width,
			height: data.height,
			context: data.context ?? "general",
			uploadedBy,
		};

		const result = await this.db.insert(media).values(insertData).returning();
		const record = result[0]!;

		this.logger.log(`Created media record: ${record.id} (${record.key})`);
		return {
			...record,
			publicUrl: this.r2.getPublicUrl(record.key),
		};
	}

	async remove(id: number) {
		const record = await this.findOne(id);
		await this.r2.deleteObject(record.key);
		await this.db.delete(media).where(eq(media.id, id));
		this.logger.log(`Deleted media: ${id} (${record.key})`);
	}
}
