# Kynnyksen Ei-pelaajahahmot (NPC:t) ja Roolikortisto

Tämä hakemisto kokoaa yhteen Eventuellit-antologian keskeiset ei-pelaajahahmot (NPC:t), jotka on analysoitu pelatuista jaksoista ([metadata/Jaksot.md](file:///c:/Users/alvan/event/metadata/Jaksot.md)), pelipöydän raakatranskripteista ([metadata/transkriptit/](file:///c:/Users/alvan/event/metadata/transkriptit/)) sekä taustamateriaaleista. Hahmot on jaoteltu heidän edustamiensa valtaryhmittymien, kargokulttien ja toiminnallisten roolien mukaan.

---

## 1. Nimeämisen ontologia ja Petri-vertaus

Koko Kynnyksellä ja sen Arkkitehtuurissa vaikuttaa syvä kaksoisrakenne, joka erottaa pelaajahahmot (oikeat inhimilliset nimet) koneiston osista (toiminta- ja prosessinimet):

> [!NOTE]
> **NPC:iden nimet ovat heidän toimiaan** ([nimeaminen.md](file:///c:/Users/alvan/event/metadata/nimeaminen.md))  
> Ei-pelaajahahmoilla ei käytetä koodinimiä eikä tavanomaisia etu- ja sukunimiä. Hahmo on yhtä kuin se, mitä hän tekee, miten hän toimii tai mitä funktiota hän edustaa koneistossa. Maailmassa ei ole peiteidentiteettejä tai agenttien koodinimiä: nimi on suora kuvaus henkilön toiminnasta ja teoista.

### Maailmansisäinen arki vs. Pelaajien meta-näkymä:
* **Maailmansisäinen arki (Petri-vertaus):** Asukkaille nimet kuten *Tohtori Sydänmies*, *Yömyyrä*, *Lannanhaju*, *Poikkeama* tai *Alirutiini* eivät ole sen kummallisempia tai osoittelevampia kuin nimi **"Petri"** meidän arjessamme (*Petri* juontuu kalliosta/kivestä, jonka päälle kirkko rakennetaan, mutta kukaan ei huuda Petrille kadulla kirkon peruskalliosta). Ratasvartion kersantille *Yömyyrä* on vain miehen nimi.
* **Pelaajien meta-näkymä:** Pelipöydässä pelaajat kuulevat nimet sellaisina kuin ne ovat. Koska Arkkitehtuuri ei kykene aitoon inhimillisyyteen, se leimaa jokaisen komponenttinsa sen perimmäisen funktion mukaan. Nimi paljastaa pelaajille etukäteen NPC:n todellisen luonteen ja ohjelmoinnin.

---

## 2. Faktiojako ja kargokultit

Koska Tyranni on poistunut ja jättänyt pelipöydän tyhjäksi ([meta-metataso.md](file:///c:/Users/alvan/event/metadata/meta-metataso.md)), Kynnyksen vanhat valtakeskittymät toimivat **kargokultteina**, jotka matkivat vanhoja protokollia:

```
                          [ TYRROTTU ARKKITEHTUURI ]
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        ▼                            ▼                            ▼
  KW-KONSORTIO                   EKKLESIA                   TUHKAN PUOLUE
  (Gamismi-kargokultti)      (Narrativismi-kargokultti)   (Simulationismi-kargokultti)
  • Prosessit, virhekoodit,  • Mediaspektaakkeli,         • Sukupuu, maaperä, vanhat
    optimointi ja säännöt.     tragediateatteri ja TV.      säädyt ja status quo.
```

---

## 3. Hakemiston rakenne ja hahmoluettelo

### [KW-Konsortio](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/) (Gamismi, teknokratia ja sotilaskomento)
* [Komentaja Uppoamaton Kolossi](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/komentaja-uppoamaton-kolossi.md) — Evoluution enklaavin kyberneettinen järkäle ja aseen suojelija (Jakso 9).
* [Tohtori Sydänmies](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/tohtori-sydanmies.md) — Laki-aseman syyttäjäkyborgi, jonka sykkivä sydän näkyy läpinäkyvän rintapanssarin läpi (Jakso 5).
* [Lukuvarjo](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/lukuvarjo.md) — KW-Konsortion kylmä johtaja Versolla (Jakso 2).
* [Poikkeama](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/poikkeama.md) — Konsortion korkea prosessivalvoja ja tarkastaja Norsunluutornissa (Jakso 2).
* [Virhemarginaali](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/virhemarginaali.md) — Konsortion kybersoturi ja koodari Sumujuhlassa (Jakso 2).
* [Desimaali](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/desimaali.md) — Konsortion tilastoanalyytikko ja numeerinen optimoija Versolla (Jakso 2).
* [Optimi](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/optimi.md) — Konsortion teknisen huollon päällikkö Versolla (Jakso 2).
* [Alirutiini](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/alirutiini.md) — Prosessinimi: Lukuvarjon sihteeri Versolla (Jakso 2) & sähköverkon huoltoinsinööri Lailla (Jakso 5).
* [Lasiseinä](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/lasiseina.md) — KW-Konsortion deterministinen PR-nainen ja suhdetoimintavirkailija Versolla (Jakso 2).
* [Kielensyöjä](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/kielensyoja.md) — Ratasvartion upseeri Kilvellä, jolta kiristettiin koodit (Jakso 1).
* [Yömyyrä](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/yomyyra.md) — Ratasvartioon soluttautunut kaksoisagentti Rasvakuilussa (Jakso 9).
* [Pyrkyri](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/pyrkyri.md) — Kilven tutkimuskeskuksen sarvekas administraattori ja sääntöartefaktin haltija (Jakso 1).
* [Valkohanskainen Verikoira](file:///c:/Users/alvan/event/metadata/npct/kw-konsortio/valkohanskainen-verikoira.md) — Jahtikommodori Kryptan perhedraamassa (Jakso 10).

### [Ekklesia](file:///c:/Users/alvan/event/metadata/npct/ekklesia/) (Narrativismi, draamateatteri ja mediakirkko)
* [Iridiumkardinaali](file:///c:/Users/alvan/event/metadata/npct/ekklesia/iridiumkardinaali.md) — Suuren Sakramentin seremoniamestari ja Ekklesian PR-keulakuva (Jakso 9).
* [Hylätty Shakkikuningatar](file:///c:/Users/alvan/event/metadata/npct/ekklesia/hylatty-shakkikuningatar.md) — 13. kierron viides Megapaavi ja entinen sometähti Katedraalin alarakenteissa (Jakso 7).
* [Kipinä](file:///c:/Users/alvan/event/metadata/npct/ekklesia/kipina.md) — Propagandakuvaaja ja Pyhän Tragedian itsemurhafanaatikko (Jakso 2).
* [Sisar Piikki](file:///c:/Users/alvan/event/metadata/npct/ekklesia/sisar-piikki.md) — Häkin sairaanhoitajanunna ja fanaattinen kurittaja (Jakso 4).
* [Seuraaja](file:///c:/Users/alvan/event/metadata/npct/ekklesia/seuraaja.md) — Moniraajainen patsasolento, puhelimia pitelevä valvontahirviö ja huomiokoneisto (Jakso 7).
* [Sametti](file:///c:/Users/alvan/event/metadata/npct/ekklesia/sametti.md) — Häkin gladiaattoriareenan kyyninen ohjelmapäällikkö (Jakso 4).

### [Tuhkan puolue](file:///c:/Users/alvan/event/metadata/npct/tuhkan-puolue/) (Simulationismi, maaperä ja suku)
* [Kultakruunu](file:///c:/Users/alvan/event/metadata/npct/tuhkan-puolue/kultakruunu.md) — Tuhkan puolueen patriarkka Versolla ja Yunen isä (Jakso 2).
* [Verijuuri](file:///c:/Users/alvan/event/metadata/npct/tuhkan-puolue/verijuuri.md) — Heimolaisten vanha patriarkka ja heikkonäköinen todistaja (Jakso 5).
* [Lannanhaju](file:///c:/Users/alvan/event/metadata/npct/tuhkan-puolue/lannanhaju.md) — Huoltotyöläinen ja Verijuuren lapsi (Jakso 5).
* [Sukupuu](file:///c:/Users/alvan/event/metadata/npct/tuhkan-puolue/sukupuu.md) — Huoltokortteleiden puutarhuri ja Heimolaisten ankkuri (Jakso 5).
* [Myrkkykukka](file:///c:/Users/alvan/event/metadata/npct/tuhkan-puolue/myrkkykukka.md) — Tuhkan puolueen alamaailman huumeparoni ja kemisti Versolla (Jakso 2).

### [Kapina ja Veteraanit](file:///c:/Users/alvan/event/metadata/npct/kapina-ja-veteraanit/) (Vastarinnan jäänteet ja liittolaiset)
* [Meripihka (Kapinafilosofi)](file:///c:/Users/alvan/event/metadata/npct/kapina-ja-veteraanit/meripihka.md) — Kapinafilosofi, ajattelija ja vapaan tahdon teoreetikko (Jaksot 4 & 8).
* [Pommi](file:///c:/Users/alvan/event/metadata/npct/kapina-ja-veteraanit/pommi.md) — Pyhän Tragedian lapsi ja vanki, joka uhrasi itsensä Kustodia vastaan (Jakso 4).
* [Liekki](file:///c:/Users/alvan/event/metadata/npct/kapina-ja-veteraanit/liekki.md) — Punatukkainen sarvekas nainen, Pyhän Tragedian lapsi ja vanki Häkissä (Jaksot 4 & 7).

### [Laki ja Oikeus](file:///c:/Users/alvan/event/metadata/npct/laki-ja-oikeus/) (Tuomioistuimet ja virkakoneisto)
* [Turkoosi Oselotti](file:///c:/Users/alvan/event/metadata/npct/laki-ja-oikeus/turkoosi-oselotti.md) — Logiikan inkvisition eksentrinen tuomari, lakikonsultti ja Louhoksen tutkija (Jaksot 5 & 6).
* [Ylisihteeri Oka](file:///c:/Users/alvan/event/metadata/npct/laki-ja-oikeus/ylisihteeri-oka.md) — Logiikan inkvisition hallinnon murhattu ylisihteeri ja salaliiton paljastaja (Jakso 5).

### [Alamaailma ja Siviilit](file:///c:/Users/alvan/event/metadata/npct/alamaailma-ja-siviilit/) (Pimeät tasot, työläiset ja kontaktit)
* [Ketju](file:///c:/Users/alvan/event/metadata/npct/alamaailma-ja-siviilit/ketju.md) — Häkin Gen Pop -vankijengin johtaja (Jakso 4).
* [Shamaani](file:///c:/Users/alvan/event/metadata/npct/alamaailma-ja-siviilit/shamaani.md) — Mudan työläisten henkinen näkijä (Jakso 2).
* [R72](file:///c:/Users/alvan/event/metadata/npct/alamaailma-ja-siviilit/r72.md) — Roshin valtava susikoira Louhoksen syvyyksissä (Jakso 6).
* [Kaksiterä](file:///c:/Users/alvan/event/metadata/npct/alamaailma-ja-siviilit/kaksitera.md) — Ulkopuolinen jahtidiplomaatti Versolla (Jakso 2).

---

## 4. Kosmiset entiteetit (Pyhimykset)

Arkkitehtuurin Pyhimykset (*Harmonia, Quies, Kustodi, Lamenta, Aksios, Kronos, Logos*) ovat Syklin kosmisia luonnonlakeja ja huonon pelinjohtamisen metafyysisiä syntejä, erillään kuolevaisista faktio-NPC:istä. Heidän täydelliset mekaaniset ja ontologiset profiilinsa löytyvät erillisestä dokumentista:
👉 **[metadata/Pyhimykset.md](file:///c:/Users/alvan/event/metadata/Pyhimykset.md)**
