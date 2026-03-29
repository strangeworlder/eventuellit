import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

function getCorsOrigins() {
  const configuredOrigins =
    process.env.CORS_ORIGINS ||
    "http://localhost:3000,http://localhost:3001,http://localhost:3002,http://localhost:3003,http://localhost:3004";

  const origins = configuredOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);

  if (origins.length === 0) {
    throw new Error("CORS_ORIGINS must include at least one origin");
  }

  return origins;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
