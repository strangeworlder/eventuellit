export type TarotArcana = "major" | "minor";
export type TarotSuit = "wands" | "cups" | "swords" | "disks";
export type TarotCourtRank = "page" | "knight" | "queen" | "king";

export interface AnchorPolarity {
  title: string;
  description: string;
}

export interface AnchorCard {
  id: string;
  name: string;
  internalRef: string;
  arcana: TarotArcana;
  suit?: TarotSuit;
  rank?: number | TarotCourtRank | "ace";
  polarityA: AnchorPolarity;
  polarityB: AnchorPolarity;
  description: string;
}

export type AnchorCardData = AnchorCard;

export const ANCHOR_CARDS: readonly AnchorCard[] = [
  {
    id: "kuilu",
    name: "Kuilu",
    internalRef: "Atu 0: The Fool",
    arcana: "major",
    polarityA: {
      title: "Syöksy",
      description: "Putoaminen ilman pohjaa.",
    },
    polarityB: {
      title: "Pysähdys",
      description: "Liikkumattomuus romahduksen keskellä.",
    },
    description:
      "Painoton huimaus ja äänetön keveys. Tyhjyys lakkaa olemasta pudotus silloin, kun jalat unohtavat kiinteän aineen.",
  },
  {
    id: "virta",
    name: "Virta",
    internalRef: "Atu I: The Magus",
    arcana: "major",
    polarityA: {
      title: "Sytytys",
      description: "Voima, joka tottelee tahtoa.",
    },
    polarityB: {
      title: "Katkos",
      description: "Mykkyys signaalin sydämessä.",
    },
    description:
      "Taajuuksien värinä ja hermostollinen kumu. Kaikki liike hakee vääjäämättä väylää purkautua.",
  },
  {
    id: "nakija",
    name: "Näkijä",
    internalRef: "Atu II: The Priestess",
    arcana: "major",
    polarityA: {
      title: "Kätkö",
      description: "Salaisuus vailla muotoa.",
    },
    polarityB: {
      title: "Avaus",
      description: "Totuus ilman suojaa.",
    },
    description:
      "Hylätyn tilan hyytävä viileys. Vaisto tietää tarkasti sen, mitä kieli ei tavoita.",
  },
  {
    id: "lahde",
    name: "Lähde",
    internalRef: "Atu III: The Empress",
    arcana: "major",
    polarityA: {
      title: "Kasvu",
      description: "Elpyminen kuoleman rajalla.",
    },
    polarityB: {
      title: "Kuihtumus",
      description: "Pysähdys elämän virrassa.",
    },
    description:
      "Sitkeä orgaaninen syke kylmässä materiaalissa. Elämä valtaa tilan kysymättä lupaa kukoistaa.",
  },
  {
    id: "raja",
    name: "Raja",
    internalRef: "Atu IV: The Emperor",
    arcana: "major",
    polarityA: {
      title: "Käsky",
      description: "Tahto vailla säröä.",
    },
    polarityB: {
      title: "Murtuma",
      description: "Sortuminen oman painonsa alla.",
    },
    description:
      "Kiven liikkumaton paino ja kova geometria. Linnoitus, joka seisoo vakaana kaaosta vasten.",
  },
  {
    id: "sana",
    name: "Sana",
    internalRef: "Atu V: The Hierophant",
    arcana: "major",
    polarityA: {
      title: "Vala",
      description: "Side, joka ei heltiä.",
    },
    polarityB: {
      title: "Epäilys",
      description: "Särö ikuisessa dogmissa.",
    },
    description:
      "Vanhan kaavan metallinen sointi. Säännöt ja sanat, jotka kaikuvat tyhjässä tilassa.",
  },
  {
    id: "liitto",
    name: "Liitto",
    internalRef: "Atu VI: The Lovers",
    arcana: "major",
    polarityA: {
      title: "Yhteys",
      description: "Kaksi tilaa yhtenä rintamana.",
    },
    polarityB: {
      title: "Ero",
      description: "Side, joka leikkautuu olemattomiin.",
    },
    description:
      "Kahden painon yhteinen painopiste ja jaettu hengitys. Luottamus on sähköistä ja ehdotonta.",
  },
  {
    id: "vaunu",
    name: "Vaunu",
    internalRef: "Atu VII: The Chariot",
    arcana: "major",
    polarityA: {
      title: "Rynnistys",
      description: "Liike, jota mikään ei pidättele.",
    },
    polarityB: {
      title: "Linnoite",
      description: "Asema, josta ei peräännytä.",
    },
    description:
      "Kineettisen massan murskaava liikevoima. Inertia, joka ei suostu pysähtymään esteisiin.",
  },
  {
    id: "vaaka",
    name: "Vaaka",
    internalRef: "Atu VIII: Adjustment",
    arcana: "major",
    polarityA: {
      title: "Punninta",
      description: "Painopisteen virheetön asettelu.",
    },
    polarityB: {
      title: "Käännös",
      description: "Liikevoima itseään vastaan.",
    },
    description:
      "Kirurginen symmetria ja analyyttinen viileys. Jokaisella voimalla on tarkka ja vääjäämätön vastineensa.",
  },
  {
    id: "erakko",
    name: "Erakko",
    internalRef: "Atu IX: The Hermit",
    arcana: "major",
    polarityA: {
      title: "Piilo",
      description: "Askel ilman ääntä.",
    },
    polarityB: {
      title: "Opastus",
      description: "Valo keskellä pimeyttä.",
    },
    description:
      "Pimeyden eristynyt rauha. Yksinäinen kiintopiste, joka kantaa läpi syvimmän tyhjyyden.",
  },
  {
    id: "ratas",
    name: "Ratas",
    internalRef: "Atu X: Fortune",
    arcana: "major",
    polarityA: {
      title: "Onni",
      description: "Nousu suoraan syvyydestä.",
    },
    polarityB: {
      title: "Tuho",
      description: "Murtuma ehjässä kehässä.",
    },
    description:
      "Hammasrattaiden säälimätön kierto ja vääjäämätön rytmi. Aika vaihtaa vuoroin arvot toisikseen.",
  },
  {
    id: "liekki",
    name: "Liekki",
    internalRef: "Atu XI: Lust",
    arcana: "major",
    polarityA: {
      title: "Palo",
      description: "Hehku yli kivun rajojen.",
    },
    polarityB: {
      title: "Lauhdutus",
      description: "Kiihko, joka sammuu hetkessä.",
    },
    description:
      "Raaka kineettinen kiihko ja hallitsematon nälkä. Voima, joka polttaa epävarmuuden karrelle.",
  },
  {
    id: "riippuja",
    name: "Riippuja",
    internalRef: "Atu XII: The Hanged Man",
    arcana: "major",
    polarityA: {
      title: "Luopumus",
      description: "Osa, joka annetaan kokonaisuudelle.",
    },
    polarityB: {
      title: "Irrotus",
      description: "Ote, joka liukenee tyhjyyteen.",
    },
    description:
      "Pysähtynyt aika vapaaehtoisessa luopumisessa. Syvä lepo silloin, kun kaikki muu kaatuu ympäriltä.",
  },
  {
    id: "loppu",
    name: "Loppu",
    internalRef: "Atu XIII: Death",
    arcana: "major",
    polarityA: {
      title: "Surma",
      description: "Katkos ilman armoa.",
    },
    polarityB: {
      title: "Alku",
      description: "Tyhjyys uuden edellä.",
    },
    description:
      "Jääkylmä lopullisuus ja vanhan rakenteen sortuminen. Vääjäämätön siirtymä, jota mikään ei peruuta.",
  },
  {
    id: "tislaus",
    name: "Tislaus",
    internalRef: "Atu XIV: Art",
    arcana: "major",
    polarityA: {
      title: "Synteesi",
      description: "Kaksi voimaa yhtenä virtana.",
    },
    polarityB: {
      title: "Liuotus",
      description: "Kiinteä muoto, joka haihtuu.",
    },
    description:
      "Vastakohtien hallittu yhteenkietoutuminen. Kaksi erillistä olemusta muuttuvat yhdeksi aineeksi.",
  },
  {
    id: "kahle",
    name: "Kahle",
    internalRef: "Atu XV: The Devil",
    arcana: "major",
    polarityA: {
      title: "Sidos",
      description: "Pakko, josta ei voi kieltäytyä.",
    },
    polarityB: {
      title: "Murto",
      description: "Kahle, joka pirstoutuu olemattomiin.",
    },
    description:
      "Riippuvuuden näkymätön vetovoima ja sidottu tahto. Heikkous, joka kietoutuu toiseen vastustamattomasti.",
  },
  {
    id: "torni",
    name: "Torni",
    internalRef: "Atu XVI: The Tower",
    arcana: "major",
    polarityA: {
      title: "Sortuma",
      description: "Kaiken pystyssä olevan romahdus.",
    },
    polarityB: {
      title: "Tyven",
      description: "Ehjä ydin keskellä hävitystä.",
    },
    description:
      "Paineenalaisen rakenteen äkillinen murtuminen. Koko vakiintunut tila hajoaa sekunneissa palasiksi.",
  },
  {
    id: "tahti",
    name: "Tähti",
    internalRef: "Atu XVII: The Star",
    arcana: "major",
    polarityA: {
      title: "Suunta",
      description: "Selkeys keskellä harhaa.",
    },
    polarityB: {
      title: "Toivo",
      description: "Valo ilman ehtoja.",
    },
    description:
      "Kirkas kiintopiste mustassa tyhjyydessä. Kaukainen signaali, joka leikkaa eksyksen halki.",
  },
  {
    id: "varjo",
    name: "Varjo",
    internalRef: "Atu XVIII: The Moon",
    arcana: "major",
    polarityA: {
      title: "Kuvitelma",
      description: "Näky, joka vääristää tilan.",
    },
    polarityB: {
      title: "Kirkkaus",
      description: "Katse läpi sakean sumun.",
    },
    description:
      "Harhojen ja aistipaineen sakea hämärä. Pinnan alla vaaniva kylmä ja huojuva epävarmuus.",
  },
  {
    id: "aurinko",
    name: "Aurinko",
    internalRef: "Atu XIX: The Sun",
    arcana: "major",
    polarityA: {
      title: "Loiste",
      description: "Valo, joka peittää kaiken.",
    },
    polarityB: {
      title: "Paljastus",
      description: "Hämärä, joka muuttuu totuudeksi.",
    },
    description: "Sokaiseva säteily ja polttava kuumuus. Kaikki kätketty tulee esiin ilman armoa.",
  },
  {
    id: "heratys",
    name: "Herätys",
    internalRef: "Atu XX: The Aeon",
    arcana: "major",
    polarityA: {
      title: "Kutsu",
      description: "Voima, joka nousee unesta.",
    },
    polarityB: {
      title: "Haudonta",
      description: "Hiljaisuus, joka nielee aaveen.",
    },
    description:
      "Menneen ajan syvä kaiku ja heräävä muisti. Vanha maailma nousee pitkästä unohduksesta.",
  },
  {
    id: "keha",
    name: "Kehä",
    internalRef: "Atu XXI: The Universe",
    arcana: "major",
    polarityA: {
      title: "Ykseys",
      description: "Kaikki osat yhtenä kokonaisuutena.",
    },
    polarityB: {
      title: "Sulku",
      description: "Raja, jonka läpi mikään ei pääse.",
    },
    description:
      "Täydellinen geometria ja sulkeutuva ympyrä. Kaikkien voimien samanaikainen ja vakaa läsnäolo.",
  },
  {
    id: "kipina",
    name: "Kipinä",
    internalRef: "Ace of Wands",
    arcana: "minor",
    suit: "wands",
    rank: "ace",
    polarityA: {
      title: "Leimahdus",
      description: "Syttyminen tyhjästä tilasta.",
    },
    polarityB: {
      title: "Sammutus",
      description: "Palo, joka laantuu sekunnissa.",
    },
    description:
      "Alkusytytys kylmässä pimeydessä ja kuumentuvan aineen tuoksu. Puhdas kineettinen palo.",
  },
  {
    id: "valta",
    name: "Valta",
    internalRef: "2 of Wands: Dominion",
    arcana: "minor",
    suit: "wands",
    rank: 2,
    polarityA: {
      title: "Paine",
      description: "Tila, joka taipuu komentoon.",
    },
    polarityB: {
      title: "Vastus",
      description: "Voima, joka murenee tyhjyyteen.",
    },
    description:
      "Kireä jännite ja herruus tilassa. Päätös ottaa suunta omiin käsiin ilman selityksiä.",
  },
  {
    id: "vakaus",
    name: "Vakaus",
    internalRef: "3 of Wands: Virtue",
    arcana: "minor",
    suit: "wands",
    rank: 3,
    polarityA: {
      title: "Eteneminen",
      description: "Liike läpi kaiken vastuksen.",
    },
    polarityB: {
      title: "Pito",
      description: "Linja, joka ei taivu taaksepäin.",
    },
    description:
      "Murtumaton eteenpäin suuntautuva tahto. Askel ei lipsu silloin, kun maali on lukittu.",
  },
  {
    id: "valmis",
    name: "Valmis",
    internalRef: "4 of Wands: Completion",
    arcana: "minor",
    suit: "wands",
    rank: 4,
    polarityA: {
      title: "Täyttymys",
      description: "Tehtävä, joka saa muodon.",
    },
    polarityB: {
      title: "Purku",
      description: "Valmis muoto, joka hajotetaan.",
    },
    description:
      "Viimeisen sauman sulkeutuminen ja rakenteen asettuminen. Työ saavuttaa pysyvän muotonsa.",
  },
  {
    id: "riita",
    name: "Riita",
    internalRef: "5 of Wands: Strife",
    arcana: "minor",
    suit: "wands",
    rank: 5,
    polarityA: {
      title: "Kaaos",
      description: "Hallitsematon törmäys ilman johtoa.",
    },
    polarityB: {
      title: "Rauhoitus",
      description: "Kohu, joka katkeaa yhteen sanaan.",
    },
    description:
      "Kireä hankaussähkö ja yhteentörmäyksen kumu. Ilma täyttyy vaarasta ja arvaamattomasta kahnauksesta.",
  },
  {
    id: "voitto",
    name: "Voitto",
    internalRef: "6 of Wands: Victory",
    arcana: "minor",
    suit: "wands",
    rank: 6,
    polarityA: {
      title: "Murto",
      description: "Este, joka kaatuu rynnäkössä.",
    },
    polarityB: {
      title: "Kokoaminen",
      description: "Hajallaan oleva voima yhtenä massana.",
    },
    description:
      "Vastuksen murtuminen ja kumea voiman nousu. Liikevoima, joka nousee esteiden yläpuolelle.",
  },
  {
    id: "uhma",
    name: "Uhma",
    internalRef: "7 of Wands: Valour",
    arcana: "minor",
    suit: "wands",
    rank: 7,
    polarityA: {
      title: "Seisaus",
      description: "Ylivoima, joka tyssää yhteen tahtoon.",
    },
    polarityB: {
      title: "Vastaus",
      description: "Isku, joka osuu paineen ytimeen.",
    },
    description:
      "Yksinäinen rintama ylivoimaa vastaan. Kieltäytyminen taipumasta musertavan paineen alla.",
  },
  {
    id: "syoksy",
    name: "Syöksy",
    internalRef: "8 of Wands: Swiftness",
    arcana: "minor",
    suit: "wands",
    rank: 8,
    polarityA: {
      title: "Isku",
      description: "Osuma ennen havaintoa.",
    },
    polarityB: {
      title: "Seis",
      description: "Pysähdys suoraan täydestä vauhdista.",
    },
    description:
      "Kiihtyvyys vailla vastusta. Teon ja seurauksen välinen aika supistuu olemattomiin.",
  },
  {
    id: "voima",
    name: "Voima",
    internalRef: "9 of Wands: Strength",
    arcana: "minor",
    suit: "wands",
    rank: 9,
    polarityA: {
      title: "Sieto",
      description: "Toiminta yli äärimmäisen rasituksen.",
    },
    polarityB: {
      title: "Panssari",
      description: "Suoja, joka ei murru moukaroinnista.",
    },
    description:
      "Väsymätön kestävyys ja valurautainen selkä. Rakenne, joka ottaa vastaan iskun toisensa jälkeen.",
  },
  {
    id: "taakka",
    name: "Taakka",
    internalRef: "10 of Wands: Oppression",
    arcana: "minor",
    suit: "wands",
    rank: 10,
    polarityA: {
      title: "Kanto",
      description: "Paino, joka siirtyy perille.",
    },
    polarityB: {
      title: "Pudotus",
      description: "Kuorma, joka hylätään hetkessä.",
    },
    description:
      "Raskaan massan musertava paino harteilla. Askel etenee, vaikka kuorma tuntuu ylivoimaiselta.",
  },
  {
    id: "kuriiri",
    name: "Kuriiri",
    internalRef: "Page of Wands",
    arcana: "minor",
    suit: "wands",
    rank: "page",
    polarityA: {
      title: "Välitys",
      description: "Sanoma, joka kulkee läpi sulkujen.",
    },
    polarityB: {
      title: "Mykistys",
      description: "Hälytys, joka vaimenee alkuunsa.",
    },
    description:
      "Nopea hengitys ja levoton kipinä jänteissä. Liike, joka luikahtaa suljettujen esteiden välistä.",
  },
  {
    id: "ratsastaja",
    name: "Ratsastaja",
    internalRef: "Knight of Wands",
    arcana: "minor",
    suit: "wands",
    rank: "knight",
    polarityA: {
      title: "Rynnäkkö",
      description: "Hyökkäys suoraan vaaran ytimeen.",
    },
    polarityB: {
      title: "Väistö",
      description: "Suunnanmuutos täydestä vauhdista.",
    },
    description:
      "Ylikuumentunut kiihko ja liike suoraan leimahdukseen. Vauhti, joka unohtaa varovaisuuden.",
  },
  {
    id: "valtiatar",
    name: "Valtiatar",
    internalRef: "Queen of Wands",
    arcana: "minor",
    suit: "wands",
    rank: "queen",
    polarityA: {
      title: "Sytytys",
      description: "Tahto, joka herättää joukon eloon.",
    },
    polarityB: {
      title: "Jäätyminen",
      description: "Uhma, joka laantuu katseesta.",
    },
    description:
      "Leimuava lämpö ja kova, kyseenalaistamaton auktoriteetti. Katse, joka herättää ehdottoman kunnioituksen.",
  },
  {
    id: "mestari",
    name: "Mestari",
    internalRef: "King of Wands",
    arcana: "minor",
    suit: "wands",
    rank: "king",
    polarityA: {
      title: "Keskitys",
      description: "Kaikki voima yhteen pisteeseen.",
    },
    polarityB: {
      title: "Hajautus",
      description: "Isku, joka raukeaa tyhjyyteen.",
    },
    description:
      "Kineettisen energian ylin hallinta. Silmä, joka näkee laajan taistelun yhtenä liekkinä.",
  },
  {
    id: "malja",
    name: "Malja",
    internalRef: "Ace of Cups",
    arcana: "minor",
    suit: "cups",
    rank: "ace",
    polarityA: {
      title: "Täyttö",
      description: "Tyhjyys, joka täyttyy elämästä.",
    },
    polarityB: {
      title: "Tyhjennys",
      description: "Vuoto, joka tyrehtyy hetkessä.",
    },
    description:
      "Kirkkaan elatusnesteen pulppuaminen ja kumea virtaus. Syvä elonjano kuolleessa tilassa.",
  },
  {
    id: "sopu",
    name: "Sopu",
    internalRef: "2 of Cups: Love",
    arcana: "minor",
    suit: "cups",
    rank: 2,
    polarityA: {
      title: "Liittymys",
      description: "Yhteys epäluulon tilalle.",
    },
    polarityB: {
      title: "Kylmyys",
      description: "Tunteet, jotka vaipuvat sivuun.",
    },
    description:
      "Sanaton luottamus ja hiljainen nyökkäys vaaran kynnyksellä. Kahden tahdon liittyminen yhteen.",
  },
  {
    id: "juhla",
    name: "Juhla",
    internalRef: "3 of Cups: Abundance",
    arcana: "minor",
    suit: "cups",
    rank: 3,
    polarityA: {
      title: "Nostatus",
      description: "Voima, joka palauttaa elämänilon.",
    },
    polarityB: {
      title: "Uuvutus",
      description: "Valppaus, joka vaipuu uneen.",
    },
    description:
      "Lyhyt unohdus kylmyyden keskellä ja vapaa hengitys. Jaettu helpotus onnistumisen jälkeen.",
  },
  {
    id: "kyllaisyys",
    name: "Kylläisyys",
    internalRef: "4 of Cups: Luxury",
    arcana: "minor",
    suit: "cups",
    rank: 4,
    polarityA: {
      title: "Sulautus",
      description: "Läsnäolo, joka uppoaa joukkoon.",
    },
    polarityB: {
      title: "Kieltämys",
      description: "Mukavuus, joka torjutaan tyynesti.",
    },
    description:
      "Raskas mukavuus ja yltäkylläinen lepo. Tila, jossa unohdus peittää lähestyvän vaaran.",
  },
  {
    id: "murhe",
    name: "Murhe",
    internalRef: "5 of Cups: Disappointment",
    arcana: "minor",
    suit: "cups",
    rank: 5,
    polarityA: {
      title: "Sisu",
      description: "Suru, joka kääntyy tahdoksi.",
    },
    polarityB: {
      title: "Murennus",
      description: "Haava, josta toinen murtuu.",
    },
    description:
      "Menetyksen armoton hyhmä ja tyhjäksi jäänyt paikka. Katsominen siihen, mikä ei palaa koskaan.",
  },
  {
    id: "muisto",
    name: "Muisto",
    internalRef: "6 of Cups: Pleasure",
    arcana: "minor",
    suit: "cups",
    rank: 6,
    polarityA: {
      title: "Suojelu",
      description: "Hauraus, joka pidetään ehjänä.",
    },
    polarityB: {
      title: "Riisunta",
      description: "Illuusio, joka kuoritaan pois.",
    },
    description:
      "Kaukainen kaiku menneestä ja tuttu sävel tyhjyydessä. Lämpö ajasta ennen suurta tuhoa.",
  },
  {
    id: "harha",
    name: "Harha",
    internalRef: "7 of Cups: Debauch",
    arcana: "minor",
    suit: "cups",
    rank: 7,
    polarityA: {
      title: "Lumous",
      description: "Näky, joka lumoaa mielen.",
    },
    polarityB: {
      title: "Selkeys",
      description: "Silmä, joka hylkii unikuvaa.",
    },
    description:
      "Aistien sakea sumu ja vääristyneet heijastukset. Houkutukset, jotka johtavat syvemmälle uneen.",
  },
  {
    id: "luopumus",
    name: "Luopumus",
    internalRef: "8 of Cups: Indolence",
    arcana: "minor",
    suit: "cups",
    rank: 8,
    polarityA: {
      title: "Lähtö",
      description: "Askel eteenpäin ilman taakkaa.",
    },
    polarityB: {
      title: "Paluu",
      description: "Uupunut mieli, joka kutsutaan takaisin.",
    },
    description:
      "Hylätty vanha ja selän kääntäminen menneelle. Askel pois silloin, kun mikään ei sido kiinni.",
  },
  {
    id: "ilo",
    name: "Ilo",
    internalRef: "9 of Cups: Happiness",
    arcana: "minor",
    suit: "cups",
    rank: 9,
    polarityA: {
      title: "Lepo",
      description: "Voimat, jotka palaavat hiljaisuudessa.",
    },
    polarityB: {
      title: "Varoitus",
      description: "Valppaus tyyneyden kätkössä.",
    },
    description:
      "Syvä huokaus vaaran jälkeen ja puhdas tyyneys. Varmuus siitä, että pahin on takana päin.",
  },
  {
    id: "tyven",
    name: "Tyven",
    internalRef: "10 of Cups: Satiety",
    arcana: "minor",
    suit: "cups",
    rank: 10,
    polarityA: {
      title: "Rauha",
      description: "Yhteys, jota mikään ei riko.",
    },
    polarityB: {
      title: "Särkeminen",
      description: "Lepo, joka murtuu yllätyksestä.",
    },
    description: "Peilityyni virtaus ja suojaisa syli. Hiljainen hetki suuren myrskyn mentyä ohi.",
  },
  {
    id: "lapsi",
    name: "Lapsi",
    internalRef: "Page of Cups",
    arcana: "minor",
    suit: "cups",
    rank: "page",
    polarityA: {
      title: "Aisti",
      description: "Vaara, joka tuntuu ennen tuloaan.",
    },
    polarityB: {
      title: "Viattomuus",
      description: "Olemus, jota kukaan ei epäile.",
    },
    description:
      "Vaistonvarainen herkkyys ympäristön värähtelyille. Katse, joka aistii heti pinnan alla liikkuvan.",
  },
  {
    id: "etsija",
    name: "Etsijä",
    internalRef: "Knight of Cups",
    arcana: "minor",
    suit: "cups",
    rank: "knight",
    polarityA: {
      title: "Virtaus",
      description: "Liike ilman kitkaa.",
    },
    polarityB: {
      title: "Pelastus",
      description: "Ote, joka kantaa pinnalle.",
    },
    description:
      "Sukellus syvään virtaukseen vailla köyttä. Liike aallon mukana kohti kadonnutta pistettä.",
  },
  {
    id: "syvyys",
    name: "Syvyys",
    internalRef: "Queen of Cups",
    arcana: "minor",
    suit: "cups",
    rank: "queen",
    polarityA: {
      title: "Lohdutus",
      description: "Tuska, joka laantuu kosketuksesta.",
    },
    polarityB: {
      title: "Kauhu",
      description: "Pelko, joka nousee pintaan.",
    },
    description:
      "Pimeiden vesien liikkumaton peili. Tyyni katse, joka heijastaa toisen haudatut pelot.",
  },
  {
    id: "virtaus",
    name: "Virtaus",
    internalRef: "King of Cups",
    arcana: "minor",
    suit: "cups",
    rank: "king",
    polarityA: {
      title: "Johto",
      description: "Aalto, joka ohjataan kohteeseen.",
    },
    polarityB: {
      title: "Pato",
      description: "Paine, joka suljetaan murtumattomasti.",
    },
    description:
      "Syvien virtojen ja paineiden tyyni hallinta. Vakaa mieli keskellä vellovaa ja arvaamatonta merta.",
  },
  {
    id: "tera",
    name: "Terä",
    internalRef: "Ace of Swords",
    arcana: "minor",
    suit: "swords",
    rank: "ace",
    polarityA: {
      title: "Viilto",
      description: "Puhdas jako ilman vastusta.",
    },
    polarityB: {
      title: "Totuus",
      description: "Kova fakta vailla verhoa.",
    },
    description:
      "Kirurginen selkeys ja paljas valo. Viilto jakaa todellisuuden toteen ja valheeseen.",
  },
  {
    id: "rauha",
    name: "Rauha",
    internalRef: "2 of Swords: Peace",
    arcana: "minor",
    suit: "swords",
    rank: 2,
    polarityA: {
      title: "Pysähdys",
      description: "Uhka, joka pakottaa hiljaisuuteen.",
    },
    polarityB: {
      title: "Laukaisu",
      description: "Pysähdys, joka murtuu iskulla.",
    },
    description:
      "Kaksi terää vastakkain ja hyytävä seisokki. Hetki, jolloin pieninkin liike laukaisee tuhon.",
  },
  {
    id: "kipu",
    name: "Kipu",
    internalRef: "3 of Swords: Sorrow",
    arcana: "minor",
    suit: "swords",
    rank: 3,
    polarityA: {
      title: "Haava",
      description: "Isku, joka lamauttaa ytimen.",
    },
    polarityB: {
      title: "Arpi",
      description: "Pinta, joka ei enää tunne tuskaa.",
    },
    description:
      "Menetyksen armoton pakkanen ja revitty pinta. Kärsimys, joka kieltäytyy antamasta periksi.",
  },
  {
    id: "lepo",
    name: "Lepo",
    internalRef: "4 of Swords: Truce",
    arcana: "minor",
    suit: "swords",
    rank: 4,
    polarityA: {
      title: "Horros",
      description: "Elintoiminto, joka laskee näkymättömiin.",
    },
    polarityB: {
      title: "Purkaus",
      description: "Täysi herääminen suoraan unesta.",
    },
    description:
      "Huurteinen hiljaisuus ja panssarin alla tasaantuva hengitys. Valpas lepo ennen hälytystä.",
  },
  {
    id: "havio",
    name: "Häviö",
    internalRef: "5 of Swords: Defeat",
    arcana: "minor",
    suit: "swords",
    rank: 5,
    polarityA: {
      title: "Irtauma",
      description: "Poistuminen ehjänä raunioista.",
    },
    polarityB: {
      title: "Ansa",
      description: "Tappio, joka kääntyy vastustajan tuhoksi.",
    },
    description:
      "Hävityn ottelun karvas maku ja veren pyyhintä. Vaisto tietää tarkasti milloin vetäytyä.",
  },
  {
    id: "ylitys",
    name: "Ylitys",
    internalRef: "6 of Swords: Science",
    arcana: "minor",
    suit: "swords",
    rank: 6,
    polarityA: {
      title: "Logiikka",
      description: "Solmu, joka ratkeaa ajatuksella.",
    },
    polarityB: {
      title: "Siirtymä",
      description: "Kulku vaaran halki ilman osumaa.",
    },
    description:
      "Matka sumuisen syvyyden ylitse ja tasainen suunta. Looginen polku halki vaaravyöhykkeen.",
  },
  {
    id: "petos",
    name: "Petos",
    internalRef: "7 of Swords: Futility",
    arcana: "minor",
    suit: "swords",
    rank: 7,
    polarityA: {
      title: "Anastus",
      description: "Esine, joka katoaa silmien edestä.",
    },
    polarityB: {
      title: "Eksytys",
      description: "Jälki, joka johtaa tyhjyyteen.",
    },
    description:
      "Varastettu arvo ja nopea vilkaisu taaksepäin. Liukuminen vartioitujen silmien ohi.",
  },
  {
    id: "vanki",
    name: "Vanki",
    internalRef: "8 of Swords: Interference",
    arcana: "minor",
    suit: "swords",
    rank: 8,
    polarityA: {
      title: "Pako",
      description: "Eristys, joka murtuu sisältä.",
    },
    polarityB: {
      title: "Saarto",
      description: "Sulku, johon toinen ajetaan.",
    },
    description:
      "Pimeä sulku ja omien ajatusten kehä. Lukkojen rakenne hahmottuu sormissa sokeanakin.",
  },
  {
    id: "julmuus",
    name: "Julmuus",
    internalRef: "9 of Swords: Cruelty",
    arcana: "minor",
    suit: "swords",
    rank: 9,
    polarityA: {
      title: "Puristus",
      description: "Salaisuus, joka revitään esiin.",
    },
    polarityB: {
      title: "Totuus",
      description: "Harha, joka murennetaan totuudella.",
    },
    description: "Valvomattomat hetket ja kylmä hiki. Tietoisuus siitä, mitä kova pakko vaatii.",
  },
  {
    id: "romahdus",
    name: "Romahdus",
    internalRef: "10 of Swords: Ruin",
    arcana: "minor",
    suit: "swords",
    rank: 10,
    polarityA: {
      title: "Kosto",
      description: "Tuho, joka viedään viholliselle kaatuessakin.",
    },
    polarityB: {
      title: "Nousu",
      description: "Elämä, joka nousee raunioista.",
    },
    description:
      "Viimeisen suojan kaatuminen ja seinien luhistuminen. Äärimmäinen teko silloin, kun kaikki on viety.",
  },
  {
    id: "tuuli",
    name: "Tuuli",
    internalRef: "Page of Swords",
    arcana: "minor",
    suit: "swords",
    rank: "page",
    polarityA: {
      title: "Hiivintä",
      description: "Askel ilman ääntä ja varjoa.",
    },
    polarityB: {
      title: "Katkaisu",
      description: "Hälytys, joka mykistetään sekunnissa.",
    },
    description:
      "Hiljainen liike korkealla ja tarkka katse pimeään. Viiltävä havainto ennen toisen kääntymistä.",
  },
  {
    id: "myrsky",
    name: "Myrsky",
    internalRef: "Knight of Swords",
    arcana: "minor",
    suit: "swords",
    rank: "knight",
    polarityA: {
      title: "Riisunta",
      description: "Ase, joka putoaa sekunnissa.",
    },
    polarityB: {
      title: "Rynnistys",
      description: "Isku, joka lamauttaa puolustuksen.",
    },
    description:
      "Viheltävä teräs ja säälimätön nopeus. Leikkaava isku ennen kuin toinen ehtii tähdätä.",
  },
  {
    id: "tuomari",
    name: "Tuomari",
    internalRef: "Queen of Swords",
    arcana: "minor",
    suit: "swords",
    rank: "queen",
    polarityA: {
      title: "Paljastus",
      description: "Valhe, joka särkyy kysymykseen.",
    },
    polarityB: {
      title: "Päätös",
      description: "Ratkaisu, joka tehdään epäröimättä.",
    },
    description: "Jääkylmä katse ja totuus vailla lievennyksiä. Kaikki selitykset riisutaan heti.",
  },
  {
    id: "arkkitehti",
    name: "Arkkitehti",
    internalRef: "King of Swords",
    arcana: "minor",
    suit: "swords",
    rank: "king",
    polarityA: {
      title: "Ennakointi",
      description: "Siirto, joka tiedetään ennen tekoa.",
    },
    polarityB: {
      title: "Käänne",
      description: "Tappio, joka muuttuu voitoksi.",
    },
    description:
      "Monimutkainen kokonaiskuva ja kylmä laskelmointi. Vastustajan siirtojen lukeminen ennalta.",
  },
  {
    id: "malmi",
    name: "Malmi",
    internalRef: "Ace of Disks",
    arcana: "minor",
    suit: "disks",
    rank: "ace",
    polarityA: {
      title: "Ydin",
      description: "Rakenne, joka kestää murtumatta.",
    },
    polarityB: {
      title: "Murskaus",
      description: "Kivi, joka halkeaa sydämestään.",
    },
    description:
      "Louhitun aineen raskas tiheys ja kiven kylmyys. Vankka ankkuroituminen materiaan.",
  },
  {
    id: "vaihto",
    name: "Vaihto",
    internalRef: "2 of Disks: Change",
    arcana: "minor",
    suit: "disks",
    rank: 2,
    polarityA: {
      title: "Kauppa",
      description: "Niukkuus, joka käännetään hyödyksi.",
    },
    polarityB: {
      title: "Piilotus",
      description: "Arvo, joka katoaa silmistä.",
    },
    description:
      "Arvojen siirtyminen kädestä toiseen hämärässä. Tasapainoilu puutteen ja yltäkylläisyyden välillä.",
  },
  {
    id: "tyo",
    name: "Työ",
    internalRef: "3 of Disks: Works",
    arcana: "minor",
    suit: "disks",
    rank: 3,
    polarityA: {
      title: "Korjaus",
      description: "Särkynyt aine, joka pakotetaan ehjäksi.",
    },
    polarityB: {
      title: "Sabotaasi",
      description: "Koneisto, joka pysähtyy yhdestä poistosta.",
    },
    description:
      "Kipinöiden sade ja rutiininomainen raskas liike. Käden taito, jolla rakenne pysyy koossa.",
  },
  {
    id: "holvi",
    name: "Holvi",
    internalRef: "4 of Disks: Power",
    arcana: "minor",
    suit: "disks",
    rank: 4,
    polarityA: {
      title: "Lukitus",
      description: "Tila, jota mikään vieras ei läpäise.",
    },
    polarityB: {
      title: "Murto",
      description: "Panssari, joka aukeaa mekaanisesti.",
    },
    description:
      "Paksut seinämät ja lukkojen kolahtaminen kiinni. Oman kätkön varjeleminen herkeämättä.",
  },
  {
    id: "hata",
    name: "Hätä",
    internalRef: "5 of Disks: Worry",
    arcana: "minor",
    suit: "disks",
    rank: 5,
    polarityA: {
      title: "Sinnikkyys",
      description: "Keho, joka toimii ilman lepoa.",
    },
    polarityB: {
      title: "Kaivelu",
      description: "Arvo, joka löytyy hylätystä romusta.",
    },
    description:
      "Paleltuneet nivelet ja tyhjyys säiliöissä. Kieltäytyminen kuolemasta puutteeseen.",
  },
  {
    id: "jako",
    name: "Jako",
    internalRef: "6 of Disks: Success",
    arcana: "minor",
    suit: "disks",
    rank: 6,
    polarityA: {
      title: "Osuus",
      description: "Aine, joka jaetaan täyteen hyötyyn.",
    },
    polarityB: {
      title: "Hinta",
      description: "Ahneus, jolle asetetaan tarkka luku.",
    },
    description: "Resurssien mittaaminen ja velkojen tasapaino. Jokainen saa sen, mikä kuuluu.",
  },
  {
    id: "halkeama",
    name: "Halkeama",
    internalRef: "7 of Disks: Failure",
    arcana: "minor",
    suit: "disks",
    rank: 7,
    polarityA: {
      title: "Elvytys",
      description: "Romu, joka saadaan toimimaan vielä kerran.",
    },
    polarityB: {
      title: "Uusio",
      description: "Kuollut osa, joka siirtyy hyötyyn.",
    },
    description:
      "Aine, joka leikkaa kiinni, ja hiljainen kiroilu hämärässä. Sinnikäs työ vian voittamiseksi.",
  },
  {
    id: "saato",
    name: "Säätö",
    internalRef: "8 of Disks: Prudence",
    arcana: "minor",
    suit: "disks",
    rank: 8,
    polarityA: {
      title: "Viritys",
      description: "Yksityiskohta, joka hiotaan täydelliseksi.",
    },
    polarityB: {
      title: "Kätkentä",
      description: "Ansa, jota kukaan ei havaitse.",
    },
    description:
      "Hiljainen keskittyminen mikroskooppisen pieneen yksityiskohtaan. Mittarien virheetön kohdistus.",
  },
  {
    id: "saalis",
    name: "Saalis",
    internalRef: "9 of Disks: Gain",
    arcana: "minor",
    suit: "disks",
    rank: 9,
    polarityA: {
      title: "Löytö",
      description: "Aarre, joka poimitaan romun seasta.",
    },
    polarityB: {
      title: "Kätkö",
      description: "Varasto, jota ryöstäjä ei tavoita.",
    },
    description:
      "Täysi varasto ja pitkän työn kerääntynyt hedelmä. Rauhallinen varmuus niukkuuden edessä.",
  },
  {
    id: "perinto",
    name: "Perintö",
    internalRef: "10 of Disks: Wealth",
    arcana: "minor",
    suit: "disks",
    rank: 10,
    polarityA: {
      title: "Jatkuvuus",
      description: "Muinainen muoto, joka palvelee edelleen.",
    },
    polarityB: {
      title: "Vapautus",
      description: "Menneisyyden velvoite, joka pyyhitään pois.",
    },
    description:
      "Sukupolvien vanha työkalu nyrkissä ja vastuu jatkuvuudesta. Se, mikä pidetään pystyssä tuleville.",
  },
  {
    id: "louhija",
    name: "Louhija",
    internalRef: "Page of Disks",
    arcana: "minor",
    suit: "disks",
    rank: "page",
    polarityA: {
      title: "Kivi",
      description: "Kiven heikkous, joka havaitaan äänestä.",
    },
    polarityB: {
      title: "Raivaus",
      description: "Sortuma, joka siirtyy tieltä.",
    },
    description:
      "Vasaran koputus kalliossa ja herkkä valppaus. Kivimassan painon aistiminen pimeässä.",
  },
  {
    id: "raivaaja",
    name: "Raivaaja",
    internalRef: "Knight of Disks",
    arcana: "minor",
    suit: "disks",
    rank: "knight",
    polarityA: {
      title: "Ajo",
      description: "Massa, joka kulkee läpi esteiden.",
    },
    polarityB: {
      title: "Ryhti",
      description: "Keho, joka pysyy pystyssä tärinässä.",
    },
    description:
      "Metallin kitinä ja inertia, jota mikään ei pysäytä. Vakaa eteneminen vaarallisella pohjalla.",
  },
  {
    id: "emo",
    name: "Emo",
    internalRef: "Queen of Disks",
    arcana: "minor",
    suit: "disks",
    rank: "queen",
    polarityA: {
      title: "Huolto",
      description: "Toisen jaksaminen, joka turvataan.",
    },
    polarityB: {
      title: "Kuri",
      description: "Huolimattomuus, joka kitketään heti.",
    },
    description:
      "Karhea ääni ja syvä huolenpito raskaan työn tekijöistä. Raaka ja maallinen viisaus.",
  },
  {
    id: "seppa",
    name: "Seppä",
    internalRef: "King of Disks",
    arcana: "minor",
    suit: "disks",
    rank: "king",
    polarityA: {
      title: "Takominen",
      description: "Rakenne, joka kasvaa nyrkkien alla.",
    },
    polarityB: {
      title: "Hiljennys",
      description: "Liike, joka pysäytetään hallitusti.",
    },
    description:
      "Raskaan metallin ja hehkun loputon sinfonia. Materiaalin muovaaminen vakaalla varmuudella.",
  },
];

export function getAnchorById(id: string): AnchorCard | undefined {
  return ANCHOR_CARDS.find((card) => card.id === id);
}

export function filterAvailableAnchors(claimedIds: readonly string[] = []): AnchorCard[] {
  const claimedSet = new Set(claimedIds);
  return ANCHOR_CARDS.filter((card) => !claimedSet.has(card.id));
}

export function drawRandomAnchors(count: number, claimedIds: readonly string[] = []): AnchorCard[] {
  const available = filterAvailableAnchors(claimedIds);
  if (available.length <= count) {
    return [...available];
  }

  // Fisher-Yates sample
  const pool = [...available];
  const drawn: AnchorCard[] = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    const [card] = pool.splice(randomIndex, 1);
    if (card) drawn.push(card);
  }
  return drawn;
}
