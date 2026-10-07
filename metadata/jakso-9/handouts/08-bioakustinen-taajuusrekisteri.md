# Proppi 08: Bioakustinen taajuusrekisteri ja orgaanisen kinetiikan vertailutaulukko

> **PJ — ei tulosteta tätä laatikkoa.**  
> **Tekijä:** Akateemikko Väre, Alasimen vapaa akatemia (Frekvenssifysiikan ja bioakustiikan osasto).  
> **Ääni:** Kuivakka, analyyttinen, matemaattisen täsmällinen luennoitsija. Hän keskittyy aaltoihin, hertseihin ja kudosmassan elastisuuteen.  
> **Jako:** Jamirin omassa datalaitteessa / Alasimelta mukaan otettuna tutkimusarkistona. Jamir tunnistaa kaavat heti.  
> **Mitä siellä on (vain PJ:lle):**
> * Osoittaa matemaattisesti, että seismisen kanavan S-0 lukemat (0,583 Hz → 0,667 Hz) edustavat biologista kudosta: teräksen ominaistaajuus pysyy vakiona massan säilyessä ennallaan.
> * Kaava: $f \text{ (Hz)} \times 60 = \text{bpm (lyöntiä minuutissa)}$.
> * 0,583 Hz = tasan 35 bpm (hypotermisen sydänlihaksen heräämisnopeus).
> * 0,667 Hz = tasan 40 bpm (hermostollisen metabolian kiihtymisvaihe).
> * 1,000 Hz = tasan 60 bpm (täysi valveillaolo ja motorinen synkronointi).
> * Kohina: Fourier-muunnoksen integraalikaavoja, harmonisten yläsävelten vaimenemiskertoimia laivateräksessä, akatemian arkistoleimoja.
>
> **Tulostusvinkki:** Ruudutettu tutkimuspaperi, tiheää akateemista ladontaa, spektrogrammiluonnos ja selkeä vertailutaulukko. 2 sivua.

---

```
═══════════════════════════════════════════════════════════════════════════
 ALASIMEN VAPAA AKATEMIA · FREKVENSSIFYYSIIKAN JAOSTO · MONOGRAFIA B-19
 TEKNO-MEKAANISEN JA ORGAANISEN VÄRÄHTELYN SPEKTRIANALYYSI
 Laatija: Akat. VÄRE                                   Arkistotunnus: AK-884
═══════════════════════════════════════════════════════════════════════════
```

### 1. JOHDANTO JA MITTAUSASETELMA

Kynnyksen teollisuusrakenteissa mitataan jatkuvasti laajaa akustista ja mekaanista taajuusspektriä. Yleinen diagnostiikkavirhe on luokitella kaikki matalataajuiset sykäykset "rakenteelliseksi resonanssiksi". 

Tämä monografia esittää matemaattiset ja fysikaaliset kriteerit, joilla mekaaninen runkoresonanssi erotetaan **orgaanisen kudosmassan kardiovaskulaarisesta pulssista**.

Perusmuunnos taajuuden ja syklin välillä:

$$\text{Sykli minuutissa (bpm)} = f \text{ (Hz)} \times 60$$

---

### 2. TUNNETUT TAAJUUSLUOKAT KYNNOKSEN ASEMARAKENTEISSA

```
┌─────────────────────────┬──────────────────┬─────────────────────────────┐
│ ILMIÖN LAATU            │ TAAJUUSALUE (Hz) │ AALTOMUOTO & KÄYTTÄYTYMINEN │
├─────────────────────────┼──────────────────┼─────────────────────────────┤
│ Turbiinit ja roottorit  │ 25,0 – 450,0 Hz  │ Puhdas siniaalto, terävät   │
│                         │                  │ harmoniset piikit.          │
│ Rungon seismiset aallot │ 0,005 – 0,050 Hz │ Epäsäännöllinen vaappuminen,│
│ (nesteen virtausvastus) │                  │ laaja spektrihajonta.       │
│ Hydrauliikan mäntäsykli │ 0,250 Hz (tasan) │ Kantikas pulssi, terävä     │
│ (paineistusvaihe)       │                  │ sulkeutumispiikki.          │
│ ORGAANINEN LIHASKUDOS   │ 0,400 – 1,500 Hz │ Kaksoishuippu (eteis/kammio)│
│ (kardiovaskulaarinen)   │                  │ asteittain kiihtyvä käyrä.  │
└─────────────────────────┴──────────────────┴─────────────────────────────┘
```

---

### 3. ORGAANISEN SYDÄNLIHAKSEN LEPOTILAT JA KIIHTYVYYS

Orgaanisessa makromolekyylisessä kudoksessa ja laajamittaisessa biologisessa sydänlihaksessa (kun massan tilavuus ylittää useita kuutiometrejä) systolinen vaste noudattaa metabolisen kiihtyvyyden lakia:

```
───────────────────────────────────────────────────────────────────────────
 TAAJUUS (Hz)   VASTAAVA SYKE   KUDOKSEN FYSIOLOGINEN TILA
───────────────────────────────────────────────────────────────────────────
 0,400 Hz       24 bpm          Syvä hypoterminen kryostaasi. Lihasjänteys 0.
 0,500 Hz       30 bpm          Anesteettinen lepotila. Perusaineenvaihdunta.
 0,583 Hz       35 bpm          ENSIAKTIVAATIO. Perifeerinen verenkierto aukeaa.
 0,600 Hz       36 bpm          Hermostollinen esisytytys käynnistyy.
 0,617 Hz       37 bpm          Lihastonus palautuu; lämmöntuotto alkaa.
 0,633 Hz       38 bpm          Hapen ja ravinneliuoksen kulutus kaksinkertaistuu.
 0,650 Hz       39 bpm          Synaptinen kytkeytyminen runkoverkkoon.
 0,667 Hz       40 bpm          KIIHTYVYYDEN TAITEPISTE. Refleksivalmius.
 0,750 Hz       45 bpm          Hengitys- ja painolastilihakset aktivoituvat.
 0,833 Hz       50 bpm          Spontaani lihassupistus mahdollinen.
 1,000 Hz       60 bpm          TÄYSI VALVEILLAOLO. Motorinen synkronointi.
───────────────────────────────────────────────────────────────────────────
```

---

### 4. AKATEEMINEN KRITEERI RESO-ANALYYSILLE

> **AKATEEMIKKO VÄRE — HUOMAUTUS KENTTÄTUTKIJOILLE:**  
> Teräksisen laivarakenteen tai telakka-altaan ominaistaajuus määräytyy sen massasta ($M$) ja jäykkyydestä ($k$):
> 
> $$f_0 = \frac{1}{2\pi} \sqrt{\frac{k}{M}}$$
> 
> Teräksen ominaistaajuus pysyy vakiona massan ja jäykkyyden säilyessä ennallaan.
> 
> Jos mittauspisteessä havaitaan tämän taulukon mukainen hidas, säännöllinen ja asteittain kiihtyvä siirtymä $0{,}583 \rightarrow 0{,}667\text{ Hz}$, **mittauskohde vastaa ominaisuuksiltaan elävää, kiihtyvää kardiovaskulaarista aineenvaihduntaa ylläpitävää orgaanista olentoa.**
