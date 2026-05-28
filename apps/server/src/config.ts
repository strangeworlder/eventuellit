function withDefault(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  isProduction: process.env.NODE_ENV === "production",
  port: Number(process.env.PORT) || 3000,
  databaseUrl: withDefault(
    "DATABASE_URL",
    "postgresql://root:password123@localhost:5432/eventuellit",
  ),
  jwtSecret: (() => {
    const s = process.env.JWT_SECRET;
    if (!s && process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET must be set in production");
    }
    return s || "dev-secret-change-in-production";
  })(),
  corsOrigins: withDefault(
    "CORS_ORIGINS",
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004",
  ),
  magicLinkBaseUrl: withDefault("MAGIC_LINK_BASE_URL", "http://localhost:3003"),
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  r2: {
    endpoint: process.env.R2_ENDPOINT ?? "",
    accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
    bucketName: withDefault("R2_BUCKET_NAME", "eventuellit-media"),
    publicUrl: process.env.R2_PUBLIC_URL ?? "",
  },
} as const;
