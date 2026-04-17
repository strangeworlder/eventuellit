import type { FactionColor } from "@repo/ui/components/FactionBadge";
import type { IconName } from "@repo/ui/components/Icon";

export interface FactionDef {
  id: string;
  name: string;
  color: FactionColor;
  icon: IconName;
  /** Primary parent faction id — undefined for the three main factions */
  parent?: string;
  /**
   * Secondary color identity for hybrid factions.
   * When set, this faction visually blends two main faction identities.
   */
  secondaryColor?: FactionColor;
  /**
   * Secondary parent faction id for hybrid factions.
   * Combined with `parent`, expresses dual lineage.
   */
  secondaryParent?: string;
}

/**
 * Canonical registry of all factions and subfactions in Kynnys.
 * Color assignments:
 *   primary (coral)   → Tuhkan puolue and its subfactions
 *   secondary (teal)  → KW-konsortio and its subfactions
 *   accent (blue)     → Ekklesia and its subfactions
 *
 * Hybrid factions blend two main faction identities via color + secondaryColor.
 */
export const factions: FactionDef[] = [
  // ── Main factions ────────────────────────────────────────────────────────
  { id: "tuhkan-puolue", name: "Tuhkan puolue", color: "primary", icon: "flame" },
  { id: "kw-konsortio", name: "KW-konsortio", color: "secondary", icon: "cog" },
  { id: "ekklesia", name: "Ekklesia", color: "accent", icon: "drama" },

  // ── Tuhkan puolue subfactions ─────────────────────────────────────────
  {
    id: "muotinvalajat",
    name: "Muotinvalajat",
    color: "primary",
    icon: "sparkles",
    parent: "tuhkan-puolue",
  },
  {
    id: "heimolaiset",
    name: "Heimolaiset",
    color: "primary",
    icon: "globe",
    parent: "tuhkan-puolue",
  },
  { id: "erottajat", name: "Erottajat", color: "primary", icon: "shield", parent: "tuhkan-puolue" },

  // ── KW-konsortio subfactions ──────────────────────────────────────────
  {
    id: "ratasvartio",
    name: "Ratasvartio",
    color: "secondary",
    icon: "shield-alert",
    parent: "kw-konsortio",
  },
  {
    id: "logiikan-inkvisitio",
    name: "Logiikan Inkvisitio",
    color: "secondary",
    icon: "book",
    parent: "kw-konsortio",
  },
  {
    id: "deterministit",
    name: "Deterministit",
    color: "secondary",
    icon: "compass",
    parent: "kw-konsortio",
  },

  // ── Ekklesia subfactions ──────────────────────────────────────────────
  {
    id: "pyhan-tragedian-lapset",
    name: "Pyh\u00e4n Tragedian lapset",
    color: "accent",
    icon: "sparkles",
    parent: "ekklesia",
  },
  { id: "verhonkutojat", name: "Verhonkutojat", color: "accent", icon: "map", parent: "ekklesia" },
  { id: "haaskalinnut", name: "Haaskalinnut", color: "accent", icon: "zap", parent: "ekklesia" },

  // ── Hybrid factions ───────────────────────────────────────────────────
  {
    id: "kokemuspuolue",
    name: "Kokemuspuolue",
    color: "primary",
    secondaryColor: "accent",
    icon: "heart-pulse",
    parent: "tuhkan-puolue",
    secondaryParent: "ekklesia",
  },
];

export function getFactionById(id: string): FactionDef | undefined {
  return factions.find((f) => f.id === id);
}

export function getMainFactions(): FactionDef[] {
  return factions.filter((f) => !f.parent && !f.secondaryColor);
}

export function getSubfactions(parentId: string): FactionDef[] {
  return factions.filter((f) => f.parent === parentId && !f.secondaryColor);
}

/** Returns all hybrid factions — those with both a primary and secondary color identity. */
export function getHybridFactions(): FactionDef[] {
  return factions.filter((f) => !!f.secondaryColor);
}

/** Returns true if a faction is a hybrid (blends two main faction identities). */
export function isHybridFaction(def: FactionDef): boolean {
  return !!def.secondaryColor;
}
