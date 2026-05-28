import { Injectable, Logger } from "@nestjs/common";
import {
	DeleteObjectCommand,
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { config } from "../config";

@Injectable()
export class R2Service {
	private readonly logger = new Logger(R2Service.name);
	private readonly client: S3Client;
	private readonly bucket: string;
	private readonly _publicUrl: string;

	constructor() {
		this.bucket = config.r2.bucketName;
		this._publicUrl = config.r2.publicUrl;

		this.client = new S3Client({
			region: "auto",
			endpoint: config.r2.endpoint,
			credentials: {
				accessKeyId: config.r2.accessKeyId,
				secretAccessKey: config.r2.secretAccessKey,
			},
		});
	}

	/** Returns true if R2 credentials are configured. */
	isConfigured(): boolean {
		return !!(config.r2.endpoint && config.r2.accessKeyId);
	}

	/** Generate a presigned PUT URL for direct client upload. */
	async getPresignedUploadUrl(
		key: string,
		contentType: string,
	): Promise<string> {
		const command = new PutObjectCommand({
			Bucket: this.bucket,
			Key: key,
			ContentType: contentType,
		});

		const url = await getSignedUrl(this.client, command, { expiresIn: 120 });
		this.logger.log(`Generated presigned upload URL for key: ${key}`);
		return url;
	}

	/** Delete an object from R2. */
	async deleteObject(key: string): Promise<void> {
		const command = new DeleteObjectCommand({
			Bucket: this.bucket,
			Key: key,
		});

		await this.client.send(command);
		this.logger.log(`Deleted object: ${key}`);
	}

	/** Build a public URL for an R2 object. */
	getPublicUrl(key: string): string {
		const base = this._publicUrl.replace(/\/+$/, "");
		return `${base}/${key}`;
	}

	/** Upload a buffer directly to R2 (server-side, no presigned URL). */
	async putObject(key: string, body: Buffer, contentType: string): Promise<void> {
		await this.client.send(
			new PutObjectCommand({
				Bucket: this.bucket,
				Key: key,
				Body: body,
				ContentType: contentType,
			}),
		);
		this.logger.log(`Uploaded object: ${key} (${(body.length / 1024).toFixed(1)} KB)`);
	}

	/** Download an object from R2. Returns null if not found. */
	async getObject(key: string): Promise<Buffer | null> {
		try {
			const response = await this.client.send(
				new GetObjectCommand({ Bucket: this.bucket, Key: key }),
			);
			if (!response.Body) return null;
			const chunks: Uint8Array[] = [];
			for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
				chunks.push(chunk);
			}
			return Buffer.concat(chunks);
		} catch (err: any) {
			if (err?.name === "NoSuchKey" || err?.$metadata?.httpStatusCode === 404) {
				return null;
			}
			throw err;
		}
	}
}
