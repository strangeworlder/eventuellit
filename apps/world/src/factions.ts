import type { FactionColor } from "@repo/ui/components/FactionBadge";
import type { IconName } from "@repo/ui/components/Icon";

export interface FactionDef {
    id: string;
    name: string;
    color: FactionColor;
    icon: IconName;
    /** Parent faction id — undefined for the three main factions */
    parent?: string;
}

/**
 * Canonical registry of all factions and subfactions in Kynnys.
 * Color assignments:
 *   primary (coral)   → Tuhkan puolue and its subfactions
 *   secondary (teal)  → KW-konsortio and its subfactions
 *   accent (blue)     → Ekklesia and its subfactions
 */
export const factions: FactionDef[] = [
    // ── Main factions ────────────────────────────────────────────────────────
    { id: "tuhkan-puolue",   name: "Tuhkan puolue",       color: "primary",   icon: "flame" },
    { id: "kw-konsortio",    name: "KW-konsortio",         color: "secondary", icon: "cog" },
    { id: "ekklesia",        name: "Ekklesia",             color: "accent",    icon: "drama" },

    // ── Tuhkan puolue subfactions ─────────────────────────────────────────
    { id: "muotinvalajat",   name: "Muotinvalajat",        color: "primary",   icon: "sparkles", parent: "tuhkan-puolue" },
    { id: "heimolaiset",     name: "Heimolaiset",          color: "primary",   icon: "globe",    parent: "tuhkan-puolue" },
    { id: "erottajat",       name: "Erottajat",            color: "primary",   icon: "shield",   parent: "tuhkan-puolue" },

    // ── KW-konsortio subfactions ──────────────────────────────────────────
    { id: "ratasvartio",         name: "Ratasvartio",          color: "secondary", icon: "shield-alert", parent: "kw-konsortio" },
    { id: "logiikan-inkvisitio", name: "Logiikan Inkvisitio",  color: "secondary", icon: "book",         parent: "kw-konsortio" },
    { id: "deterministit",       name: "Deterministit",       color: "secondary", icon: "compass",          parent: "ekklesia" },

    // ── Ekklesia subfactions ──────────────────────────────────────────────
    { id: "pyhan-tragedian-lapset", name: "Pyh\u00e4n Tragedian lapset", color: "accent", icon: "sparkles",   parent: "ekklesia" },
    { id: "verhonkutojat",          name: "Verhonkutojat",               color: "accent", icon: "map",        parent: "ekklesia" },
    { id: "haaskalinnut",           name: "Haaskalinnut",                color: "accent", icon: "zap",     parent: "kw-konsortio" },
];

export function getFactionById(id: string): FactionDef | undefined {
    return factions.find((f) => f.id === id);
}

export function getMainFactions(): FactionDef[] {
    return factions.filter((f) => !f.parent);
}

export function getSubfactions(parentId: string): FactionDef[] {
    return factions.filter((f) => f.parent === parentId);
}
