export interface ContentItem {
  id: string;
  title: string;
  url: string;
  contentType: "world" | "ruleset";
  description?: string;
  factionIds?: string[];
}

export interface StationEntry extends ContentItem {
  contentType: "world";
  subtype: "station";
  rulingFaction?: string;
  disruptingFactions: string[];
}

export interface FactionEntry extends ContentItem {
  contentType: "world";
  subtype: "faction";
  parentFaction?: string;
}

export interface RulesetEntry extends ContentItem {
  contentType: "ruleset";
}

export const STATIONS: StationEntry[] = [
  {
    id: "01-seula",
    title: "Seula",
    url: "/world/01-seula",
    contentType: "world",
    subtype: "station",
    description: "Keskusasema – Kynnyksen kauppasatama ja solmupiste.",
    rulingFaction: undefined,
    disruptingFactions: ["verhonkutojat"],
  },
  {
    id: "02-syke",
    title: "Syke",
    url: "/world/02-syke",
    contentType: "world",
    subtype: "station",
    description: "Reaktori – Kynnyksen energiakeskus ja luostari.",
    rulingFaction: "kw-konsortio",
    disruptingFactions: ["ekklesia"],
  },
  {
    id: "03-verso",
    title: "Verso",
    url: "/world/03-verso",
    contentType: "world",
    subtype: "station",
    description: "Biodomi – Kynnyksen ruoantuotantoasema.",
    rulingFaction: "muotinvalajat",
    disruptingFactions: ["deterministit"],
  },
  {
    id: "04-alasin",
    title: "Alasin",
    url: "/world/04-alasin",
    contentType: "world",
    subtype: "station",
    description: "Telakka – Kynnyksen raskaan korjauksen teollisuusasema.",
    rulingFaction: "kw-konsortio",
    disruptingFactions: ["tuhkan-puolue"],
  },
  {
    id: "05-louhos",
    title: "Louhos",
    url: "/world/05-louhos",
    contentType: "world",
    subtype: "station",
    description: "Kaivosasema – hajonnut raaka-ainekeskus.",
    rulingFaction: undefined,
    disruptingFactions: ["haaskalinnut"],
  },
  {
    id: "06-akseli",
    title: "Akseli",
    url: "/world/06-akseli",
    contentType: "world",
    subtype: "station",
    description: "KW-konsortio HQ – Kynnyksen hallintotorni ja logiikkakeskus.",
    rulingFaction: "kw-konsortio",
    disruptingFactions: ["logiikan-inkvisitio"],
  },
  {
    id: "07-katedraali",
    title: "Katedraali",
    url: "/world/07-katedraali",
    contentType: "world",
    subtype: "station",
    description: "Ekklesian sydän – temppeli, teatteri ja propagandakeskus.",
    rulingFaction: "ekklesia",
    disruptingFactions: ["pyhan-tragedian-lapset"],
  },
  {
    id: "08-pesa",
    title: "Pesä",
    url: "/world/08-pesa",
    contentType: "world",
    subtype: "station",
    description: "Tuhkan puolueen koti – vanhakaupunki ja asuinalue.",
    rulingFaction: "tuhkan-puolue",
    disruptingFactions: ["erottajat"],
  },
  {
    id: "09-kilpi",
    title: "Kilpi",
    url: "/world/09-kilpi",
    contentType: "world",
    subtype: "station",
    description: "Polttopiste – murtunut vartio Kynnyksen reunalla.",
    rulingFaction: undefined,
    disruptingFactions: [],
  },
  {
    id: "10-kuiskaus",
    title: "Kuiskaus",
    url: "/world/10-kuiskaus",
    contentType: "world",
    subtype: "station",
    description: "Polttopiste – hajonnut viestintäkeskus.",
    rulingFaction: "logiikan-inkvisitio",
    disruptingFactions: ["erottajat"],
  },
  {
    id: "11-evoluutio",
    title: "Evoluutio",
    url: "/world/11-evoluutio",
    contentType: "world",
    subtype: "station",
    description: "Polttopiste – hajonnut tutkimuskeskus ja kybernetiikan basaari.",
    rulingFaction: "verhonkutojat",
    disruptingFactions: ["muotinvalajat"],
  },
  {
    id: "12-laki",
    title: "Laki",
    url: "/world/12-laki",
    contentType: "world",
    subtype: "station",
    description: "Oikeuslaitos – Kynnyksen sopimuskeskus.",
    rulingFaction: "logiikan-inkvisitio",
    disruptingFactions: ["pyhan-tragedian-lapset"],
  },
  {
    id: "13-vaaka",
    title: "Vaaka",
    url: "/world/13-vaaka",
    contentType: "world",
    subtype: "station",
    description: "Areena – Kynnyksen sotilasakatemia ja kaksintaistelujen kenttä.",
    rulingFaction: "ratasvartio",
    disruptingFactions: ["verhonkutojat"],
  },
  {
    id: "14-hakki",
    title: "Häkki",
    url: "/world/14-hakki",
    contentType: "world",
    subtype: "station",
    description: "Pyhän Tragedian lapset – veriurheilun ja uhkapelin asema.",
    rulingFaction: "pyhan-tragedian-lapset",
    disruptingFactions: ["heimolaiset"],
  },
  {
    id: "15-verkko",
    title: "Verkko",
    url: "/world/15-verkko",
    contentType: "world",
    subtype: "station",
    description: "Observatorio – Kynnyksen valvontakeskus.",
    rulingFaction: "heimolaiset",
    disruptingFactions: ["deterministit"],
  },
  {
    id: "16-ikoni",
    title: "Ikoni",
    url: "/world/16-ikoni",
    contentType: "world",
    subtype: "station",
    description: "Studio – Kynnyksen mediakeskus.",
    rulingFaction: "verhonkutojat",
    disruptingFactions: ["logiikan-inkvisitio"],
  },
  {
    id: "17-poyta",
    title: "Pöytä",
    url: "/world/17-poyta",
    contentType: "world",
    subtype: "station",
    description: "Neuvottelu – diplomatian ja sovittelun asema.",
    rulingFaction: "erottajat",
    disruptingFactions: ["ratasvartio"],
  },
  {
    id: "18-siemen",
    title: "Siemen",
    url: "/world/18-siemen",
    contentType: "world",
    subtype: "station",
    description: "Akatemia – Kynnyksen koulutusasema ja maatila.",
    rulingFaction: "muotinvalajat",
    disruptingFactions: ["heimolaiset"],
  },
  {
    id: "19-krypta",
    title: "Krypta",
    url: "/world/19-krypta",
    contentType: "world",
    subtype: "station",
    description: "Museo – pyhäkkö, arkisto ja haaskalinnuen koti.",
    rulingFaction: "haaskalinnut",
    disruptingFactions: [],
  },
  {
    id: "20-tori",
    title: "Tori",
    url: "/world/20-tori",
    contentType: "world",
    subtype: "station",
    description: "Basaari – Kynnyksen musta pörssi ja kierrätyskeskus.",
    rulingFaction: "heimolaiset",
    disruptingFactions: ["haaskalinnut"],
  },
];

export const FACTIONS: FactionEntry[] = [
  {
    id: "tuhkan-puolue",
    title: "Tuhkan puolue",
    url: "/world/tuhkan-puolue",
    contentType: "world",
    subtype: "faction",
  },
  {
    id: "kw-konsortio",
    title: "KW-konsortio",
    url: "/world/kw-konsortio",
    contentType: "world",
    subtype: "faction",
  },
  {
    id: "ekklesia",
    title: "Ekklesia",
    url: "/world/ekklesia",
    contentType: "world",
    subtype: "faction",
  },
  {
    id: "muotinvalajat",
    title: "Muotinvalajat",
    url: "/world/muotinvalajat",
    contentType: "world",
    subtype: "faction",
    parentFaction: "tuhkan-puolue",
  },
  {
    id: "heimolaiset",
    title: "Heimolaiset",
    url: "/world/heimolaiset",
    contentType: "world",
    subtype: "faction",
    parentFaction: "tuhkan-puolue",
  },
  {
    id: "erottajat",
    title: "Erottajat",
    url: "/world/erottajat",
    contentType: "world",
    subtype: "faction",
    parentFaction: "tuhkan-puolue",
  },
  {
    id: "ratasvartio",
    title: "Ratasvartio",
    url: "/world/ratasvartio",
    contentType: "world",
    subtype: "faction",
    parentFaction: "kw-konsortio",
  },
  {
    id: "logiikan-inkvisitio",
    title: "Logiikan Inkvisitio",
    url: "/world/logiikan-inkvisitio",
    contentType: "world",
    subtype: "faction",
    parentFaction: "kw-konsortio",
  },
  {
    id: "deterministit",
    title: "Deterministit",
    url: "/world/deterministit",
    contentType: "world",
    subtype: "faction",
    parentFaction: "kw-konsortio",
  },
  {
    id: "pyhan-tragedian-lapset",
    title: "Pyhän Tragedian lapset",
    url: "/world/pyhan-tragedian-lapset",
    contentType: "world",
    subtype: "faction",
    parentFaction: "ekklesia",
  },
  {
    id: "verhonkutojat",
    title: "Verhonkutojat",
    url: "/world/verhonkutojat",
    contentType: "world",
    subtype: "faction",
    parentFaction: "ekklesia",
  },
  {
    id: "haaskalinnut",
    title: "Haaskalinnut",
    url: "/world/haaskalinnut",
    contentType: "world",
    subtype: "faction",
    parentFaction: "ekklesia",
  },
];

export const RULESET_CHAPTERS: RulesetEntry[] = [
  {
    id: "johdanto",
    title: "Johdanto",
    url: "/ruleset/johdanto",
    contentType: "ruleset",
    description: "Pelin esittely ja yleiset periaatteet.",
  },
  {
    id: "mekaniikat",
    title: "Mekaniikat",
    url: "/ruleset/mekaniikat",
    contentType: "ruleset",
    description: "Pelimekaniikot: testit, taistelut, haitat ja kehitys.",
  },
  {
    id: "maailma",
    title: "Maailma",
    url: "/ruleset/maailma",
    contentType: "ruleset",
    description: "Kynnys-maailman säännöt ja lore-taustoitus.",
  },
];

export function getStationByTitle(title: string): StationEntry | undefined {
  const normalized = title.trim().toLowerCase();
  return STATIONS.find((s) => s.title.toLowerCase() === normalized);
}

export function getStationById(id: string): StationEntry | undefined {
  return STATIONS.find((s) => s.id === id);
}

export function getFactionById(id: string): FactionEntry | undefined {
  return FACTIONS.find((f) => f.id === id);
}
