import type { S3Client } from "@aws-sdk/client-s3";
import { Injectable, Logger } from "@nestjs/common";
import { config } from "../config";

@Injectable()
export class R2Service {
  private readonly logger = new Logger(R2Service.name);
  private client: S3Client | null = null;
  private s3Module: typeof import("@aws-sdk/client-s3") | null = null;
  private readonly bucket: string;
  private readonly _publicUrl: string;

  constructor() {
    this.bucket = config.r2.bucketName;
    this._publicUrl = config.r2.publicUrl;
  }

  /** Lazily load @aws-sdk/client-s3 and instantiate S3Client on first R2 operation. */
  private async getS3(): Promise<{
    client: S3Client;
    s3: typeof import("@aws-sdk/client-s3");
  }> {
    if (!this.s3Module) {
      this.s3Module = await import("@aws-sdk/client-s3");
    }
    if (!this.client) {
      this.client = new this.s3Module.S3Client({
        region: "auto",
        endpoint: config.r2.endpoint,
        credentials: {
          accessKeyId: config.r2.accessKeyId,
          secretAccessKey: config.r2.secretAccessKey,
        },
      });
    }
    return { client: this.client, s3: this.s3Module };
  }

  /** Returns true if R2 credentials are configured. */
  isConfigured(): boolean {
    return !!(config.r2.endpoint && config.r2.accessKeyId);
  }

  /** Generate a presigned PUT URL for direct client upload. */
  async getPresignedUploadUrl(key: string, contentType: string): Promise<string> {
    const [{ client, s3 }, { getSignedUrl }] = await Promise.all([
      this.getS3(),
      import("@aws-sdk/s3-request-presigner"),
    ]);

    const command = new s3.PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(client, command, { expiresIn: 120 });
    this.logger.log(`Generated presigned upload URL for key: ${key}`);
    return url;
  }

  /** Delete an object from R2. */
  async deleteObject(key: string): Promise<void> {
    const { client, s3 } = await this.getS3();
    const command = new s3.DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    });

    await client.send(command);
    this.logger.log(`Deleted object: ${key}`);
  }

  /** Build a public URL for an R2 object. */
  getPublicUrl(key: string): string {
    const base = this._publicUrl.replace(/\/+$/, "");
    return `${base}/${key}`;
  }

  /** Upload a buffer directly to R2 (server-side, no presigned URL). */
  async putObject(key: string, body: Buffer, contentType: string): Promise<void> {
    const { client, s3 } = await this.getS3();
    await client.send(
      new s3.PutObjectCommand({
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
    const { client, s3 } = await this.getS3();
    try {
      const response = await client.send(
        new s3.GetObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (!response.Body) return null;
      const chunks: Uint8Array[] = [];
      for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    } catch (err) {
      const awsErr = err as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (awsErr?.name === "NoSuchKey" || awsErr?.$metadata?.httpStatusCode === 404) {
        return null;
      }
      throw err;
    }
  }
}
