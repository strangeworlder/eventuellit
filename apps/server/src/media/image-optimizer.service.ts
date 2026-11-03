import { Injectable, Logger } from "@nestjs/common";
import type sharp from "sharp";
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
  private sharpInstance: typeof sharp | null = null;

  constructor(private readonly r2: R2Service) {}

  /**
   * Lazily load sharp (and native libvips) only when an image upload occurs,
   * keeping baseline server RSS low.
   */
  private async getSharp(): Promise<typeof sharp> {
    if (!this.sharpInstance) {
      const mod = await import("sharp");
      const instance = mod.default;
      // Disable libvips operation cache and limit worker threads to avoid native memory spikes
      instance.cache(false);
      instance.concurrency(1);
      this.sharpInstance = instance;
    }
    return this.sharpInstance;
  }

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
    _context: string,
  ): Promise<OptimizeResult> {
    const sharpFn = await this.getSharp();
    const meta = await sharpFn(buffer).metadata();
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

    // Generate and upload all variants sequentially without holding cloned pipelines
    for (const w of widths) {
      const avifBuf = await sharpFn(buffer)
        .resize(w, null, { withoutEnlargement: true })
        .avif({ quality: 45 })
        .toBuffer();
      await this.r2.putObject(`${key}-${w}.avif`, avifBuf, "image/avif");

      const webpBuf = await sharpFn(buffer)
        .resize(w, null, { withoutEnlargement: true })
        .webp({ quality: 70 })
        .toBuffer();
      await this.r2.putObject(`${key}-${w}.webp`, webpBuf, "image/webp");

      const jpgBuf = await sharpFn(buffer)
        .resize(w, null, { withoutEnlargement: true })
        .jpeg({ quality: 75, mozjpeg: true })
        .toBuffer();
      await this.r2.putObject(`${key}-${w}.jpg`, jpgBuf, "image/jpeg");
    }

    // Generate blur placeholder (24px wide)
    const placeholderBuf = await sharpFn(buffer)
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
