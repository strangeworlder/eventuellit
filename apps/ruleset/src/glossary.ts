export type GlossaryCategory = "Mekaniikka" | "Hahmo" | "Taistelu" | "Vaurio" | "Kehitys";

export interface GlossaryEntry {
  term: string;
  definition: string;
  category: GlossaryCategory;
  /** Page ID in the ruleset (e.g. "mekaniikat") */
  sectionPageId?: string;
  /** H3 anchor ID within that page */
  sectionId?: string;
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  "Mekaniikka",
  "Hahmo",
  "Taistelu",
  "Vaurio",
  "Kehitys",
];

export const glossary: GlossaryEntry[] = [
  // ── Mekaniikka ──────────────────────────────────────────────────────────────
  {
    term: "Noppakoura",
    definition:
      "Toimintayksikkökoura, joka koostuu oletusarvoisesti viidestä d20-nopasta (5n20). Edustaa hahmosi rajallisia toimintamahdollisuuksia yhden tilanteen tai kierroksen aikana. Nopat jaetaan eri tekoihin tai panokstetaan yhteen suoritukseen.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },
  {
    term: "Akseli",
    definition:
      "Tehtävän yksittäinen ulottuvuus tai haaste. Pelinjohtaja määrittää toiminnalle yhden tai useamman akselin, jotka ratkaistaan samanaikaisesti. Akselin tulos on sille asetettujen noppien korkein silmäluku.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },
  {
    term: "Onnistumiskynnys",
    definition:
      "Akselin tulos, joka vaaditaan onnistumiseen. Oletusarvo on 13. Pelinjohtaja voi asettaa helpomman kynnyksen (9) poikkeuksellisen suotuisissa olosuhteissa tai vaikeamman (17) ääriolosuhteissa.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },
  {
    term: "Osumat",
    definition:
      "Vaihtoehtoinen onnistumistapa: kuinka monta akselille asetettua noppaa saavuttaa tai ylittää onnistumiskynnyksen. Käytetään kun säännöt tai pelinjohtaja pyytää laskemaan osumat tavallisen onnistumisen sijaan.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },
  {
    term: "Tuplat",
    definition:
      "Kriittinen onnistuminen: jos onnistut akselilla ja vähintään kaksi sille heitettyä noppaa näyttää samaa silmälukua, saavutat kriittisen onnistumisen. Tuo lisätietoa, suurempaa vauriota tai merkittävän tilannekohtaisen edun.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },
  {
    term: "Avustaminen",
    definition:
      "Yksi hahmo voi auttaa toista suorituksessa pelinjohtajan suostumuksella. Avustaja heittää sopivalla akselilla – onnistunut avustus antaa pääsuorittajalle +1n20 seuraavaan heittoon. Maksimissaan yksi noppa lisää per heitto.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },
  {
    term: "Ryhmätoiminta",
    definition:
      "Koko ryhmä jakaa noppansa yhteisille akseleille. Akselit vaativat tietyn määrän onnistumisia ryhmältä ennen kuin koko akseli lasketaan onnistumiseksi. Usein tarvitaan onnistumisia yhden ja yrittäjien lukumäärän väliltä.",
    category: "Mekaniikka",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-1-pelimekaniikka-noppakoura-ja-akselit",
  },

  // ── Hahmo ───────────────────────────────────────────────────────────────────
  {
    term: "Keho",
    definition:
      "Kehollinen kestokategoria. Kattaa Fysiikka- ja Nopeus-ominaisuudet. Keho-kesto alkaa 8:sta ja kasvaa molempien ominaisuusnoppien maksimiarvojen puolisummalla.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Mieli",
    definition:
      "Henkinen kestokategoria. Kattaa Ymmärrys- ja Persoona-ominaisuudet. Mieli-kesto alkaa 8:sta ja kasvaa molempien ominaisuusnoppien maksimiarvojen puolisummalla.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Terä",
    definition:
      "Havainnollinen kestokategoria. Kattaa Näkemys- ja Näppäryys-ominaisuudet. Terä-kesto alkaa 8:sta ja kasvaa molempien ominaisuusnoppien maksimiarvojen puolisummalla.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Kesto",
    definition:
      "Hahmosi kyky sietää fyysistä, henkistä ja havainnoinnin rasitusta. Jokaisella kategorialla (Keho, Mieli, Terä) on oma arvo joka alkaa 8:sta. Keston laskeminen on vakavampaa kuin sisun kuluminen ja johtaa lopulta Harmeihin.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Ominaisuusnoppa",
    definition:
      "Bonusnoppa (n4–n12) joka lisätään ominaisuudelle ominaisten akseleiden tuloksiin. Valitset kaksi ominaisuutta hahmonluonnissa ja saat kumpaankin +n4. Kolme samankokoista noppaa yhdistyvät yhdeksi askeleen suuremmaksi nopaksi (n4→n6→n8→n10→n12) kehityksen yhteydessä.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Taidot",
    definition:
      "Pääsykortit erikoistoiminnoille. Taito mahdollistaa siihen liittyvän heiton ilman kestohintaa ja voi avata uusia akseleita heittoihin. Ilman taitoa voit yrittää maksamalla 1–3 pistettä sopivaa kestoa.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Varusteet",
    definition:
      "Tarinallisia ja mekaanisia mahdollistajia toiminnoille. Käyttöönotto sitoo 1–5 pistettä sopivaa kestoa; pisteet vapautuvat kun luovut varusteesta. Aseet määrittävät vahinkonopan ja rajoittavat hyökkäysakseleita.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },
  {
    term: "Rasituksen siirto",
    definition:
      "Voit korvata yhden pisteen menetystä tietystä kestokategoriasta maksamalla 2 pistettä toisesta. Mahdollistaa resurssien siirtelyn kategorioiden välillä kun yksi alue on kriittisessä tilassa.",
    category: "Hahmo",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-2-hahmo-ja-ominaisuudet",
  },

  // ── Taistelu ─────────────────────────────────────────────────────────────────
  {
    term: "Ajastin",
    definition:
      "Taistelun aikajanajärjestelmä. Laskee korkeimmasta aloitearvosta alas nollaan. Toiminnot ratkaistaan ajastimen järjestyksessä; tasatilanteessa pelaajat päättävät keskinäisen järjestyksen.",
    category: "Taistelu",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-3-konfliktit-ja-taistelu",
  },
  {
    term: "Aloite",
    definition:
      "Taisteluakseli joka määrää paikkasi ajastimella. Tulos on joko (5 × aloite-akselin noppien määrä) tai (heitettyjen noppien suurin silmäluku) – valitaan suurempi arvo.",
    category: "Taistelu",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-3-konfliktit-ja-taistelu",
  },
  {
    term: "Julistusvaihe",
    definition:
      "Taistelukierroksen ensimmäinen vaihe. Pelinjohtaja kertoo tavallisten vastustajien aikeet, pelaajat ilmoittavat aikeensa ja jakavat nopat, sitten pelinjohtaja kertoo erikoisvastustajien aikeet.",
    category: "Taistelu",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-3-konfliktit-ja-taistelu",
  },
  {
    term: "Vyöhyke",
    definition:
      "Taistelualueen yksikkö. Yksi liike-akselin noppa mahdollistaa liikkumisen yhdeltä vyöhykkeeltä toiselle tai uudelleenasennoinnin vyöhykkeen sisällä.",
    category: "Taistelu",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-3-konfliktit-ja-taistelu",
  },

  // ── Vaurio ───────────────────────────────────────────────────────────────────
  {
    term: "Sisu",
    definition:
      "Hahmosi kestävyys- ja onnenopat, jotka suodattavat tulevan vaurion. Muodostuu n6- tai n8-nopista hahmotyypistä riippuen. Sisu palautuu lepojen ja jaksojen välissä.",
    category: "Vaurio",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-4-vaurio-ja-selviytyminen",
  },
  {
    term: "Uhkanopat",
    definition:
      "Kertyvät kun hyökkäys ei aiheuta vauriota sisuun eikä kestoon: hyökkääjän vahinkonoppa lisätään kohteen uhkanoppapinoon ja vahvistaa tulevia osumia. Pino tyhjenee heti kun kohde ottaa vauriota sisuun tai kestoon.",
    category: "Vaurio",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-4-vaurio-ja-selviytyminen",
  },
  {
    term: "Harmi",
    definition:
      "Pysyvä vamma joka poistaa yhden nopan noppakourasta (−1n20). Syntyy kun sisu on loppunut ja kohde ottaa vauriota. Viides harmi poistaa hahmon kampanjasta. Harmit selitetään tarinallisesti jaksojen välissä.",
    category: "Vaurio",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-4-vaurio-ja-selviytyminen",
  },
  {
    term: "Vahinkonoppa",
    definition:
      "Aseen tai hyökkäyksen vauriopotentiaali (esim. 1n6). Yhdistyy kohteen uhkanoppien kanssa muodostaen vaurionopat. Aseen tyyppi määrittää myös kuinka monta noppaa voidaan sitoa hyökkäysakseliin.",
    category: "Vaurio",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-4-vaurio-ja-selviytyminen",
  },

  // ── Kehitys ──────────────────────────────────────────────────────────────────
  {
    term: "Kehitys",
    definition:
      "Hahmosi kasvu jaksojen välissä. Lisäät n4:n valitsemaasi ominaisuuteen ja valitset uusia taitoja tai parempaa sisua. Kolme samankokoista ominaisuusnoppaa yhdistyvät yhdeksi askeleen suuremmaksi (n4→n6→n8→n10→n12).",
    category: "Kehitys",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-5-kehitys-ja-toipuminen",
  },
  {
    term: "Toipuminen",
    definition:
      "Sisu ja kesto palautuvat täysin jaksojen välissä. Jakson aikana lepo palauttaa sisun täysin ja jokaista kestoa 1 pisteen. Taistelun alussa palautuu yksi menetetty sisunoppa. Harmit vaativat tarinallisen selityksen.",
    category: "Kehitys",
    sectionPageId: "mekaniikat",
    sectionId: "mekaniikat-5-kehitys-ja-toipuminen",
  },
];
