import type { BadgeProps } from "@repo/ui/components/Badge";
import type { IconName } from "@repo/ui/components/Icon";

// ── Types ──

export type ChangeType = "feature" | "major" | "minor";

export interface ChangelogLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ChangelogItem {
  id: string;
  type: ChangeType;
  description: string;
  links?: ChangelogLink[];
}

export interface ChangelogEntry {
  version: string;
  date: string;
  title?: string;
  items: ChangelogItem[];
}

// ── Badge mapping ──

export const changeTypeMeta: Record<
  ChangeType,
  { label: string; badgeVariant: BadgeProps["variant"]; icon: IconName }
> = {
  feature: {
    label: "Uusi ominaisuus",
    badgeVariant: "highlight-solid",
    icon: "sparkles",
  },
  major: {
    label: "Merkittävä muutos",
    badgeVariant: "solid",
    icon: "zap",
  },
  minor: {
    label: "Pieni muutos",
    badgeVariant: "ghost",
    icon: "info",
  },
};

// ── Data ──

export const changelog: ChangelogEntry[] = [
  {
    version: "0.3.0",
    date: "2026-04-07",
    title: "Muutosloki ja uudet komponentit",
    items: [
      {
        id: "0.3.0-1",
        type: "feature",
        description: "Muutosloki-sivu lisätty. Näet nyt kaikki päivitykset yhdestä paikasta.",
        links: [{ label: "Muutosloki", href: "/muutosloki" }],
      },
      {
        id: "0.3.0-2",
        type: "feature",
        description: "Uudet Accordion- ja Pagination-komponentit lisätty komponenttikirjastoon.",
      },
      {
        id: "0.3.0-3",
        type: "minor",
        description: "Uudet ikonit (chevron-down, file-text) lisätty ikonivalikoimaan.",
      },
    ],
  },
  {
    version: "0.2.0",
    date: "2026-03-15",
    title: "Maailman asemat",
    items: [
      {
        id: "0.2.0-1",
        type: "feature",
        description: "Maailman asemat ja niiden faktiot päivitetty uuteen 9-alafaktion taksonomiaan.",
        links: [{ label: "Maailma", href: "/world" }],
      },
      {
        id: "0.2.0-2",
        type: "major",
        description: "Tietosuojaseloste lisätty sovellukseen.",
        links: [{ label: "Tietosuoja", href: "/tietosuoja" }],
      },
      {
        id: "0.2.0-3",
        type: "minor",
        description: "Pieniä tyylillisiä korjauksia sivupaneeliin.",
      },
      {
        id: "0.2.0-4",
        type: "minor",
        description: "Ladataustilan viesti suomennettu.",
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2026-02-01",
    title: "Ensimmäinen julkaisu",
    items: [
      {
        id: "0.1.0-1",
        type: "feature",
        description: "Hahmopaja — luo ja muokkaa hahmoja arkkityypeillä ja ominaisuuksilla.",
        links: [{ label: "Hahmopaja", href: "/generator" }],
      },
      {
        id: "0.1.0-2",
        type: "feature",
        description: "Sääntökirja — selaa pelin sääntöjä selkeässä artikkeliformaatissa.",
        links: [{ label: "Sääntökirja", href: "/ruleset" }],
      },
      {
        id: "0.1.0-3",
        type: "feature",
        description: "Jaksot ja maailma — tutustu pelin jaksoihin ja maailmaan.",
      },
      {
        id: "0.1.0-4",
        type: "major",
        description: "Kirjautuminen magic link -menetelmällä.",
      },
      {
        id: "0.1.0-5",
        type: "minor",
        description: "Sivupaneelin animaatiot ja responsiivisuus.",
      },
      {
        id: "0.1.0-6",
        type: "minor",
        description: "Tummaan teemaan perustuva väripaletti.",
      },
    ],
  },
];
