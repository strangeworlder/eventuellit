---
title: Mekaaninen sääntökirja
order: 1
images:
  - /images/Pelipöytäily.png
  - /images/Pelipöytäily.png
  - /images/Hahmonluonti.png
  - /images/Sääntöteksti.png
  - /images/Vaurioituminen.png
  - /images/Kehitys.png
---

Olet kapinallinen aurinkokuntaa hallitsevaa tyrannia vastaan. Peli jakautuu kahden tai kolmen pelikerran mittaisiin **jaksoihin**. Tässä keskeiset mekaniikat.

### 1\. Pelimekaniikka: noppakoura ja akselit

Pelimekaniikan keskiönä toimii `5n20-noppakoura`. Se edustaa hahmosi rajallista keskittymiskykyä ja toimintamahdollisuuksia yhden tilanteen tai taistelukierroksen aikana.

#### Noppakoura (5n20)

Käytössäsi on oletusarvoisesti **5n20** (viisi 20-sivuista noppaa). Nämä ovat toimintoyksikköjäsi. Jaa nopat eri tekoihin tai panosta ne yhteen suoritukseen varmistaaksesi onnistumisen.

#### Akselit

Toiminta ratkeaa **akseleilla**, jotka kuvaavat tehtävän eri ulottuvuuksia. Pelinjohtaja määrittää toiminnalle yhden tai useamman akselin, jotka ratkaistaan samanaikaisesti.

*Esimerkki: Hiippailu sulkeutuvasta ovesta vartijan ohi vaatii onnistumista sekä Nopeus-akselilla että Hiljaisuus-akselilla.*

1. `NOPPIEN JAKO`: Päätä, miten priorisoit toimintasi. Voit asettaa useita noppia yhdelle akselille tai jättää akselin ilman noppia.
2. `TYHJÄT AKSELIT`: Jos jätät akselin ilman noppia, hahmosi epäonnistuu kyseisellä osa-alueella automaattisesti.
3. `LUE TULOS`: Heitä nopat. Akselin tulos on sille asetettujen noppien suurin yksittäinen silmäluku.
4. `ONNISTUMISKYNNYS (OK)`: Akseli onnistuu, jos tulos on yhtä suuri tai korkeampi kuin **onnistumiskynnys**. Oletusarvo on **13**.
5. `OSUMAT`: Jos säännöt tai pelinjohtaja pyytää **osumia**, laske kuinka moni akselille asetetuista nopista saavuttaa tai ylittää onnistumiskynnyksen.

#### Vaikeusasteet

Käytä oletusarvoa **13** onnistumiskynnykselle, ellei pelinjohtaja erikseen ilmoita jotain muuta onnistumiskynnystä.

* **Helppo (OK 9)**: Olosuhteet ovat huomattavan suotuisat.  
* **Vakio (OK 13)**: Normaali haastava suoritus paineen alla.  
* **Vaikea (OK 17)**: Tilanne on lähes mahdoton ilman erityisosaamista tai onnea.

##### Tuplat (Kriittinen onnistuminen)

Jos onnistut akselilla ja vähintään kaksi sille heitettyä noppaa näyttää samaa silmälukua, saavutat **kriittisen onnistumisen**. Saat lisätietoa, teet enemmän vauriota tai luot merkittävän edun. Pelinjohtaja voi päättää, että kriittinen onnistuminen kompensoi epäonnistumista heiton toisella akselilla.

#### Avustaminen

Yksi hahmo voi auttaa toista suorituksessa pelinjohtajan suostumuksella. Avustaja tekee heiton sopivalla akselilla. Onnistunut heitto lisää pääsuorittajan noppakouraan yhden nopan (`+1n20`) tämän seuraavaan heittoon. Maksimissaan yksi noppa lisää per heitto.

#### Ryhmätoiminta

Kun koko ryhmä toimii yhdessä (esim. pako tai joukkohiipailu), kaikki osallistujat jakavat noppansa yhteisille akseleille. Akselit vaativat tietyn määrän onnistumisia ryhmältä (yleensä jotain yhden ja yrittävien hahmojen määrän välillä), että koko akseli on onnistuminen.

### 2\. Hahmo ja ominaisuudet

Luo hahmosi ensimmäisen jakson alussa.

#### Hahmon tyyppi

Valitse tyyppi:

* `SOTILAS`: Aloitussisu on 3n8. Saat 2 taitoa.
* `EKSPERTTI`: Aloitussisu on 3n6. Saat 3 taitoa.

#### Taidot

Taidot, joita voit valita määrittyvät jakson mukaan. Voit ehdottaa myös muita taitoja, mutta ne vaativat pelinjohtajan hyväksynnän.

#### Ominaisuudet ja Ominaisuusnopat

Hahmolla on kuusi Ominaisuutta, jotka on jaettu kolmen Keston alle:

* `KEHO`: **Fysiikka** ja **Nopeus**.
* `MIELI`: **Ymmärrys** ja **Persoona**.
* `TERÄ`: **Näkemys** ja **Näppäryys**.

Valitse hahmonluonnissa kaksi **ominaisuutta**. Saat valintoihisi `+n4-bonusnopan`. Voit valita saman ominaisuuden kahdesti (saat tällöin kyseiseen ominaisuuteen kaksi +n4-bonusnoppaa). Kun ominaisuus soveltuu heiton akseliin, heitä yksi sen bonusnopista ja lisää sen tulos kyseisen akselin yhden n20-tuloksen päälle. Voit käyttää yhdellä akselilla korkeintaan yhtä bonusnoppaa. Jos heitossa on useita akseleita ja bonusnoppia on käytettävissä useita, voit jakaa bonusnopat eri akseleille niiden soveltuvuuden mukaan.

#### Kesto

**Kesto** on kykysi sietää rasitusta. Jokainen keston kategoria (Keho, Mieli, Terä) alkaa arvosta 8. Lisää arvoon puolet vastaavien ominaisuusnoppien maksimiarvosta. Esimerkiksi fysiikkaan lisätty +n4 nostaa keho-kestoa 2 pisteellä.

`RASITUKSEN SIIRTO`: Voit korvata yhden pisteen menetystä tietystä kestosta käyttämällä 2 pistettä toista kestoa.

#### Taidot ja varusteet

* `TAIDOT`: Toimivat pääsykortteina. Taito mahdollistaa siihen liittyvän heiton tekemisen ilman kestohintaa. Ne voivat myös avata uusia akseleita heittoihin.
* `VARUSTEET`: Toimivat taitojen lailla tarinallisina mahdollistajina. Varusteen käyttöönotto sitoo 1–5 pistettä sopivaa kestoa. Pisteet vapautuvat, kun luovut varusteesta.
  * **ASEET**: Määrittävät vahinkonopan (esim. **1n6**) ja rajoittavat sitä kuinka monta noppaa voit sitoa hyökkäysakseliin, ja kuinka monta hyökkäysakselia sinulla voi olla vuorossa.
* `KESTOLLA MAKSAMINEN`: Jos taito tai varuste puuttuu, voit yrittää toimintoa maksamalla 1–3 pistettä pelinjohtajan määrittämää kestoa.
* `YMPÄRISTÖ JA TILANNE`: Ympäristö voi muokkaa haasteen rakennetta:
  * **Positiivinen ympäristö**: Voi antaa oikeuden heittää noppia ilman **kesto**\-pistekustannusta (Esim. pimeässä piiloutuminen).
  * **Negatiivinen ympäristö**: Voi luoda uusia pakollisia **akseleita** (esim. *Tasapaino* myrskyssä) tai nostaa olemassa olevien akseleiden onnistumiskynnystä.

### 3\. Konfliktit ja taistelu

Konfliktit etenevät ajastimella, joka laskee korkeimmasta aloitearvosta alaspäin.

#### Kierroksen kulku

* `JULISTUSVAIHE`: Pelinjohtaja kertoo tavallisten vastustajien aikeet ja ajastimen kohdat. Pelaajat ilmoittavat aikeensa ja jakavat nopat. Lopuksi pelinjohtaja kertoo erikoisvastustajien aikeet.
* `RATKAISU`: Toiminnot tapahtuvat ajastimen järjestyksessä. Tasatilanteessa pelaajat päättävät järjestyksen.

##### Taistelukierroksen akselit
* `ALOITE`: Paikkasi ajastimella on joko (5 x aloite-akselin noppien määrä) tai (heitettyjen noppien suurin silmäluku). Valitse suurempi arvo.
* `LIIKE`: Yksi noppa mahdollistaa liikkumisen yhdeltä vyöhykkeeltä toiselle tai uudelleenasennoinnin vyöhykkeen sisällä.
* `PUOLUSTUS`: Jokainen osuma puolustusakselilla poistaa valitsemasi yhden hyökkääjän osuman.
* `HYÖKKÄYS`: Onnistunut hyökkäys aiheuttaa vauriota. Jos hyökkäys-askeliin on sijoitettu noppia, mutta heitto epäonnistuu, tee silti vaurioheitto käyttäen vain kohteen uhkanoppia.
* `MUUT TOIMINNOT`: Tilannekohtaiset teot vaativat omat noppansa.

### 4\. Vaurio ja selviytyminen

Vaurion käsittely tapahtuu seuraavasti:

1. `VAURIO`: Muodosta hyökkäyksen **vaurionopat** yhdistämällä hyökkääjän **vahinkonopat** ja kohteen **uhkanoppapino**.
2. `SISU`: Puolustaja heittää **sisunopat**. Vertaa jokaista vaurionoppaa jokaiseen sisunoppaan. Jos vaurionoppa on suurempi kuin sisunoppa, poista kyseinen pari (1:1). Jatka, kunnes sisunopat loppuvat tai ne ovat kaikki vaurionoppia suurempia.
3. `UHKA`: Jos hyökkäys ei aiheuta menetystä **sisuun**, **kestoon** tai tuota **harmia**, lisää hyökkäyksen **vahinkonoppa** kohteen **uhkanoppapinoon**. Muussa tapauksessa tyhjennä uhkanoppapino.
4. `KESTO JA HARMI`: Kun sisu loppuu, menetä kestoa tai ota yksi harmi.
  * Menetä suurimman jäljellä olevan vaurionopan silmäluvun verran sopivaa **kestoa**.
  * Jokainen **harmi** poistaa pysyvästi yhden nopan noppakourastasi (-1n20). Viides harmi poistaa hahmon kampanjasta.

### 5\. Kehitys ja toipuminen

#### Toipuminen

* Taistelun aluksi palautuu yksi menetetty sisunoppa.
* Sisu ja kesto palautuvat täysin **jaksojen välissä**. Uhkanoppapino tyhjenee.
* **Jakson aikana lepo** palauttaa sisun täysin ja jokaista kestoa 1 pisteen. Uhkanoppapino tyhjenee.
* **Harmit** vaativat tarinallisen selityksen jaksojen välissä.

#### Kehitys

Tee kehitys uuden jakson alussa:

* `OMINAISUUKSIEN KASVU`: Lisää yksi n4 valitsemaasi ominaisuuteen. Kolme samanarvoista noppaa (esim. 3n4) korvautuu yhdellä askeleen suuremmalla nopalla (n6 -> n8 -> n10 -> n12).
* `KESTON PÄIVITYS`: Laske uudet kestot (8 + keston ominaisuusnoppien maksimien summa / 2).
* `UUDET TAIDOT`: Valitse joko (kaksi uutta taitoa ja +1n6 sisu) tai (yksi uusi taito ja +1n8 sisu).