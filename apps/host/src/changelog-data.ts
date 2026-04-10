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
    version: "0.1.2",
    date: "2026-04-09",
    name: "Omat kuvakkeet",
    features: [
      {
        title: "SVG-kuvakespritet",
        description:
          "19 temaattista, käsin piirrettyä SVG-kuvaketta korvaavat vastaavat Lucide-kuvakkeet. Kuvakkeet ladataan yhdellä sprite-tiedostolla, mikä parantaa suorituskykyä ja antaa sovellukselle oman visuaalisen identiteetin.",
      },
    ],
    major: [
    ],
    minor: [
      {
        title: "Kuvakkeiden automaattinen koontiskripti",
        description:
          "Uusi build:icons-skripti generoi SVG-spriten ja TypeScript-tyypit automaattisesti custom-icons-kansiosta. Bézier-käyrien tarkka bounding box -laskenta varmistaa, että jokainen kuvake on täydellisesti keskitetty ja normalisoitu riippumatta alkuperäisestä piirtoalueesta.",
      },
      {
        title: "Icon-komponentti uudistettu",
        description:
          "Icon-komponentti reitittää automaattisesti omat kuvakkeet sprite-tiedostosta ja muut Lucide Reactista. API pysyy ennallaan — <Icon name=\"...\" /> toimii kuten ennenkin, mutta taustalla käytetään nyt temaattisia kuvakkeita aina kun saatavilla.",
      },
      {
        title: "Navigaatiokuvakkeet vaihdettu",
        description:
          "Sivupalkin, aloitussivun ja hallintapaneelin kuvakkeet päivitetty käyttämään temaattisia vastineita: player-character, rulebook, world, file-cabinet, login ja logout.",
      },
      {
        title: "CustomIcon-komponentti",
        description:
          "Uusi sisäinen CustomIcon-primitiivi SVG-sprite-viittauksia varten. Injektoi spriten DOM:iin yhdellä kerralla ensimmäisellä renderöinnillä.",
      },
      {
        title: "Icons.stories-galleria laajennettu",
        description:
          "Storybook-kuvakegalleriassa nyt erillinen osio temaattisille SVG-kuvakkeille ja Lucide-kuvakkeille. Ohje uusien kuvakkeiden lisäämiseen päivitetty.",
      },
      {
        title: "Storybook-tarinat päivitetty",
        description:
          "Sidebar-, Badge-, Card-, NavButton-, StatBlock- ja UtilityPage-tarinat käyttävät nyt uusia temaattisia kuvakenimiä.",
      },
      {
        title: ".gitignore päivitetty",
        description:
          "Generoitu kuvake-sprite ja TypeScript-nimiyhteenveto lisätty .gitignore-tiedostoon — vain lähde-SVG:t versioidaan.",
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-04-08",
    name: "Hahmonimet ja ilmoitukset",
    features: [
      {
        title: "Hahmojen nimeäminen",
        description:
          "Hahmogeneraattori ehdottaa kulttuuriin sopivia nimiä automaattisesti. Nimi on muokattavissa myös luomisen jälkeen hahmokirjassa.",
        link: { label: "Avaa hahmogeneraattori", to: "/generator" },
      },
      {
        title: "Lempinimet",
        description:
          "Lisää hahmollesi enintään viisi lempinimeä. Lempinimet näkyvät hahmokirjassa ja ovat muokattavissa tageina.",
        link: { label: "Avaa hahmogeneraattori", to: "/generator" },
      },
      {
        title: "Ilmoitusjärjestelmä",
        description:
          "Uusi ilmoitusjärjestelmä näyttää odottavat toimet hallintapaneelissa. Sivupalkin vilkkuva piste kertoo lukemattomista ilmoituksista.",
      },
    ],
    major: [
      {
        title: "Syke — asema-artikkeli uudistettu",
        description:
          "Sykkeen asema-artikkeli kirjoitettu kokonaan uudelleen. Uusi sisältö kattaa metastabiilin saariston fysiikan, KW-konsortion ja Ekklesian välisen valtajännitteen, naapuriasemat sekä Sykkeen roolin Kynnyksen ontologisena ankkurina.",
        link: { label: "Lue Syke-artikkeli", to: "/world/kynnys/02-syke" },
      },
    ],
    minor: [
      {
        title: "DTO-tuonnit korjattu",
        description:
          "Palvelimen kontrollerit käyttävät nyt arvoimportointia (import) type-importoinnin sijasta, jotta class-validator-dekoraattorit säilyvät ajon aikana.",
      },
      {
        title: "EditableField-komponentti",
        description:
          "Uusi EditableField-molekyyli korvaa erilliset EditableText- ja EditableTextarea-komponentit. Tukee yksirivisiä, monirivisiä ja select-variantteja.",
      },
      {
        title: "NavButton-komponentti",
        description:
          "Uusi NavButton-komponentti, joka sisältää ilmoituspallon. Sivupalkin navigointipainikkeet käyttävät nyt NavButtonia.",
      },
      {
        title: "Select compact -koko",
        description:
          "Select-komponenttiin lisätty compact-kokovariantti tiiviihin asetteluun.",
      },
      {
        title: "AspectTag name -variantti",
        description:
          "Uusi name-variantti AspectTag-komponenttiin nimiehdotuksia varten. Klikattava ja saavutettava.",
      },
      {
        title: "Artikkelin etenemisraiteen tooltip-korjaus",
        description:
          "ArticleProgressNavigator-tooltipin vähimmäisleveys asetettu tavutusongelmien välttämiseksi.",
      },
      {
        title: "Storybook-tarinat päivitetty",
        description:
          "Uudet tarinat EditableField-, AspectTag (name)-, Select (compact)- ja NavButton-komponenteille.",
      },
    ],
  },
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
