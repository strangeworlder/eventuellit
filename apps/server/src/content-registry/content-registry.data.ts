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
    url: "/world/kynnys/01-seula",
    contentType: "world",
    subtype: "station",
    description: "Keskusasema – Kynnyksen kauppasatama ja solmupiste.",
    rulingFaction: undefined,
    disruptingFactions: ["verhonkutojat"],
  },
  {
    id: "02-syke",
    title: "Syke",
    url: "/world/kynnys/02-syke",
    contentType: "world",
    subtype: "station",
    description: "Reaktori – Kynnyksen energiakeskus ja luostari.",
    rulingFaction: "kw-konsortio",
    disruptingFactions: ["ekklesia"],
  },
  {
    id: "03-verso",
    title: "Verso",
    url: "/world/kynnys/03-verso",
    contentType: "world",
    subtype: "station",
    description: "Biodomi – Kynnyksen ruoantuotantoasema.",
    rulingFaction: "muotinvalajat",
    disruptingFactions: ["deterministit"],
  },
  {
    id: "04-alasin",
    title: "Alasin",
    url: "/world/kynnys/04-alasin",
    contentType: "world",
    subtype: "station",
    description: "Telakka – Kynnyksen raskaan korjauksen teollisuusasema.",
    rulingFaction: "kw-konsortio",
    disruptingFactions: ["tuhkan-puolue"],
  },
  {
    id: "05-louhos",
    title: "Louhos",
    url: "/world/kynnys/05-louhos",
    contentType: "world",
    subtype: "station",
    description: "Kaivosasema – hajonnut raaka-ainekeskus.",
    rulingFaction: undefined,
    disruptingFactions: ["haaskalinnut"],
  },
  {
    id: "06-akseli",
    title: "Akseli",
    url: "/world/kynnys/06-akseli",
    contentType: "world",
    subtype: "station",
    description: "KW-konsortio HQ – Kynnyksen hallintotorni ja logiikkakeskus.",
    rulingFaction: "kw-konsortio",
    disruptingFactions: ["logiikan-inkvisitio"],
  },
  {
    id: "07-katedraali",
    title: "Katedraali",
    url: "/world/kynnys/07-katedraali",
    contentType: "world",
    subtype: "station",
    description: "Ekklesian sydän – temppeli, teatteri ja propagandakeskus.",
    rulingFaction: "ekklesia",
    disruptingFactions: ["pyhan-tragedian-lapset"],
  },
  {
    id: "08-pesa",
    title: "Pesä",
    url: "/world/kynnys/08-pesa",
    contentType: "world",
    subtype: "station",
    description: "Tuhkan puolueen koti – vanhakaupunki ja asuinalue.",
    rulingFaction: "tuhkan-puolue",
    disruptingFactions: ["erottajat"],
  },
  {
    id: "09-kilpi",
    title: "Kilpi",
    url: "/world/kynnys/09-kilpi",
    contentType: "world",
    subtype: "station",
    description: "Polttopiste – murtunut vartio Kynnyksen reunalla.",
    rulingFaction: undefined,
    disruptingFactions: [],
  },
  {
    id: "10-kuiskaus",
    title: "Kuiskaus",
    url: "/world/kynnys/10-kuiskaus",
    contentType: "world",
    subtype: "station",
    description: "Polttopiste – hajonnut viestintäkeskus.",
    rulingFaction: "logiikan-inkvisitio",
    disruptingFactions: ["erottajat"],
  },
  {
    id: "11-evoluutio",
    title: "Evoluutio",
    url: "/world/kynnys/11-evoluutio",
    contentType: "world",
    subtype: "station",
    description: "Polttopiste – hajonnut tutkimuskeskus ja kybernetiikan basaari.",
    rulingFaction: "verhonkutojat",
    disruptingFactions: ["muotinvalajat"],
  },
  {
    id: "12-laki",
    title: "Laki",
    url: "/world/kynnys/12-laki",
    contentType: "world",
    subtype: "station",
    description: "Oikeuslaitos – Kynnyksen sopimuskeskus.",
    rulingFaction: "logiikan-inkvisitio",
    disruptingFactions: ["pyhan-tragedian-lapset"],
  },
  {
    id: "13-vaaka",
    title: "Vaaka",
    url: "/world/kynnys/13-vaaka",
    contentType: "world",
    subtype: "station",
    description: "Areena – Kynnyksen sotilasakatemia ja kaksintaistelujen kenttä.",
    rulingFaction: "ratasvartio",
    disruptingFactions: ["verhonkutojat"],
  },
  {
    id: "14-hakki",
    title: "Häkki",
    url: "/world/kynnys/14-hakki",
    contentType: "world",
    subtype: "station",
    description: "Pyhän Tragedian lapset – veriurheilun ja uhkapelin asema.",
    rulingFaction: "pyhan-tragedian-lapset",
    disruptingFactions: ["heimolaiset"],
  },
  {
    id: "15-verkko",
    title: "Verkko",
    url: "/world/kynnys/15-verkko",
    contentType: "world",
    subtype: "station",
    description: "Observatorio – Kynnyksen valvontakeskus.",
    rulingFaction: "heimolaiset",
    disruptingFactions: ["deterministit"],
  },
  {
    id: "16-ikoni",
    title: "Ikoni",
    url: "/world/kynnys/16-ikoni",
    contentType: "world",
    subtype: "station",
    description: "Studio – Kynnyksen mediakeskus.",
    rulingFaction: "verhonkutojat",
    disruptingFactions: ["logiikan-inkvisitio"],
  },
  {
    id: "17-poyta",
    title: "Pöytä",
    url: "/world/kynnys/17-poyta",
    contentType: "world",
    subtype: "station",
    description: "Neuvottelu – diplomatian ja sovittelun asema.",
    rulingFaction: "erottajat",
    disruptingFactions: ["ratasvartio"],
  },
  {
    id: "18-siemen",
    title: "Siemen",
    url: "/world/kynnys/18-siemen",
    contentType: "world",
    subtype: "station",
    description: "Akatemia – Kynnyksen koulutusasema ja maatila.",
    rulingFaction: "muotinvalajat",
    disruptingFactions: ["heimolaiset"],
  },
  {
    id: "19-krypta",
    title: "Krypta",
    url: "/world/kynnys/19-krypta",
    contentType: "world",
    subtype: "station",
    description: "Museo – pyhäkkö, arkisto ja haaskalinnuen koti.",
    rulingFaction: "haaskalinnut",
    disruptingFactions: [],
  },
  {
    id: "20-tori",
    title: "Tori",
    url: "/world/kynnys/20-tori",
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
    url: "/world/faktiot/tuhkan-puolue",
    contentType: "world",
    subtype: "faction",
  },
  {
    id: "kw-konsortio",
    title: "KW-konsortio",
    url: "/world/faktiot/kw-konsortio",
    contentType: "world",
    subtype: "faction",
  },
  {
    id: "ekklesia",
    title: "Ekklesia",
    url: "/world/faktiot/ekklesia",
    contentType: "world",
    subtype: "faction",
  },
  {
    id: "muotinvalajat",
    title: "Muotinvalajat",
    url: "/world/faktiot/muotinvalajat",
    contentType: "world",
    subtype: "faction",
    parentFaction: "tuhkan-puolue",
  },
  {
    id: "heimolaiset",
    title: "Heimolaiset",
    url: "/world/faktiot/heimolaiset",
    contentType: "world",
    subtype: "faction",
    parentFaction: "tuhkan-puolue",
  },
  {
    id: "erottajat",
    title: "Erottajat",
    url: "/world/faktiot/erottajat",
    contentType: "world",
    subtype: "faction",
    parentFaction: "tuhkan-puolue",
  },
  {
    id: "ratasvartio",
    title: "Ratasvartio",
    url: "/world/faktiot/ratasvartio",
    contentType: "world",
    subtype: "faction",
    parentFaction: "kw-konsortio",
  },
  {
    id: "logiikan-inkvisitio",
    title: "Logiikan Inkvisitio",
    url: "/world/faktiot/logiikan-inkvisitio",
    contentType: "world",
    subtype: "faction",
    parentFaction: "kw-konsortio",
  },
  {
    id: "deterministit",
    title: "Deterministit",
    url: "/world/faktiot/deterministit",
    contentType: "world",
    subtype: "faction",
    parentFaction: "kw-konsortio",
  },
  {
    id: "pyhan-tragedian-lapset",
    title: "Pyhän Tragedian lapset",
    url: "/world/faktiot/pyhan-tragedian-lapset",
    contentType: "world",
    subtype: "faction",
    parentFaction: "ekklesia",
  },
  {
    id: "verhonkutojat",
    title: "Verhonkutojat",
    url: "/world/faktiot/verhonkutojat",
    contentType: "world",
    subtype: "faction",
    parentFaction: "ekklesia",
  },
  {
    id: "haaskalinnut",
    title: "Haaskalinnut",
    url: "/world/faktiot/haaskalinnut",
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
