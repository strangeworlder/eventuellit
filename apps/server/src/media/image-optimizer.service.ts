import { Injectable, Logger } from "@nestjs/common";
import sharp from "sharp";
import { R2Service } from "./r2.service";

/** Widths to generate for responsive variants. Originals wider than these get all breakpoints. */
const BREAKPOINTS = [480, 768, 1200];

const MANIFEST_KEY = "images/manifest.json";

interface OptimizeResult {
	key: string;
	width: number;
	height: number;
	placeholder: string;
	publicUrl: string;
}

@Injectable()
export class ImageOptimizerService {
	private readonly logger = new Logger(ImageOptimizerService.name);

	constructor(private readonly r2: R2Service) {}

	/**
	 * Optimize an image buffer and upload all variants to R2.
	 * Updates the manifest.json on R2 with the new entry.
	 *
	 * @param buffer Raw image file buffer
	 * @param originalFilename Original filename (for key generation)
	 * @param context "episodes" | "ruleset" | "world" | "general"
	 * @returns metadata for DB record creation
	 */
	async optimize(
		buffer: Buffer,
		originalFilename: string,
		context: string,
	): Promise<OptimizeResult> {
		const meta = await sharp(buffer).metadata();
		const origWidth = meta.width ?? 800;
		const origHeight = meta.height ?? 600;

		// Derive key from filename
		const baseName = originalFilename.replace(/\.[^.]+$/, "");
		const slug = this.normalizeKey(baseName);
		const key = `images/${slug}`;

		// Compute target widths
		const widths = BREAKPOINTS.filter((w) => w < origWidth);
		widths.push(origWidth);

		this.logger.log(
			`Optimizing ${originalFilename} (${origWidth}×${origHeight}) → ${widths.length} sizes × 3 formats`,
		);

		// Generate and upload all variants
		for (const w of widths) {
			const resized = sharp(buffer).resize(w, null, { withoutEnlargement: true });

			const [avifBuf, webpBuf, jpgBuf] = await Promise.all([
				resized.clone().avif({ quality: 45 }).toBuffer(),
				resized.clone().webp({ quality: 70 }).toBuffer(),
				resized.clone().jpeg({ quality: 75, mozjpeg: true }).toBuffer(),
			]);

			await Promise.all([
				this.r2.putObject(`${key}-${w}.avif`, avifBuf, "image/avif"),
				this.r2.putObject(`${key}-${w}.webp`, webpBuf, "image/webp"),
				this.r2.putObject(`${key}-${w}.jpg`, jpgBuf, "image/jpeg"),
			]);
		}

		// Generate blur placeholder (24px wide)
		const placeholderBuf = await sharp(buffer)
			.resize(24, null, { withoutEnlargement: true })
			.jpeg({ quality: 30 })
			.toBuffer();
		const placeholder = `data:image/jpeg;base64,${placeholderBuf.toString("base64")}`;

		// Update manifest
		await this.updateManifest(slug, origWidth, origHeight, placeholder, widths);

		const publicUrl = this.r2.getPublicUrl(`${key}-${origWidth}.jpg`);
		this.logger.log(`✅ ${slug}: ${widths.length * 3} variants uploaded`);

		return { key, width: origWidth, height: origHeight, placeholder, publicUrl };
	}

	/**
	 * Read the current manifest from R2, merge the new entry, and write it back.
	 */
	private async updateManifest(
		slug: string,
		width: number,
		height: number,
		placeholder: string,
		widths: number[],
	): Promise<void> {
		// Read existing manifest
		let manifest: Record<string, unknown> = {};
		const existing = await this.r2.getObject(MANIFEST_KEY);
		if (existing) {
			try {
				manifest = JSON.parse(existing.toString("utf-8"));
			} catch {
				this.logger.warn("Could not parse existing manifest, starting fresh");
			}
		}

		// Add / overwrite this entry
		manifest[slug] = {
			width,
			height,
			placeholder,
			variants: widths.map((w) => ({
				width: w,
				avif: `/images/${slug}-${w}.avif`,
				webp: `/images/${slug}-${w}.webp`,
				jpg: `/images/${slug}-${w}.jpg`,
			})),
		};

		// Write back
		const body = Buffer.from(JSON.stringify(manifest, null, 2));
		await this.r2.putObject(MANIFEST_KEY, body, "application/json");
		this.logger.log(`Manifest updated (${Object.keys(manifest).length} entries)`);
	}

	private normalizeKey(value: string): string {
		return value.toLowerCase().replace(/[^a-z0-9-]/g, "-");
	}
}
