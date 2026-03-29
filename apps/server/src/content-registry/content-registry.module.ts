import { Module } from "@nestjs/common";
import { ContentRegistryService } from "./content-registry.service";

@Module({
  providers: [ContentRegistryService],
  exports: [ContentRegistryService],
})
export class ContentRegistryModule {}
