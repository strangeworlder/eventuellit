import { Injectable } from "@nestjs/common";
import {
  FACTIONS,
  RULESET_CHAPTERS,
  STATIONS,
  getFactionById,
  getStationByTitle,
} from "./content-registry.data";

export interface SuggestedItem {
  contentType: "world" | "ruleset";
  contentRef: string;
  title: string;
  description?: string;
  url: string;
  reason: string;
  autoSuggested: true;
}

@Injectable()
export class ContentRegistryService {
  getAllItems() {
    return {
      stations: STATIONS,
      factions: FACTIONS,
      rulesetChapters: RULESET_CHAPTERS,
    };
  }

  buildSuggestions(
    episode: {
      location?: string | null;
      content?: string | null;
      mechanicalAdditions?: string | null;
    },
    existingRefs: Set<string>,
  ): SuggestedItem[] {
    const suggestions: SuggestedItem[] = [];
    const seen = new Set<string>(existingRefs);

    const addSuggestion = (item: SuggestedItem) => {
      if (!seen.has(item.contentRef)) {
        seen.add(item.contentRef);
        suggestions.push(item);
      }
    };

    // 1. Core mechanics chapter — always suggest
    addSuggestion({
      contentType: "ruleset",
      contentRef: "mekaniikat",
      title: "Mekaniikat",
      description: "Pelimekaniikot: testit, taistelut, haitat ja kehitys.",
      url: "/ruleset/mekaniikat",
      reason: "Kaikille pelaajille",
      autoSuggested: true,
    });

    // 2. Station from episode location
    if (episode.location) {
      const station = getStationByTitle(episode.location);
      if (station) {
        addSuggestion({
          contentType: "world",
          contentRef: station.id,
          title: station.title,
          description: station.description,
          url: station.url,
          reason: `Jakson sijainti: ${station.title}`,
          autoSuggested: true,
        });

        // Suggest ruling faction of the station
        if (station.rulingFaction) {
          const faction = getFactionById(station.rulingFaction);
          if (faction) {
            addSuggestion({
              contentType: "world",
              contentRef: faction.id,
              title: faction.title,
              description: `Hallitseva faktio: ${station.title}`,
              url: faction.url,
              reason: `Hallitseva faktio asemalla ${station.title}`,
              autoSuggested: true,
            });
          }
        }

        // Suggest disrupting factions
        for (const disruptingId of station.disruptingFactions) {
          const faction = getFactionById(disruptingId);
          if (faction) {
            addSuggestion({
              contentType: "world",
              contentRef: faction.id,
              title: faction.title,
              description: `Aktivistifaktio: ${station.title}`,
              url: faction.url,
              reason: `Aktivistifaktio asemalla ${station.title}`,
              autoSuggested: true,
            });
          }
        }
      }
    }

    // 3. Faction mentions in episode content
    const contentToScan = [episode.content ?? "", episode.mechanicalAdditions ?? ""].join(" ");
    for (const faction of FACTIONS) {
      const nameMatch = contentToScan.toLowerCase().includes(faction.title.toLowerCase());
      const idMatch = contentToScan.toLowerCase().includes(faction.id.toLowerCase());
      if (nameMatch || idMatch) {
        addSuggestion({
          contentType: "world",
          contentRef: faction.id,
          title: faction.title,
          url: faction.url,
          reason: `Mainittu jakson sisällössä`,
          autoSuggested: true,
        });
      }
    }

    // 4. Station mentions in episode content (by name)
    for (const station of STATIONS) {
      const nameMatch = contentToScan.toLowerCase().includes(station.title.toLowerCase());
      if (nameMatch) {
        addSuggestion({
          contentType: "world",
          contentRef: station.id,
          title: station.title,
          description: station.description,
          url: station.url,
          reason: `Mainittu jakson sisällössä`,
          autoSuggested: true,
        });
      }
    }

    return suggestions;
  }
}
