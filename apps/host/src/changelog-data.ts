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
    version: "0.1.7",
    date: "2026-06-09",
    name: "Operaatiot — GM-hallinta ja historia",
    features: [
      {
        title: "Suljettujen äänestysten historia",
        description:
          "Aiemmat äänestykset eivät enää katoa sulkemisen jälkeen. Kaikki pelaajat näkevät uuden \"Aiemmat äänestykset\" -osion, jossa vanhat äänestystulokset, tehtäväkortit ja keskustelut ovat selailtavissa taitettavina accordioneina.",
        link: { label: "Siirry operaatioihin", to: "/operaatiot" },
      },
      {
        title: "Äänestyksen muokkaus pelinjohtajalle",
        description:
          "Pelinjohtaja voi nyt muokata äänestyksen otsikkoa ja takarajaa suoraan hallintapaneelista. Tehtävävaihtoehtojen nimeä, kuvausta ja kiireellisyyttä voi muokata inline-muokkaustilassa.",
        link: { label: "Avaa hallintapaneeli", to: "/operaatiot" },
      },
      {
        title: "Tehtävien uudelleenjärjestys",
        description:
          "Tehtävävaihtoehdot voi järjestää uudelleen ↑/↓-nuolipainikkeilla hallintapaneelissa. Järjestys tallentuu palvelimelle ja näkyy kaikille pelaajille.",
      },
      {
        title: "Suljetun äänestyksen uudelleenavaaminen",
        description:
          "Pelinjohtaja voi avata suljetun äänestyksen uudelleen, jolloin pelaajat voivat jälleen äänestää ja muuttaa valintojaan. Vahvistusikkuna estää tahattoman avaamisen.",
      },
    ],
    major: [
      {
        title: "Suljettujen kierrosten palvelinrajapinta",
        description:
          "Uusi GET /voting/closed -rajapinta palauttaa kaikki suljetut äänestyskerrokset tuloksineen ja tehtävineen. Rajapinta on kaikkien kirjautuneiden käyttäjien saatavilla.",
      },
      {
        title: "Hallintapaneeli tukee kaikkia äänestyksiä",
        description:
          "GM:n hallintapaneeli (Drawer) voi nyt avata minkä tahansa äänestyksen — aktiivisen tai suljetun — muokattavaksi, uudelleenavattavaksi tai poistettavaksi.",
      },
    ],
    minor: [
      {
        title: "Painikkeet tiivistetty compact-kokoon",
        description:
          "Hallintapaneelin kaikki painikkeet vaihdettu compact-kokoon suunnittelujärjestelmän mukaisesti. Paneeli on nyt tiiviimpi ja mahtuu paremmin sivupaneeliin.",
      },
      {
        title: "Suljettujen tehtäväkorttien visuaalinen korjaus",
        description:
          "Suljettujen äänestysten tehtäväkortit näytetään nyt täydellä opasiteetilla ja värikylläisyydellä. Aiemmin SelectionCard-komponentti lisäsi opacity-60 ja grayscale-30% lukittuihin kortteihin.",
      },
    ],
  },
  {
    version: "0.1.6",
    date: "2026-05-12",
    name: "Operaatiot — Tehtävääänestys",
    features: [
      {
        title: "Tehtävääänestysjärjestelmä",
        description:
          "Pelaajat voivat nyt äänestää seuraavasta operaatiosta. Kukin pelaaja valitsee ensisijaisen (3 pistettä) ja valinnaisen toissijaisen (1 piste) vaihtoehdon. Äänestys on anonyymi ja pelinjohtaja luo ja sulkee äänestyskerrokset.",
        link: { label: "Siirry operaatioihin", to: "/operaatiot" },
      },
      {
        title: "Operaatiot-sivu",
        description:
          "Uusi suojattu sivu, jossa pelaajat näkevät aktiivisen äänestyksen tehtävävaihtoehdot, äänestystulokset reaaliajassa ja mahdollisen aikarajan. Pelinjohtajalle on erillinen hallintapaneeli äänestyskerrosten ja vaihtoehtojen luomiseen.",
        link: { label: "Avaa Operaatiot", to: "/operaatiot" },
      },
      {
        title: "Äänestys-CTA hallintapaneelissa",
        description:
          "Pelaajan hallintapaneelissa näkyy kortti, joka kehottaa äänestämään, kun aktiivinen äänestyskierros on käynnissä ja pelaaja ei ole vielä äänestänyt. Kortti näyttää vaihtoehtojen määrän ja mahdollisen aikarajan.",
      },
    ],
    major: [
      {
        title: "MissionVotes-palvelinmoduuli",
        description:
          "Uusi NestJS-moduuli (controller, service, 6 DTO:ta) käsittelee äänestyskerrosten, vaihtoehtojen, äänten ja kommenttien CRUD-operaatiot. RESTful API tukee äänestyksen luomista, sulkemista, äänten upsertointia ja anonyymejä kommentteja.",
      },
      {
        title: "Tietokantaskeema — 4 uutta taulua",
        description:
          "voting_rounds (äänestyskerrokset), mission_options (tehtävävaihtoehdot), mission_votes (pelaajien äänet) ja mission_comments (anonyymit/nimetyt kommentit). Äänet rajoitettu yksi per pelaaja per kierros uniikkiavaimella.",
      },
      {
        title: "6 uutta suunnittelujärjestelmäkomponenttia",
        description:
          "SelectionCard (valintakortti ensisijainen/toissijainen-tilalla ja ryhmähallinnalla), VotingStandings (äänestyspisteet mittaripalkeilla), CountdownDisplay (aikarajanäyttö), UrgencyIndicator (kiireellisyystaso), CommentEntry (yksittäinen kommentti) ja CommentThread (kommenttiketju). Kaikki dokumentoitu Storybook-tarinoin.",
      },
    ],
    minor: [
      {
        title: "DiceIcon — visuaalinen uudistus",
        description:
          "Noppakuvakkeet käyttävät nyt SVG-gradientteja reunavalaistukseen ja pintavinjettiin. Aktiivinen hehkuanimaatio (4 s sykli) ja hiljainen hengitys (6 s sykli). Hover-mikrointeraktiot: 1.04× skaalaus ja 2° kallistus. Gradientin ID:t sidottu React.useId:iin SVG-ristiriitojen välttämiseksi.",
      },
      {
        title: "Icon-komponentti — Storybook-päivitys",
        description:
          "Icon-galleriaan lisätty kaikki 19 temaattista kuvaketta suomenkielisine kuvauksineen. Uudet tarinat: BrandedVariantti ja KokoVertailu. Gallerian automaattinen generointi custom-icon-names-tiedostosta.",
      },
      {
        title: "StationConnections — Storybook-korjaus",
        description:
          "Ylimääräinen MemoryRouter-kääre poistettu KaikkiJannitetasot-tarinasta, jossa dekoraattori tarjosi jo reitittimen.",
      },
      {
        title: "OG-kuvat siirretty R2-palvelimelle",
        description:
          "OpenGraph-meta-kuvat osoittavat nyt suoraan R2-julkiseen URL:iin paikallisen /images/-polun sijasta.",
      },
      {
        title: "Agenttien työnkulku — DS-esitarkistus",
        description:
          "new-feature.md- ja ui-development.md-työnkulkuihin lisätty pakollinen suunnittelujärjestelmän esitarkistusvaihe. CLAUDE.md ja .cursorrules sisältävät saman direktiivin.",
      },
      {
        title: "Visual Identity -taitotiedosto",
        description:
          "Uusi claude-skills/visual-identity/SKILL.md dokumentoi projektin retro-avaruusooppera-estetiikan: fluoresoivat otsikot, teal-paletti, tumma konsolipohja ja anti-patterneina pastelli-SaaS-tyylit.",
      },
      {
        title: "Otsikkotasojen kontekstisääntö dokumentoitu",
        description:
          "docs/rules.md ja docs/learnings.md päivitetty: otsikkotasot virtaavat HeadingLevelProvider-kontekstista eikä niitä saa ohittaa manuaalisesti.",
      },
      {
        title: "MotionAndAnimation.mdx — noppa-animaatiot",
        description:
          "Liikedokumentaatioon lisätty dice-glow ja dice-glow-inactive -animaatiot sekä DiceIconin päivitetyt hover-kuvaukset.",
      },
      {
        title: "Learnings-tiedosto tiivistetty",
        description:
          "16 vanhentunutta merkintää poistettu ja 16 uutta lisätty. Purge Ledger päivitetty.",
      },
    ],
  },
  {
    version: "0.1.5",
    date: "2026-05-12",
    name: "Cloudflare R2 -mediapalvelu",
    features: [
      {
        title: "Kuvat siirretty Cloudflare R2 -pilvipalveluun",
        description:
          "Kaikki kuvamateriaali (sääntökirja, maailma, jaksot) palvellaan nyt Cloudflare R2 -tallennuspalvelusta. Kuvat optimoidaan automaattisesti AVIF/WebP/JPG-muotoihin neljässä eri resoluutiossa (480px, 768px, 1200px, alkuperäinen). Sivulatausajat paranevat merkittävästi erityisesti hitailla yhteyksillä.",
      },
      {
        title: "Medianhallintarajapinta",
        description:
          "Palvelimelle lisätty uusi MediaModule, joka mahdollistaa kuvien lataamisen suoraan R2-pilveen presigned URL -tekniikalla. Pelinjohtaja voi ladata kuvia ilman palvelimen kaistanleveyden käyttöä.",
      },
    ],
    major: [
      {
        title: "Media-tietokantataulu",
        description:
          "Uusi media-taulu tallentaa kuvatiedostojen metatiedot (tiedostonimi, mitat, alt-teksti, konteksti). Jaksot voivat viitata mediatauluun suoran mediaId-viittauksen kautta.",
      },
      {
        title: "Kuvaoptimointiskripti poistettu MFE-sovelluksista",
        description:
          "optimize-images.mjs ja sharp-riippuvuus poistettu kaikista kolmesta MFE:stä (sääntökirja, maailma, jaksot). Kuvien optimointi tapahtuu nyt kertaluontoisena prosessina R2-siirtoskriptissä, ei jokaisessa dev- ja build-ajossa.",
      },
    ],
    minor: [
      {
        title: "Binääritiedostot poistettu repositoriosta",
        description:
          "Noin 120 Mt kuvatiedostoja (lähde-PNG:t, generoidut variantit ja manifest.json) poistettu Git-seurannasta. Repositorion koko pienenee merkittävästi.",
      },
      {
        title: "ImageElement — CDN-tuki",
        description:
          "ImageElement-komponentti hakee manifest.json-tiedoston automaattisesti R2-palvelusta ja käyttää optimoituja AVIF/WebP-variantteja blur-esikatselukuvineen, kuten ennenkin.",
      },
      {
        title: "Ympäristömuuttujat — R2-asetukset",
        description:
          "Uudet R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME ja R2_PUBLIC_URL ympäristömuuttujat dokumentoitu .env.example-tiedostoon.",
      },
    ],
  },
  {
    version: "0.1.4",
    date: "2026-05-10",
    name: "Palaavat hahmot",
    features: [
      {
        title: "Hahmon kehitys jaksojen välillä",
        description:
          "Palaavat hahmot voivat nyt kehittyä jaksojen välillä. Valitse ominaisuus, johon lisätään n4-noppa (nopat yhdistyvät automaattisesti: 2×n4→n6→n8→…n12), valitse palkkio (2 taitoa + n6 Sisu tai 1 taito + n8 Sisu) ja vahvista. Kehityshistoria tallentuu automaattisesti snapshotiksi.",
        link: { label: "Avaa hahmogeneraattori", to: "/generator" },
      },
      {
        title: "Hahmon palautus ennen jaksoa",
        description:
          "Jakson valmistautumissivulla palaava hahmo voi palauttaa kesto-pisteensä ja merkitä harmeja parantuneiksi. Palautus ja kehitys näkyvät vaiheittaisena prosessina, joka avautuu askel kerrallaan.",
      },
      {
        title: "Hahmon liittäminen jaksoon",
        description:
          "Pelaaja voi liittää hahmonsa tulevaan jaksoon hahmoluettelosta. Pelistä poistetut hahmot (5 harmia tai manuaalinen poisto) eivät voi enää liittyä uusiin jaksoihin.",
      },
    ],
    major: [
      {
        title: "Jakson valmistautumissivu uudistettu",
        description:
          "Jakson valmistautumissivulle lisätty palaavan hahmon työnkulku: kesto-palautus, harmien parantaminen ja ominaisuuskehitys. Sivulla näkyy myös tieto, jos jakso on päättynyt tai hahmoa ei ole liitetty.",
      },
      {
        title: "Pelinjohtajan yleiskatsaus laajennettu",
        description:
          "GM-näkymässä näkyy nyt kunkin pelaajan hahmon snapshot-lukumäärä, pelistä-poistettu-tila sekä suora linkki hahmosivulle.",
      },
      {
        title: "Tietokantaskeema — hahmoelinkaari",
        description:
          "Uusi character_arc_snapshots-taulu tallentaa hahmon tilan kehityshetkellä. character_episodes-tauluun lisätty refreshed_at- ja advanced_at-sarakkeet. Hahmoille lisätty removed_from_play_at-aikaleima.",
      },
    ],
    minor: [
      {
        title: "Noppatierin koodausmoduuli",
        description:
          "Uusi attribute-dice-moduuli pakkaa ominaisuusnopat base-3-koodaukseen (n4…n12, 0–2 kutakin). addN4-funktio hoitaa automaattisen yhdistämisen ja carry-ketjun. Yksikkötestit kattavat koodauksen, yhdistämisen ja virherajat.",
      },
      {
        title: "Sääntökirjan mekaniikat päivitetty",
        description:
          "Ympäristö ja tilanne -osio selkeytetty: akselit voivat olla positiivisia tai negatiivisia, kesto-kustannus voi muuttua. Aloite- ja liike-akselien kuvaukset tarkennettu.",
      },
      {
        title: "Kehitys siirretty jakson alkuun",
        description:
          "PRD päivitetty: hahmon kehitys tapahtuu uuden jakson alussa, ei edellisen lopussa. Tämä mahdollistaa uusien taitojen käytön heti ensimmäisestä sessiosta.",
      },
      {
        title: "Dashboard — pelistä poistetut hahmot",
        description:
          "Hallintapaneeli huomioi nyt pelistä poistetut hahmot (5 harmia tai removed_from_play_at). Hahmoa ei lasketa aktiiviseksi, jos se on poistettu pelistä.",
      },
      {
        title: "Hahmoliittämisen linkki parannettu",
        description:
          "Pelaajan hallintapaneelin 'link_character'-toiminnon URL sisältää nyt jakson ID:n, jolloin hahmoluettelo osaa avata liitosdialogin suoraan oikealle jaksolle.",
      },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-04-17",
    name: "Hybridifaktiot ja versiohistoria",
    features: [
      {
        title: "Hybridifaktiot",
        description:
          "Maailma tukee nyt faktioita, jotka yhdistävät kahden pääfaktion perinteet. Hybridifaktion nimi, kuvake ja värimaailma heijastavat molempia emofaktioita. Ensimmäinen hybridifaktio — Kokemuspuolue — on lisätty.",
        link: { label: "Tutustu Kokemuspuolueeseen", to: "/world/faktiot/kokemuspuolue" },
      },
      {
        title: "Asemien versiohistoria",
        description:
          "Asemien kuvaukset päivittyvät pelisessioiden myötä. Vanha sisältö arkistoituu versiohistoriaan, jota voi selata sivupalkista. Näet miten asema muuttui kunkin jakson jälkeen.",
        link: { label: "Katso Verson historia", to: "/world/kynnys/03-verso?versio=jakso-2" },
      },
      {
        title: "Useita hallitsevia faktioita",
        description:
          "Asemilla voi nyt olla useampi hallitseva faktio samanaikaisesti. Faktioiden visuaalinen esitys ja rivaalilaskenta päivitetty vastaamaan jaettua hallintaa.",
      },
    ],
    major: [
      {
        title: "Häkki — asema-artikkeli uudistettu",
        description:
          "Häkin asema-artikkeli kirjoitettu kokonaan uudelleen. Uusi sisältö kattaa aseman klaustrofobisen arkkitehtuurin, Pyhän Tragedian lasten uskonnollisen urheilukultin, Heimolaisten perhekeskeisen vallan, Arven salakuljetusverkon ja aseman roolin Kynnyksen tuomiokoneiston osana.",
        link: { label: "Lue Häkki-artikkeli", to: "/world/kynnys/14-hakki" },
      },
      {
        title: "Verso — artikkeli päivitetty jakson 2 jälkeen",
        description:
          "Verson asema-artikkelia päivitetty vallankumouksen seurauksilla. Uudet hallitsevat faktiot (Tuhkan puolue, Muotinvalajat) ja päivitetyt jännitteet.",
        link: { label: "Lue Verso-artikkeli", to: "/world/kynnys/03-verso" },
      },
      {
        title: "Palvelimen muistinkäytön optimointi",
        description:
          "Tietokantakyselyiden tehokkuutta parannettu merkittävästi. Dashboard-palvelu uudelleenkirjoitettu erähakuilla yksittäisten kyselyjen sijaan. Tietokantayhteyspooli rajoitettu viidelle samanaikaiselle yhteydelle.",
      },
    ],
    minor: [
      {
        title: "Symmetrinen faktiorivaalisto",
        description:
          "Faktioiden rivaalisto on nyt kaksisuuntainen: jos faktio A häiritsee faktion B asemaa, myös B pitää A:ta kilpailijanaan.",
      },
      {
        title: "FactionBadge — hybridituki",
        description:
          "FactionBadge-komponentti tukee nyt kahden värin liukuväritekstiä, diagonaalista väripistettä ja liukuvärireunaviivaa hybridifaktioille.",
      },
      {
        title: "EntityCard — hybridituki",
        description:
          "EntityCard-kortin header-gradientti ja aksenttiviiva tukevat nyt hybridifaktioiden kahta väriä.",
      },
      {
        title: "OpenGraph-kuvien valinta korjattu",
        description:
          "Episodien og:image valitsee nyt kuvavariantin lähimpänä 1200px leveyttä leveimmän sijaan. Puuttuvan remote origin -muuttujan käsittely korjattu.",
      },
      {
        title: "Resend-sähköpostipalvelun yhteys",
        description:
          "Resend API -yhteys luodaan nyt kerran ja välimuistitetaan. Puuttuva API-avain ei kaada palvelinta, vaan kirjaa varoituksen.",
      },
      {
        title: "Tietokantakyselyiden optimointi",
        description:
          "Rajoittamattomat select()-kyselyt korvattu kohdennetuilla sarakevalinnoilla ja LIMIT-rajoituksilla. ReadingProgress-palvelun skannaus rajattu WHERE-ehdolla.",
      },
      {
        title: "Storybook-tarinat päivitetty",
        description:
          "Uudet tarinat FactionBadge- ja EntityCard-komponenttien hybridifaktiovarianteille.",
      },
      {
        title: "Palvelimen käännösasetukset",
        description:
          "Source map -generointi poistettu tuotantokäännöksestä tiedostokoon pienentämiseksi.",
      },
    ],
  },
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
