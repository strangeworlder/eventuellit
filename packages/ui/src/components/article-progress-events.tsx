import type { ArticleSectionAnchor } from "./article-navigation-utils";

export const ARTICLE_PROGRESS_EVENT = "eventuellit:article-progress";
export const ARTICLE_JUMP_EVENT = "eventuellit:article-jump";

export type ArticleProgressSource = "ruleset" | "episodes";

export interface ArticleProgressPayload {
  source: ArticleProgressSource;
  route: string;
  sections: ArticleSectionAnchor[];
  progress: number;
  activeSectionId?: string;
  markerPositions: Record<string, number>;
}

export interface ArticleJumpPayload {
  source: ArticleProgressSource;
  sectionId: string;
}
