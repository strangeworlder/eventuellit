export interface ChangelogItem {
  /** Finnish title of the change */
  title: string;
  /** Finnish description */
  description: string;
  /** Optional link to the relevant part of the app */
  link?: { label: string; to: string };
}

export interface ChangelogRelease {
  /** Semantic version string, e.g. "0.1.0" */
  version: string;
  /** ISO date string of the release */
  date: string;
  /** Optional release name */
  name?: string;
  /** New features — listed in their own section */
  features: ChangelogItem[];
  /** Significant structural / architectural changes */
  major: ChangelogItem[];
  /** Bug fixes and minor improvements — hidden behind accordion */
  minor: ChangelogItem[];
}

export const CHANGELOG_RELEASES: ChangelogRelease[] = [
  {
    version: "0.1.0",
    date: "2026-04-08",
    name: "Muutosloki otettu käyttöön",
    features: [
      {
        title: "Sääntökirja",
        description:
          "Interaktiivinen sääntökirja Eventuellit-järjestelmälle. Sisältää Noppakoura-mekaniikat (5n20), hahmoluomisen, Sisu/Kesto/Harmi-järjestelmän, taistelun ajastimen ja kaikki pelaamisen perussäännöt. Pikahaku ja sanasto sisällytetty.",
        link: { label: "Avaa sääntökirja", to: "/ruleset/johdanto" },
      },
      {
        title: "Jaksopäiväkirja",
        description:
          "Seuraa kampanjasi kulkua jaksopäiväkirjassa. Selaa menneitä sessioita ja valmistaudu seuraavaan istuntoon.",
        link: { label: "Avaa jaksot", to: "/episodes/latest" },
      },
      {
        title: "Maailma",
        description:
          "Tutustu Eventuellit-universumin nesteasuiseen aurinkokuntaan. Kynnys-aseman fraktiot, asemanväliset yhteydet ja interaktiiviset kartat.",
        link: { label: "Avaa maailma", to: "/world" },
      },
      {
        title: "Taikalinkkikirjautuminen",
        description:
          "Turvallinen salasanaton kirjautuminen sähköpostitaikalinkin avulla. JWT-istunnot httpOnly-evästeissä. Sähköpostin sallittujen lista käytössä.",
        link: { label: "Kirjaudu sisään", to: "/kirjaudu" },
      },
      {
        title: "Pelaajan hallintapaneeli",
        description:
          "Kirjautuneiden pelaajien oma sivu hahmotietojen hallintaan ja pelitilanteen seuraamiseen.",
      },
      {
        title: "Tietosuojaseloste",
        description:
          "GDPR-yhteensopiva tietosuojaseloste. Sisältää oman datan lataamisen ja tilin poistamisen.",
        link: { label: "Lue tietosuojaseloste", to: "/tietosuoja" },
      },
      {
        title: "Muutosloki",
        description: "Tämä sivu. Seuraa sovelluksen kehitystä versioittain.",
      },
    ],
    major: [
      {
        title: "Mikrofrontendi-arkkitehtuuri",
        description:
          "Eventuellit on rakennettu modernilla mikrofrontendi-arkkitehtuurilla (Vite 6 + Module Federation). Sääntökirja, jaksopäiväkirja, maailma ja hahmogeneraattori toimivat itsenäisinä sovelluksina yhteisen kuoriappin alla.",
      },
      {
        title: "Suunnittelujärjestelmä",
        description:
          "Jaettu @repo/ui-komponenttikirjasto. 141 komponenttitiedostoa, 71 Storybook-tarinaa, kahdeksan teemaa, WCAG AA -värikontrastit ja semanttinen token-järjestelmä.",
      },
      {
        title: "NestJS-palvelin ja tietokanta",
        description:
          "Backend rakennettu NestJS:llä ja Drizzle ORM:llä. Käyttäjien, hahmojen ja jaksojen hallinta PostgreSQL-tietokannassa. Validoitu DTO-pohjaisilla syötteillä.",
      },
      {
        title: "Artikkelin etenemisraide",
        description:
          "Pystysuuntainen etenemisraide pitkissä artikkeleissa. Näyttää lukijan sijainnin ja mahdollistaa suoran hyppäämisen H3-otsikoihin. Kiinnittyy sivupaneeliin vierityksen aikana.",
        link: { label: "Kokeile sääntökirjassa", to: "/ruleset/johdanto" },
      },
    ],
    minor: [
      {
        title: "Kuvien latausoptimointi",
        description:
          "ImageElement käyttää manifest.json-pohjaisia lähteitä ja blur-alustusnäkymiä WebP/AVIF-muodossa. Responsive source set -kuvavariantit.",
      },
      {
        title: "Sivupalkki sulkeutuu reitinvaihdolla mobiililla",
        description:
          "Sivupalkki sulkeutuu automaattisesti reitin vaihtuessa mobiililla. Kirjautumispainike näkyy myös suljetussa tilassa.",
      },
      {
        title: "Painikkeen tilaindikaattorit",
        description:
          "Button-komponenttiin lisätty lataus-, aktiivinen ja vaaratila. Vaarapainikkeet käyttävät useita vihjeitä värin lisäksi (kuvake, reunus, muoto).",
      },
      {
        title: "Fraktioiden uudelleennimeäminen",
        description:
          "Maailman fraktiot päivitetty uuteen 9-alafraktion taksonomiaan. Aseveljet→Ratasvartio, Spektaakkeli→Pyhän Tragedian lapset, KelloWerks→KW-konsortio.",
      },
      {
        title: "Värijärjestelmän uudistus",
        description:
          "Semanttiset väritokenit (text-muted, text-subtle, surface-tint, border-soft, border-medium) korvasivat opacity-modifioijat. WCAG AA -kontrastit varmistettu kaikissa teemoissa.",
      },
      {
        title: "Mukautetut mediarajat",
        description:
          "Tailwindin oletusrajat korvattu projektikohtaisilla: mobile (550px), tablet (700px), desktop (900px), x-wide (1200px), xx-wide (1500px).",
      },
    ],
  },
];
