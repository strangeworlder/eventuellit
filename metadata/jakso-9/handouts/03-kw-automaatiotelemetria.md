# Proppi 03: KW:n automaatiotelemetria (seurantajakso)

> **PJ — ei tulosteta tätä laatikkoa.**  
> **Tekijä:** Lukuvarjo, KW-konsortion valvontajärjestelmän arkkitehti (Lohko Nolla, Sektori Data).  
> **Ääni:** Pedantti, itsetyytyväinen teknokraatti, joka rakastaa omaa järjestelmäänsä. Kaikki poikkeamat ovat hänelle "sallittua kohinaa", eikä hän koskaan kysy *miksi*. Kirjoittaa passiivissa, lyhentää kaiken.  
> **Jako:** Yömyyrä on nostanut tulosteen huoltoterminaalin paperikorista. Sivu 3 puuttuu (tuloste katkesi). Yömyyrä ei ymmärrä siitä mitään.  
> **Mitä siellä on (vain PJ:lle):**
> * **Kanava P-4:** paineenpiikit kellonaikoina, jotka ovat tasan 4:00 välein (00:00, 04:00, 08:00 …). Piikit hukkuvat muiden kanavien sekaan, koska taulukko on lajiteltu kanavittain eikä ajan mukaan.
> * **Seisminen kanava S-0 (telakan pohja):** "rakenteellinen resonanssi" 0,58 Hz → 0,67 Hz seurantajakson aikana. 0,58 Hz ≈ 35/min, 0,67 Hz ≈ 40/min. Taajuus nousee tasaisesti, mikä vastaa suoraan elävän organismin sykettä.
> * **Droonikierto D-1…D-4:** ulkoreunan valvontadroonien kierros 11 min; joka kierroksen lopussa 1 min 30 s "huoltokuittaus", jonka aikana droonit pysähtyvät telakkaan.
>
> **Tulostusvinkki:** Pistematriisifontti, raidoitettu tulostuspaperi, rei'itetyt reunat. Kaksi sivua (1–2 ja 4), sivu 3 "puuttuu".

---

```
═══════════════════════════════════════════════════════════════════════════
 KW-KONSORTIO · RATASVARTIO · LOHKO NOLLA · SEKTORI DATA
 AUTOMAATIOTELEMETRIA — JAKSOKOOSTE / ROTAATIO 41                SIVU 1 / 4
 Laatija: LUKUVARJO (järj.arkkitehti, taso 6)       Luokitus: SISÄINEN / B
═══════════════════════════════════════════════════════════════════════════

 YHTEENVETO

 Järjestelmän kokonaistehokkuus rotaatiolla 41: 99,61 % (tavoite 99,50 %).
 Tavoite saavutettu 14. peräkkäisenä seurantajaksona. Laatija huomauttaa, että
 edellisen arkkitehdin aikana tavoitetta ei saavutettu kertaakaan.

 Poikkeamat luokiteltu kaikki tasolle SALLITTU KOHINA. Toimenpiteitä ei
 tarvita. Erillisiä kyselyjä telakkaosastolta ei käsitellä ilman
 lomaketta DT-4 (ks. ohje 7.2.1). Telakkaosastoa on muistutettu tästä
 kolme (3) kertaa.

 Ilmanvaihdon kalibrointi J-sektorilla valmis. Kosteuslukemat Juurakossa
 edelleen yli normin; syynä elävä puuaines. Ei KW:n vastuulla.

═══════════════════════════════════════════════════════════════════════════
 KANAVAKOHTAISET LUKEMAT (otos, vrk 4, klo 00:00–12:00)
───────────────────────────────────────────────────────────────────────────
 KANAVA   KUVAUS                     AIKA     ARVO       YKS.   TILA
───────────────────────────────────────────────────────────────────────────
 E-01     Jännite, pääsyöttö         00:00    11 402     V      OK
 E-01     Jännite, pääsyöttö         03:00    11 398     V      OK
 E-01     Jännite, pääsyöttö         06:00    11 410     V      OK
 E-01     Jännite, pääsyöttö         09:00    11 391     V      OK
 E-02     Jännite, telakka           00:00    18 900     V      OK
 E-02     Jännite, telakka           06:00    19 450     V      OK *
 H-11     Kosteus, Juurakko J-12     01:00    97         %      KOHINA
 H-11     Kosteus, Juurakko J-12     07:00    98         %      KOHINA
 L-03     Lämpö, syöttökouru         02:00    37,1       °C     OK
 L-03     Lämpö, syöttökouru         08:00    37,4       °C     OK
 P-2      Paine, pumppu 2            00:30    4,1        bar    OK
 P-2      Paine, pumppu 2            05:30    4,2        bar    OK
 P-4      Paine, pumppu 4            03:00:00 31,8       bar    KOHINA
 P-4      Paine, pumppu 4            03:01:30 6,2        bar    OK
 P-4      Paine, pumppu 4            03:04:00 32,0       bar    KOHINA
 P-4      Paine, pumppu 4            03:06:10 6,1        bar    OK
 P-4      Paine, pumppu 4            03:08:00 31,9       bar    KOHINA
 P-4      Paine, pumppu 4            03:09:45 6,3        bar    OK
 P-4      Paine, pumppu 4            03:12:00 31,7       bar    KOHINA
 P-4      Paine, pumppu 4            03:14:20 6,0        bar    OK
 P-7      Paine, palontorjunta       00:00    8,0        bar    OK
 V-01     Ilmavirta, ilmanvaihto     04:00    1 220      m³/h   OK
 V-01     Ilmavirta, ilmanvaihto     10:00    1 190      m³/h   OK

 * E-02: telakan kulutus kasvanut 3 % seurantajaksolla. Telakkaosaston asia.
═══════════════════════════════════════════════════════════════════════════
                                                                  SIVU 2 / 4
═══════════════════════════════════════════════════════════════════════════
 SEISMINEN SEURANTA — KANAVA S-0 (TELAKAN POHJALAATTA)

 Laatijan huomio: telakkaosasto on tehnyt S-0:sta neljä (4) huolestunutta
 kyselyä ilman lomaketta DT-4. Mittausdata osoittaa yksiselitteisesti,
 että kyse on RAKENTEELLISESTA RESONANSSISTA (laivateräs + vesimassa +
 kiekon oma värähtely). Amplitudi pysyy sallituissa rajoissa.
 Säännöllisyys heijastaa mekaanista resonanssia ja pysyy sallituissa rajoissa.

───────────────────────────────────────────────────────────────────────────
 KIERTO PERUSTAAJUUS (Hz)   AMPLITUDI (mm/s)   SÄÄNNÖLLISYYS   TILA
───────────────────────────────────────────────────────────────────────────
  1        0,583               0,9               99,8 %        KOHINA
  2        0,600               1,1               99,9 %        KOHINA
  3        0,617               1,4               99,9 %        KOHINA
  4        0,633               1,6               99,9 %        KOHINA
  5        0,650               2,0               99,9 %        KOHINA
  6        0,658               2,3               99,9 %        KOHINA
  7        0,667               2,9               99,9 %        KOHINA
───────────────────────────────────────────────────────────────────────────
 Trendi: lievä nousu. Ennuste rotaatiolle 42: ei hälytysrajaa (5,0 mm/s)
 ennen kiertoa 12. Suositus: ei toimenpiteitä.

 Laatijan huomio 2: Telakkaosasto on pyytänyt S-0:n hälytysrajan
 poistamista "seremonian ajaksi". Pyyntö on muodollisesti puutteellinen.
═══════════════════════════════════════════════════════════════════════════
 VALVONTADROONIT — ULKOREUNA (D-1 … D-4)
───────────────────────────────────────────────────────────────────────────
 Kiertoaika (keskiarvo) ............................ 11 min 00 s
 Huoltokuittaus kierron päätteeksi (telakoituminen)  1 min 30 s
 Kuittauksen aikana aktiivinen valvonta ............ ei (protokolla 4.4)
 Tunnistusvarmuus, ulkoreuna sektori 7–9 ........... 61 %  (veden sumu)
 Tunnistusvarmuus, muut sektorit ................... 99,2 %

 Laatijan huomio: Sektori 7–9:n vaihtelu edustaa ulkoista
 luonnonilmiötä. Asia on ilmoitettu Ratasvartiolle. Ratasvartio ei ole
 vastannut. Ei KW:n vastuulla.
═══════════════════════════════════════════════════════════════════════════
```

*[ SIVU 3 / 4 PUUTTUU — tuloste katkennut, paperissa repeämä ]*

```
═══════════════════════════════════════════════════════════════════════════
                                                                  SIVU 4 / 4
═══════════════════════════════════════════════════════════════════════════
 MUUT HUOMIOT

 - Taukotilan R-6 kahvinkeitin: ei automaation piirissä. Älkää lähettäkö
   siitä enää vikailmoituksia tälle osastolle.
 - Ekklesian kuvausryhmän laitteet aiheuttavat häiriöitä kanaville E-02
   ja S-0 käytävällä B. Ekklesian ryhmä ei ole vastannut. Ei KW:n
   vastuulla.
 - Pörssiennuste (sisäinen, KW-osakkeet, vko 42): +0,4 % ± 0,9 %.
   Luottamusväli 68 %. Ennuste on informatiivinen.
 - Ilmanpaineen vuorokausivaihtelu Plastisen laakson yläilmakehässä
   normaali (1 012–1 019 hPa).

 Laatija muistuttaa, että viikon 41 tehokkuustavoite saavutettiin
 ilman ylitöitä.

 — LUKUVARJO
═══════════════════════════════════════════════════════════════════════════
```
