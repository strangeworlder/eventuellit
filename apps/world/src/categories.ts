import type { IconName } from "@repo/ui/components/Icon";

export interface WorldCategory {
  id: string;
  title: string;
  description: string;
  icon: IconName;
  /**
   * When true, the World Hub links to the category index page instead of jumping
   * straight to the first entry. Use for categories with a rich hub landing (e.g. faktiot).
   */
  useHubIndex?: boolean;
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
  {
    id: "faktiot",
    title: "Faktiot",
    description: "Kynnyksen kolme suurvaltaa ja niiden alafaktiot — poliittinen atlas.",
    icon: "flame",
    useHubIndex: true,
  },
];
