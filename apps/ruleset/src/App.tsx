import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Page } from "@repo/ui/components/Page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/Tabs";
import { Text } from "@repo/ui/components/Text";
import { TextSection } from "@repo/ui/components/TextSection";

function App() {
  return (
    <Page>
      <Tabs defaultValue="mekaniikat">
        <TabsList>
          <TabsTrigger value="mekaniikat">Säännöt & Mekaniikat</TabsTrigger>
          <TabsTrigger value="maailma">Maailma</TabsTrigger>
        </TabsList>

        <TabsContent value="mekaniikat">
          <HeadingLevelProvider>
            <Hero
              title="Säännöt & Mekaniikat"
              description="Peli käyttää rankasti modifioitua Hood-roolipelin ja FREE/FALL -järjestelmää."
            />
            <div className="space-y-10">
              <HeadingLevelProvider>

                <TextSection title="Pelijärjestelmä">
                  <Text variant="large" className="mb-2">
                    <strong className="text-[var(--theme-accent)]">n20, yritä saada isoa.</strong>
                  </Text>
                  <ul className="list-disc ml-6 space-y-2 text-[var(--theme-text)]">
                    <li><strong className="text-[var(--theme-accent)]">5 noppaa:</strong> 20-sivuisten määrä käytettävissä heittoon on 5.</li>
                    <li><strong className="text-[var(--theme-accent)]">Akselit:</strong> Yleensä heitoissa nopat pitää jakaa vähintään kahdelle akselille, jotka pelinjohtaja määrittelee (esim. &quot;nopeasti&quot; ja &quot;hiljaa&quot;). Pelaaja päättää kuinka monta noppaa millekin asettaa ja tulos on korkein noppa sillä akselilla.</li>
                    <li><strong className="text-[var(--theme-accent)]">Perusominaisuudet:</strong> Aloittavalla hahmolla on kaksi jotka ovat kumpikin +n4. Jos pätee heittoon, voi lisätä perusominaisuusnopan (esim. +n4 tuloksen) yhdelle akselille.</li>
                    <li><strong className="text-[var(--theme-accent)]">Taidot ja kestot:</strong> Taidot oikeuttavat yrittämään asiaa. Ilman perustetta on käytettävä kestopisteitä (1 oikea kesto tai 2 muuta).</li>
                    <li><strong className="text-[var(--theme-accent)]">Sisu:</strong> Sisunoppia on alussa 3n6 tai 3n8. Vahinko voi vähentää sisua (kuvaa asioita kuten läheltä piti -tilanteet ja taisteluväsymys).</li>
                    <li><strong className="text-[var(--theme-accent)]">Vaurio:</strong> Sisun loppuessa menettää kestoa tai kärsii vauriota. Vaurio vähentää suoraan heitettävien noppien määrää. 5 vauriolla on poissa pelistä.</li>
                  </ul>
                </TextSection>

                <TextSection title="Hahmot">
                  <Text variant="large" className="mb-4">
                    Pelaajahahmot ovat (anti)sankareita kytevässä kapinassa tyrannaista aurinkokuntaa vastaan.
                  </Text>
                  <ul className="list-none space-y-4">
                    <li className="flex items-start">
                      <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>
                      <div>
                        <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-1">
                          Tyypit:
                        </strong>
                        <span className="text-lg ml-2 text-[var(--theme-text)]">
                          <strong>Sotilas</strong> (2 taitoa, 3n8 sisu) tai <strong>Ekspertti</strong> (3 taitoa, 3n6 sisu).
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>
                      <div>
                        <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-1">
                          Keho:
                        </strong>
                        <span className="text-lg ml-2 text-[var(--theme-text)]">
                          Fysiikka, Nopeus.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>
                      <div>
                        <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-1">
                          Mieli:
                        </strong>
                        <span className="text-lg ml-2 text-[var(--theme-text)]">
                          Ymmärrys, Persoona.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>
                      <div>
                        <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-1">
                          Terä:
                        </strong>
                        <span className="text-lg ml-2 text-[var(--theme-text)]">
                          Näkemys, Näppäryys.
                        </span>
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>
                      <div>
                        <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-1">
                          Kestot:
                        </strong>
                        <span className="text-lg ml-2 text-[var(--theme-text)]">
                          Keho, Mieli ja Terä alkavat 8:sta pistermäärästä. Jokainen +n4 perusominaisuudessa antaa +2 kyseiseen kestoon.
                        </span>
                      </div>
                    </li>
                  </ul>
                </TextSection>

                <TextSection title="Hahmokehitys">
                  <Text variant="large">
                    Jos hahmo palaa uuteen jaksoon, pelaaja saa:
                  </Text>
                  <ul className="list-disc ml-6 space-y-2 text-lg mt-2 text-[var(--theme-text)]">
                    <li>Lisätä uuden +n4 johonkin perusominaisuuteen <em>tai</em> nostaa olemassa olevan arvoa (n4 &rarr; n6 &rarr; n8 &rarr; n10 &rarr; n12 jne).</li>
                    <li>Jaksokohtaisen uuden taidon.</li>
                    <li>Valita joko toisen taidon, +1n6 sisunopan, tai +1n8 sisunopan.</li>
                  </ul>
                </TextSection>
              </HeadingLevelProvider>

            </div>
          </HeadingLevelProvider>
        </TabsContent>

        <TabsContent value="maailma">
          <HeadingLevelProvider>
            <div className="flex flex-col space-y-8 max-w-4xl pt-4">
              <Hero
                title="Maailma & Tyylilaji"
                description="Nestemäisen avaruuden aurinkokunta ja nousu tyranniaa vastaan."
              />
              <div className="space-y-10">
                <HeadingLevelProvider>
                  <TextSection title="Eventuellit-antologia">
                    <Text variant="large">
                      Eventuellit-antologia on sarja two- tai threeshotteja, jotka sijoittuvat ihmiskunnan asuttamaan nestemäisen avaruuden (virtaukset ja kitkat perinteisen tyhjiön sijaan) aurinkokuntaan.
                      Pelit käsittelevät tavalla tai toisella nousua tyranniaa ja maailman staattisuutta vastaan. Pelaajaporukka vaihtelee antologian jaksojen välillä,
                      mutta pelaajien hahmot, jos säilyvät hengissä, voivat palata tarinaan.
                    </Text>
                  </TextSection>

                  <TextSection title="Tyylilajit">
                    <ul className="list-none space-y-6 mt-4">
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold mt-1">▶</span>
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest text-lg">
                            Toiminnallinen draama:
                          </strong>
                          <Text variant="base" className="mt-1">
                            Peli koostuu yksittäisistä tarinoista, jotka ovat konkreettisia toimia suuremmassa kuvassa pyrkimyksenä murtaa maailman status quo.
                            Teoilla on seurauksia. <span className="opacity-70">(Esim. The Matrix, Andor, V for Vendetta)</span>
                          </Text>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold mt-1">▶</span>
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest text-lg">
                            Avaruusooppera:
                          </strong>
                          <Text variant="base" className="mt-1">
                            Scifiä, mutta ei täysin kovaa sellaista. Tieteen taso on 50% analogista retroscifiä, 35% modernia kovaa scifiä, 15% fantastista.
                            Lähtökohtaisesti maailman toimintaan voi luottaa. <span className="opacity-70">(Esim. Andromeda, Star Wars Rebels, Battlestar Galactica)</span>
                          </Text>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold mt-1">▶</span>
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest text-lg">
                            Surrealistinen:
                          </strong>
                          <Text variant="base" className="mt-1">
                            Maailma ei tunnu aina noudattavan hahmojen ymmärrystä siitä. &quot;Näin sen unessa&quot; voi olla perusteltu syy aloitteelle.
                            Surrealismi pelissä noudattaa omia piilotettuja lainalaisuuksiaan ja asettuu usein hahmoja vastaan. <span className="opacity-70">(Esim. The Prisoner, Life on Mars)</span>
                          </Text>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold mt-1">▶</span>
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest text-lg">
                            Eksistentiaalinen:
                          </strong>
                          <Text variant="base" className="mt-1">
                            Ytimessä on kriisi yksilön toimijuudesta. Miten voimme vaikuttaa vihamielisessä, mielivaltaisessa maailmassa? David vs. Goliath.
                            <span className="opacity-70">(Esim. Westworld, Mr. Robot, The Good Place)</span>
                          </Text>
                        </div>
                      </li>
                    </ul>
                  </TextSection>
                </HeadingLevelProvider>

              </div>
            </div>
          </HeadingLevelProvider>
        </TabsContent>
      </Tabs>
    </Page>
  );
}

export default App;
