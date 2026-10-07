---
name: diegetic-pdf
description: Ohjeistus ja työkalusetti diegeettisten, tulostusvalmiiden PDF-pelaajamateriaalien (handouts & props) luomiseen HTML/CSS- ja Chrome-headless-tulostimella. Käytä aina kun luot tai muokkaat pelidokumentteja tai tulostettavia PDF-materiaaleja.
---

# Diegeettisten PDF-materiaalien taitosetti (Diegetic PDF Skill)

Tämä taitosetti määrittelee, miten roolipelikampanjan fyysiset pelaajamateriaalit (handouts, asiakirjat, kuitit, kaaviot, esitteet) suunnitellaan ja tuotetaan korkealaatuisiksi, maailmansisäisesti uskottaviksi PDF-tiedostoiksi.

---

## 1. Suunnittelun periaatteet

1. **Ei pelinjohtajan metatietoa tulosteessa (100 % Diegeettisyys):**
   * Tulostettavassa PDF:ssä ei koskaan näytetä pelimekaniikkaa, GM-ohjeita, hahmoluokkia tai huomautuksia siitä, kuka hyötyy mistäkin. Pelaaja kokee dokumentin 100 % maailmansisäisenä esineenä.
2. **Ei videopelimäisiä "quest markereita" tai orjamaisia algoritmeja:**
   * Dokumentit eivät koskaan anna suoria toimintaohjeita (*"mene huoneeseen X ja vedä vipua Y"*).
   * Teksti on tekijänsä aitoa ammatillista dokumentaatiota (konepäällikön tärinähuoli, vartijan laipioraportti, lääkärin diagnoosi). Pelaajille jätetään **itse oivaltamisen ja päättelyn ilo**.
3. **Kielistandardi: Positiivinen ilmaisu (Ehdoton kielto negaatiolle):**
   * Älä koskaan kuvaile asioita kieltämällä tai vertaamalla asioihin, joita hahmo tai lukija ei tunne (*"Hän ei puhu mistään 50-metrisestä Evangelionista..."*, *"Ei ole kyse aseesta vaan..."*).
   * Kirjoita sen kautta, **mitä on, mitä tapahtuu ja mitä tekijä havaitsee tai tietää**.
   * Poista kaikki "ei X, vaan Y" -rakenteet.
4. **Tekijän ääni, materiaalisuus ja rivihahmojen arkitodellisuus:**
   * Jokaisella dokumentilla on maailmansisäinen tekijä, jolla on oma motiivi, sanasto ja työvälineet:
     * *Virkailija / telakka:* Konekirjoitus tai monospace-lomake, viralliset leimat, sarjanumerot.
     * *Huoltomies / kapinallinen:* Käsiala, tussit, ruutupaperi, rasvatahrat, tupakka-askin kannet.
     * *Valvontajärjestelmä:* Pistematriisi, jatkolomakepaperi (green-bar), rei'itetyt reunat.
     * *Huippuklinikka:* Pastelli, kultaukset, kiiltävä asettelu, sokerinen markkinointikieli.
     * *Tuomioistuin:* Pergamentti, antiikvakirjasin, latinismit, kohokuvioitu punainen vahasinetti.
     * *Varuskunta:* Karu harmaa mimeografi, musteleimat, karkeat huomiot.
   * **Rivihahmon rajattu todellisuus (Grounded Scope):** Huoltomies tai riviasentaja tuntee vain omat putkensa, viemärinsä, vuoronsa ja velkansa Rasvakuilussa. Hän ei jaa kosmista infodumppia.
5. **Faktioiden dogmaattiset harhat (In-World Delusion):**
   * Dokumentit heijastavat tekijänsä uskomusmaailmaa: Ekklesian papit puhuvat vilpittömästi *"sakramentaalisesta ekstaasista ja pyhästä hurmoksesta"*, KW:n upseerit *"100 % komentokoheesiosta"*. Pakkosynkronoitu orjaverkko on tämän dogmaattisen harhan looginen mekaaninen lopputulema, ei julkilausuttu tavoite.
6. **Puolirelevantit propit (GM:n aarrearkku):**
   * Kaikkien proppien ei tarvitse olla suoria pääjuonen avaimia. Puolirelevantit dokumentit (kuten vanhat oikeustapaukset, varastoluettelot tai rutiinivalitukset) antavat pelinjohtajalle mahdollisuuden vastata pelaajan uteluun aidolla paperilla, luoden valtavasti maailmantuntua ilman valmiita vastauksia.
7. **Signaali ja kohina (Signal & Noise):**
   * Dokumenteissa on aina aitoa arkipäiväistä kohinaa: ruokalistoja, huonosti istuvia työvaatteita, jätevesitulleja, virkaheittoja valituksia. Juoni ja vihjeet piileskelevät luontevasti tämän kohinan seassa.
8. **Kaksipuolisuus (Duplex Printing):**
   * Kun kyseessä on esimerkiksi rahtikirja, jonka taakse salakuljettaja on kirjoittanut varoituksen, sivu 1 on virallinen etupuoli ja sivu 2 on kääntöpuoli. Kaksipuolisena tulostettuna paperi tuntuu kädessä täysin aidolta.
9. **Visuaalinen laaturima ja grafiikat:**
   * Leikkauskaaviot ja pohjakartat laaditaan tarkkoina SVG-vektoreina (mittaviivat, laipioiden paksuudet, tekniset tunnisteet), ei pikselöityinä luonnoksina.
   * Salakuvat ja valvontakuvat toteutetaan korkeakontrastisina, rakeisina mustavalkokuvina (valvontakamerat, arkistopolaroidit).
10. **Aika Kynnyksellä:**
    * Ei Maan vuosilukuja tai gregoriaanista kalenteria. Päiväykset merkitään työvuoroina, asemien mekaanisina rotaatioina ja sykleinä.
11. **Terminologia:**
    * Käytä aina termiä **sääntöartefakti** tai **Arkkitehtuurin sääntöydin** (termi "shiny object" on ehdottomasti kielletty).

---

## 2. HTML & CSS Print -standardit

Tulosteet muotoillaan HTML:llä ja CSS:llä ja renderöidään Chromen headless-tulostimella:

```css
@page {
  size: A4;
  margin: 0; /* Full bleed, marginaalit hallitaan CSS paddingilla */
}

@media print {
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}
```

### Sivunvaihdot:
* Sivunvaihto tehdään luokalla `.page-break { page-break-after: always; break-after: page; }`.
* Jokainen A4-arkki mitoitetaan tyylillä `min-height: 297mm; max-height: 297mm; width: 210mm; box-sizing: border-box; overflow: hidden; position: relative;`.

### Ikonit ja grafiikat:
* Käytetään vektorimuotoisia inline-SVG-ikoneita (esim. projektin omat ikonit `packages/ui/src/custom-icons/`). Vektorigrafiikka skaalautuu häviöttömästi mihin tahansa tulostustarkkuuteen (300+ DPI).

---

## 3. PDF-kääntäjätyökalu (`tools/generate_pdf.py`)

Käännös suoritetaan Python-skriptillä, joka kutsuu asennettua Chromium- tai Google Chrome -selainta:

```bash
# Käännä kaikki jakson 9 handoutit:
python tools/generate_pdf.py --all

# Käännä tietty HTML-tiedosto PDF:ksi:
python tools/generate_pdf.py metadata/jakso-9/handouts/html/01-rahtikirja.html metadata/jakso-9/handouts/pdf/01-rahtikirja-ja-kontti.pdf
```
