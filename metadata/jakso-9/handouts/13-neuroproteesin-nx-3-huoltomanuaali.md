# Proppi 13: Neuroproteesin NX-3 tekninen huoltomanuaali ja piirikaavio

> **PJ — ei tulosteta tätä laatikkoa.**  
> **Tekijä:** Insinööri Särmä, Med-Apex Neuroteknologia (Tuotekehitys ja Kenttähuolto, Kliininen Torni 7).  
> **Ääni:** Pedantin tekninen, insinöörimäinen huoltomanuaali. Sisältää standardien mukaista jargonia, varoituksia ja kytkentäohjeita.  
> **Jako:** Klinikka "Hellän Käden" huoltopöydältä, työpakin pohjalta tai Alasimelta mukaan otetuista laiteoppaista.  
> **Mitä siellä on (vain PJ:lle):**
> * **Siskon pelastuksen tekninen avain (Jamirin ratkaisu):** Yömyyrän pikkusiskoon asennetun NX-3-neuroproteesin takaraivoliitännän (Portti C7) pinnijärjestys.
> * Manuaalin varoitusosio varoittaa "virheellisestä huoltomenettelystä":
>   * Jos **Pinni 3 (GND)** ja **Pinni 5 (TEST/BYPASS)** yhdistetään toisiinsa n. 50 ohmin vastuksella ja pohjassa olevaa mekaanista huoltonappia painetaan 4 sekuntia, laite putoaa **turvalliseen lepotilaan (Safe Sleep Mode)**.
>   * Tällöin etähallittu "velkaperintäkipu" lakkaa välittömästi, implantti kytkeytyy irti aivorungosta eikä potilas saa hengenvaarallista hylkimiskouristusta!
> * Kohina: Sterilointiohjeet höyryautoklaavissa, käyttölämpötilat (–10 °C … +42 °C), biosynkronoinnin jännitekäyrät, valmistajan takuun raukeamisehdot.
>
> **Tulostusvinkki:** Taiteltu lääkinnällisen laitteen huoltokaavio, mustavalkoinen tekninen piirros C7-portin pinnijärjestyksestä ja selkeät kytkentätaulukot.

---

```
═══════════════════════════════════════════════════════════════════════
 MED-APEX NEUROTEKNOLOGIA · KLIIKKATUOTE NX-3 "RAUHALLINEN MIELI"
 HUOLTO-OPAS JA LIITÄNTÄSPESIFIKAATIO               DOKUMENTTI MN-NX3-04
 Jakelu: Vain valtuutetuille huoltoteknikoille      Rev. 4.2
═══════════════════════════════════════════════════════════════════════
```

### 1. LAITTEEN YLEISRAKENNE JA C7-PORTTI

Neuroproteesi mallia NX-3 koostuu keraamisesta aivorunkotyynystä ja subkutaanisesta ohjausyksiköstä. Laitteen ainoa fyysinen huolto- ja diagnostiikkaliitäntä on potilaan takaraivoon sijoitettu pyöreä 8-napainen **Portti C7**.

```
                   PORTTI C7 — PINNIJÄRJESTYS
                   (Näkymä laitteen liittimestä)

                              [URA]
                            o   1   o
                         8             2
                       o                 o
                       7                 3
                         o             4
                            o   5   o
                                6
```

---

### 2. PINNIJÄRJESTYS JA SIGNAALIMÄÄRITYKSET

```
────────────────────────────────────────────────────────────────────────
 PINNI  TUNNUS       JÄNNITE     TOIMINTA
────────────────────────────────────────────────────────────────────────
   1    +5V_LOG      +5,0 V      Logiikkapiirien diagnostiikkasyöttö.
   2    BRAIN_SYNC   +1,2 V      Aivorungon synkronointi- ja lukitussignaali.
   3    GND          0,0 V       Päämaadoitus ja häiriösuoja.
   4    IMPULSE_CH   0 … 24 V    Hermoston vastekanava (kivunhallinta/säätö).
   5    TEST_BYPASS  +3,3 V      Diagnostiikkatilan ohjaussignaali.
   6    DATA_IO      Digitaal.   Muistipiirin luku (Med-Apex salausavain).
   7    ANT_FEED     RF          Etäohjausantennin syöttöjohto.
   8    RESERVED     —           Valmistajan varaus (kytkemätön).
────────────────────────────────────────────────────────────────────────
```

---

### 3. TURVALLISUUSVAROITUS HUOLTOTEKNIKOILLE

> [!WARNING]
> **ANKARASTI KIELLETTY KENTTÄMENETTELY (VAROITUS 12-B):**  
> Laitteessa on sisäänrakennettu hätäirrotusprotokolla lääkintäviranomaisten tarkastuksia varten.  
> 
> Mikäli **Pinni 3 (GND)** ja **Pinni 5 (TEST_BYPASS)** kytketään yhteen noin 50 ohmin vastuksella (tai vastaavalla matalaohmisella johtimella) ja laitteen kuoressa olevaa pientä upotettua huoltokytkintä painetaan yhtäjaksoisesti **neljä (4) sekuntia**, laite tulkitsee tilanteen hätäpuruksi ja siirtyy **Turvalliseen lepotilaan (Safe Sleep Mode)**.
> 
> **Lepotilan seuraukset:**  
> 1. Kanavan 4 ulkoinen ohjausimpulssi sammuu pysyvästi.  
> 2. Antenniyhteys (Pinni 7) katkeaa ja laite siirtyy passiivitilaan.  
> 3. Aivorungon turvalukitus purkautuu hallitusti ilman heijastevaurioita.  
> 
> *Tämän toimenpiteen luvaton suorittaminen purkaa Med-Apexin valmistajatakuun ja katsotaan lääkinnällisen vakuusoikeuden loukkaukseksi (Kynnyksen Kauppaoikeus 14 §).*
