export interface SeedShipRoom {
  key: string;
  deckNumber: number;
  kind: "facility" | "cabin" | "sealed";
  svgZoneId: string;
  name: string;
  subtitle: string;
  description: string;
  statusLabel: string;
  statusTone: "normal" | "warning" | "critical" | "locked";
  isLocked: boolean;
  orderIndex: number;
}

export const DEFAULT_SHIP_CONFIG = {
  id: 1,
  name: "Aamunkoi",
  callsign: "Runko 150 m",
  theme: "base",
  statusBanner: "Asemien välisessä varjossa, häivejärjestelmät valmiustilassa",
  hullNotes:
    "Syvästä avaruudesta hinattu 150 metrin Suuren sodan aikainen häive- ja miehistöalus. Pyöristetyt hopeanharmaat käytävät on mitoitettu toistasataa henkeä varten ja tyhjennetty aikoinaan kaikesta henkilökohtaisesta. Paapuurin kyljessä kulkee Kilven kanavapaossa revennyt arpi, ja messin kierrätyssohvien keskellä palavat kuusitoistaväriset päätteet.",
} as const;

interface CabinWingSpec {
  prefix: "a" | "b" | "c" | "d";
  count: number;
  deckNumber: number;
  svgZoneId: string;
  titlePrefix: string;
  subtitlePrefix: string;
  baseOrderIndex: number;
  flavorPool: readonly string[];
}

const CABIN_WING_SPECS: readonly CabinWingSpec[] = [
  {
    prefix: "a",
    count: 6,
    deckNumber: 1,
    svgZoneId: "d1-wing-a",
    titlePrefix: "Päällystöhuone A",
    subtitlePrefix: "Komentokannen asuinkäytävä A",
    baseOrderIndex: 100,
    flavorPool: [
      "Pyöristetyn oviaukon takana aukeaa tilava asuinhuone omalla pesusyvennyksellä. Seinään upotettu pääte hehkuu nelivärisenä, ja kulmapaneelin takana piilee kapea huoltoluukku.",
      "Säädettävä kattovalaisin valaisee harmaan vuoteen, pultatun kirjoituspöydän ja syvän vaatekaapin. Alumiinikarmissa riippuu tyhjä messinkinen nimikylttikehys.",
      "Pesusyvennyksen liukuovi taittuu huomaamattomasti seinän sisään. Ohut väliseinä naapurihuoneeseen kumisee kevyesti koputettaessa.",
      "Pöydän alla kiertää rungon lämpöputki, ja kaapin pohjalle on ruuvattu lukittava lokero henkilökohtaisille tallenteille.",
    ],
  },
  {
    prefix: "b",
    count: 12,
    deckNumber: 2,
    svgZoneId: "d2-wing-b",
    titlePrefix: "Asuinhuone B",
    subtitlePrefix: "Messikannen paapuurikäytävä B",
    baseOrderIndex: 200,
    flavorPool: [
      "Hopeanharmaan käytävän liukuovi aukeaa omaan asuinhuoneeseen, jossa on pultattu työpöytä, kaapisto ja erillinen pesusyvennys. Seinäpääte näyttää huoneen paineen vihreänä.",
      "Kulmistaan pyöristetyt seinäpaneelit ja tummempi alalista jatkuvat yhtenäisinä käytävältä sisään. Ilmanvaihtoritilä suhisee tasaisesti sängyn päädyn yläpuolella.",
      "Pesutilan oven vieressä on upotettu komero sekä kiskolamppu iltalukemista varten. Kaikki entisen asukkaan jäljet on siivottu pois ennen aluksen löytymistä.",
      "Lattiassa kulkee kapea tarkastusluukku runkopalkkien tasolle, ja ovipielessä roikkuu kaksi koukkua painepuvulle.",
    ],
  },
  {
    prefix: "c",
    count: 12,
    deckNumber: 2,
    svgZoneId: "d2-wing-c",
    titlePrefix: "Asuinhuone C",
    subtitlePrefix: "Messikannen tyyrpuurikäytävä C",
    baseOrderIndex: 300,
    flavorPool: [
      "Tyhjäksi siivotun huoneen seinältä heijastuu hiotun teräspeilin ja nelivärisen ruudun valo. Pieni pesusyvennys vie nurkan syvennyksen kokonaan.",
      "Pöydän kulmaan on ilmestynyt jälkiä aiemmasta ruuvipenkistä, vaikka pinta on muuten sileä. Vuoteen alle mahtuu täysikokoinen varustearkku.",
      "Vaatekaappi tuoksuu kevyesti otsonoidulta ilmalta ja vanhalta puhdistusaineelta. Kattovalo kirkastuu pehmeästi liikkeestä.",
      "Seinäpääte kuittaa kutsut matalalla äänimerkillä, ja kapea väliseinä tekee huoneesta helposti muunneltavan naapuritilan suuntaan.",
    ],
  },
  {
    prefix: "d",
    count: 10,
    deckNumber: 3,
    svgZoneId: "d3-wing-d",
    titlePrefix: "Työhuone D",
    subtitlePrefix: "Toimintakannen asuinkäytävä D",
    baseOrderIndex: 400,
    flavorPool: [
      "Lääkintäosaston naapurissa sijaitsevassa huoneessa on tavallista leveämpi työtaso ja kolme maadoitettua virtaliitintä. Takaseinässä on oma pesusyvennys.",
      "Sukkulahallin matala kumina kuuluu vaimeana laipion läpi. Korkea teräskaappi on sisustettu kiskohyllyillä arkaluontoisille tavaroille.",
      "Äänieristetyn oviaukon pielessä riippuu kiskolamppu ja juotoskolville tarkoitettu suojamatto. Vuode taittuu päiväksi syvennykseen.",
      "Kulman kaapista löytyy vapaita näytepurkkeja sekä rungon huoltoluukku alempien kansien kaapelikanaviin.",
    ],
  },
];

function buildCabinWingRooms(spec: CabinWingSpec): SeedShipRoom[] {
  const rooms: SeedShipRoom[] = [];
  for (let i = 1; i <= spec.count; i++) {
    const padded = String(i).padStart(2, "0");
    const sideLabel =
      spec.prefix === "a" || spec.prefix === "d" ? (i % 2 === 1 ? "paapuuri" : "tyyrpuuri") : null;
    rooms.push({
      key: `cabin-${spec.prefix}${padded}`,
      deckNumber: spec.deckNumber,
      kind: "cabin",
      svgZoneId: spec.svgZoneId,
      name: `${spec.titlePrefix}-${padded}`,
      subtitle: sideLabel
        ? `${spec.subtitlePrefix}, ${sideLabel} ${padded}`
        : `${spec.subtitlePrefix} ${padded}`,
      description: spec.flavorPool[(i - 1) % spec.flavorPool.length] ?? spec.flavorPool[0],
      statusLabel: "Toiminnassa",
      statusTone: "normal",
      isLocked: false,
      orderIndex: spec.baseOrderIndex + i,
    });
  }
  return rooms;
}

const FACILITY_AND_SEALED_ROOMS: SeedShipRoom[] = [
  // Kansi 1: Komentokansi
  {
    key: "bridge",
    deckNumber: 1,
    kind: "facility",
    svgZoneId: "d1-bridge",
    name: "Komentosilta",
    subtitle: "Sensoriseinä ja ruori",
    description:
      "Keulaseinän kokoinen kuusitoistavärinen näyttöruutu värisee vienosti ja piirtää tyhjiösensorien vektoriviivat kapteenin istuimen eteen ilman varsinaista lasi-ikkunaa. Sivukonsoleilla seuraavat navigaattorin ja pitkän kantaman anturien asemapaikat.",
    statusLabel: "Sensorit toiminnassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 10,
  },
  {
    key: "stealth-comms",
    deckNumber: 1,
    kind: "facility",
    svgZoneId: "d1-stealth",
    name: "Kuunteluasema",
    subtitle: "Häivejärjestelmät ja Sisäinen ääni",
    description:
      "Kytkinrivistöt ohjaavat lyhytaikaista täyshäivettä, hiljaista ajoa sekä kohdistettua sensorihäirintää. Runkolinkki välittää aluksen tilailmoitukset suoraan miehistön Sisäiseen ääneen.",
    statusLabel: "Valmiustilassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 20,
  },
  {
    key: "log-vault",
    deckNumber: 1,
    kind: "facility",
    svgZoneId: "d1-logs",
    name: "Lokiholvi",
    subtitle: "Irrotetut datalevyt ja ääninauhat",
    description:
      "Suojakoteloihin pakatut vanhat datalevyt odottavat purkua korruptoituneiden lokien jäljiltä. Hyllyjen alaosasta löytyy kasettinauhoja sekä Kynnyksen asukkaille vieraita, hitaita äänikirjoja.",
    statusLabel: "Lokit kryptattu",
    statusTone: "warning",
    isLocked: false,
    orderIndex: 30,
  },
  {
    key: "captain-quarters",
    deckNumber: 1,
    kind: "facility",
    svgZoneId: "d1-captain",
    name: "Kapteenin hytti",
    subtitle: "Reittilaskelmat ja komentopöytä",
    description:
      "Pyöristettyjen hopeanharmaiden seinäpaneelien keskellä seisoo raskas karttapöytä täynnä merkintöjä asemien välisistä virtauksista ja piilopaikoista. Seinäpäätteellä rullaa reittiloki.",
    statusLabel: "Toiminnassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 40,
  },

  // Kansi 2: Asuin- ja messikansi
  {
    key: "mess",
    deckNumber: 2,
    kind: "facility",
    svgZoneId: "d2-mess",
    name: "Messi",
    subtitle: "Keittiö, lautapelipöytä ja asemareliefi",
    description:
      "Kierrätyspisteistä ja roskalavoilta haalitut eripariset sohvat ympäröivät isoa pöytää ja lautapelilaatikoita. Keittiön puolella kasettimankka soi säilykekattiloiden ja maustepurkkien vieressä, ja päätyseinää peittää keskeneräinen kahdenkymmenen aseman väripalareliefi.",
    statusLabel: "Toiminnassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 150,
  },
  {
    key: "galley-stores",
    deckNumber: 2,
    kind: "facility",
    svgZoneId: "d2-galley-stores",
    name: "Muonavarasto",
    subtitle: "Säilykehyllyt ja biomassapuristin",
    description:
      "Teräshyllyt kannattelevat asemilta hankittuja säilykelaatikoita ja juomavesikanistereita. Nurkassa huriseva puristin muovaa hupenevasta biomassavarannosta yksinkertaisia ravintopatukoita pitkiä piilojaksoja varten.",
    statusLabel: "Biomassa vähissä",
    statusTone: "warning",
    isLocked: false,
    orderIndex: 160,
  },
  {
    key: "sealed-dormitory",
    deckNumber: 2,
    kind: "sealed",
    svgZoneId: "d2-sealed-dorm",
    name: "Suljettu siipi",
    subtitle: "Säästötilaan suljettu matkustajasiipi",
    description:
      "Painelaipion takana odottaa kymmeniä pimeitä, tyhjiksi siivottuja asuinhuoneita. Ilmanvaihto ja lämmitys on kytketty pois päältä energian säästämiseksi.",
    statusLabel: "Säästötilassa",
    statusTone: "locked",
    isLocked: true,
    orderIndex: 170,
  },

  // Kansi 3: Sukkula- ja toimintakansi
  {
    key: "hangar",
    deckNumber: 3,
    kind: "facility",
    svgZoneId: "d3-hangar",
    name: "Sukkulahalli",
    subtitle: "Yhteyssukkula, harppuunat ja seinämaalaus",
    description:
      "Koko sisäseinän korkuinen kulmikas maalaus hehkuu sähkönsinisenä, pinkkinä ja vihreänä hallin päädyssä. Magneettikiskoilla seisoo ruosteinen, farmarijeeppiä muistuttava yhteyssukkula napanuorakiinnikkeineen sekä rivistö troolausharppuunoita. Alkuperäiset maihinnousualusten paikat ammottavat tyhjinä.",
    statusLabel: "Sukkula kytketty",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 350,
  },
  {
    key: "breach-port",
    deckNumber: 3,
    kind: "facility",
    svgZoneId: "d3-breach",
    name: "Kylkivaurio",
    subtitle: "Hätälaipioitu paapuurin repeämä",
    description:
      "Kilven kapean kanavan betoniseinä on repinyt vasemman ulkokuoren auki pitkältä matkalta suojakilpien petettyä. Hitsatut tukipalkit ja suljetut painelaipiot pitävät hengitysilman sisäpuolella.",
    statusLabel: "Kylkikuori revennyt",
    statusTone: "critical",
    isLocked: false,
    orderIndex: 360,
  },
  {
    key: "medbay",
    deckNumber: 3,
    kind: "facility",
    svgZoneId: "d3-medbay",
    name: "Sairastupa",
    subtitle: "Kirurgiapöydät ja diagnostiikka",
    description:
      "Suuren sodan aikainen leikkaussali loistaa kirkkaana keskellä kulunutta runkoa. Kahden hoitopöydän yllä riippuvat moniväriset elintoimintopäätteet, kirurgiset ohjaimet ja lääkekaapit vakavia vammoja sekä proteesiasennuksia varten.",
    statusLabel: "Toiminnassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 370,
  },
  {
    key: "armory",
    deckNumber: 3,
    kind: "facility",
    svgZoneId: "d3-armory",
    name: "Varustamo",
    subtitle: "Painepuvut, varustekaapit ja harjoitustila",
    description:
      "Magneettisaappailla varustetut painepuvut roikkuvat täyttöletkuissa ulkokävelyjä varten. Viereiselle lattialle on raivattu avoin tila fyysistä harjoittelua ja keikkavarusteiden huoltoa varten.",
    statusLabel: "Toiminnassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 380,
  },

  // Kansi 4: Kone- ja alarunkokansi
  {
    key: "engine-room",
    deckNumber: 4,
    kind: "facility",
    svgZoneId: "d4-engine",
    name: "Konehuone",
    subtitle: "Kolvattu ohjainlevy ja päätyöntö",
    description:
      "Jäähdytysputkien keskellä sykkii Kilven holvista varastettu muinainen ohjainlevy, jonka tuoreet juotokset kytkevät päämoottorit eloon. Konsoli puhuu Arkkitehtuuristandardia, ja kilpidiagnostiikka varoittaa kanavapaon vaurioista.",
    statusLabel: "Suojakilvet vajaateholla",
    statusTone: "warning",
    isLocked: false,
    orderIndex: 510,
  },
  {
    key: "reactor-stores",
    deckNumber: 4,
    kind: "facility",
    svgZoneId: "d4-reactor",
    name: "Reaktori",
    subtitle: "Polttoainesäiliöt, vaihemuuntimet ja vesikierto",
    description:
      "Vuosikausia säästöteholla hyrissyt reaktori ja raskaat vaihemuuntimet jakavat virtaa herätettyyn runkoon. Viereisten polttoaine- ja vesisylinterien mittalasit näyttävät matalaa pintaa.",
    statusLabel: "Varannot vähissä",
    statusTone: "warning",
    isLocked: false,
    orderIndex: 520,
  },
  {
    key: "hvac-core",
    deckNumber: 4,
    kind: "facility",
    svgZoneId: "d4-hvac",
    name: "Ilmanvaihto",
    subtitle: "Suodatinrummut ja kansipaineistus",
    description:
      "Raskaat suodatinrummut kierrättävät hengitysilmaa asuttujen kansien läpi puhallettuaan vuosikausien pölyt ulos heräämisen yhteydessä. Käsipyörillä voi sulkea tai paineistaa yksittäisiä käytävälohkoja.",
    statusLabel: "Toiminnassa",
    statusTone: "normal",
    isLocked: false,
    orderIndex: 530,
  },
  {
    key: "sealed-archive",
    deckNumber: 4,
    kind: "sealed",
    svgZoneId: "d4-sealed-archive",
    name: "Laiva-arkisto",
    subtitle: "Sinetöity muistiholvi ja palvelimet",
    description:
      "Mekaanisilla pulttilukoilla suljettu paineovi eristää alarungon vanhimman tietokantaholvin. Oven takaa kuuluu tasainen jäähdytyshumina.",
    statusLabel: "Sinetöity",
    statusTone: "locked",
    isLocked: true,
    orderIndex: 610,
  },
  {
    key: "sealed-shafts",
    deckNumber: 4,
    kind: "sealed",
    svgZoneId: "d4-sealed-shafts",
    name: "Huoltokuilut",
    subtitle: "Paineistamattomat pohjakäytävät",
    description:
      "Kapeat huoltokuilut ja salaluukkujen reitit risteilevät pimeässä pohjarungossa ilman valaistusta. Osa laipioista on jumittunut kiinni aluksen pitkän hiljaiselon aikana.",
    statusLabel: "Paineistamaton",
    statusTone: "locked",
    isLocked: true,
    orderIndex: 620,
  },
];

export const DEFAULT_SHIP_ROOMS: SeedShipRoom[] = [
  ...FACILITY_AND_SEALED_ROOMS,
  ...CABIN_WING_SPECS.flatMap(buildCabinWingRooms),
];
