import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { CharactersModule } from "./characters/characters.module";
import { ContentRegistryModule } from "./content-registry/content-registry.module";
import { DashboardModule } from "./dashboard/dashboard.module";
import { DbModule } from "./db/db.module";
import { EpisodeInvitesModule } from "./episode-invites/episode-invites.module";
import { EpisodePlayersModule } from "./episode-players/episode-players.module";
import { EpisodesModule } from "./episodes/episodes.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { ReadingItemsModule } from "./reading-items/reading-items.module";
import { ReadingProgressModule } from "./reading-progress/reading-progress.module";
import { SessionRecapsModule } from "./session-recaps/session-recaps.module";
import { SessionsModule } from "./sessions/sessions.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    DbModule,
    AuthModule,
    CharactersModule,
    EpisodesModule,
    ContentRegistryModule,
    ReadingItemsModule,
    ReadingProgressModule,
    SessionsModule,
    SessionRecapsModule,
    UsersModule,
    EpisodePlayersModule,
    EpisodeInvitesModule,
    DashboardModule,
    NotificationsModule,
  ],
})
export class AppModule {}
