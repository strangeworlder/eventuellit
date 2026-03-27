import type { IconName } from "@repo/ui/components/Icon";

export interface WorldCategory {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

/**
 * Registry of all world content categories.
 * Each entry corresponds to a subdirectory under `src/content/` and a URL segment under `/world/`.
 *
 * Adding a new category:
 * 1. Create `src/content/<id>/` and add markdown files with frontmatter `category: <id>`.
 * 2. Add an entry here.
 * 3. Routing and discovery are automatic.
 */
export const worldCategories: WorldCategory[] = [
  {
    id: "kynnys",
    title: "Kynnys",
    description: "Avaruusasemaverkosto — 20 asemaa täynnä faktioita, kauppaa ja salaisuuksia.",
    icon: "compass",
  },
];
