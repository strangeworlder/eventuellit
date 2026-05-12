import { Module } from "@nestjs/common";
import { AuthModule } from "../auth/auth.module";
import { ImageOptimizerService } from "./image-optimizer.service";
import { MediaController } from "./media.controller";
import { MediaService } from "./media.service";
import { R2Service } from "./r2.service";

@Module({
	imports: [AuthModule],
	controllers: [MediaController],
	providers: [ImageOptimizerService, MediaService, R2Service],
	exports: [MediaService, R2Service],
})
export class MediaModule {}
