import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Page } from "@repo/ui/components/Page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/Tabs";

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
            <div className="flex flex-col space-y-6">
              <div className="border-b-2 border-[var(--theme-primary)]/20 pb-4">
                <Heading>Säännöt & Mekaniikat</Heading>
                <p className="text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]/80 mt-2">
                  Tämä on Eventuellit roolipelin virallinen sääntökirjamoduuli.
                </p>
              </div>
              <div className="text-text/90 leading-relaxed font-light space-y-6">
                <Card variant="rule">
                  <CardContent>
                    <Heading>Heiton Ratkaisu</Heading>
                    <p className="font-sans text-lg mt-4">
                      Heitä <strong className="text-[var(--theme-accent)] font-bold">2d6</strong> ja
                      lisää kykysi arvo. Jos heitto on vähintään{" "}
                      <strong className="text-[var(--theme-accent)] font-bold">10</strong>, toimitus
                      onnistuu täydellisesti. Jos heitto on{" "}
                      <strong className="text-[var(--theme-accent)] font-bold">7-9</strong>, onnistut
                      mutta joudut maksamaan hinnan tai kohtaamaan seurauksen.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="rule">
                  <CardContent>
                    <Heading>Ominaisuudet</Heading>
                    <ul className="list-none space-y-4 mt-4">
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>{" "}
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-3">
                            Keho:
                          </strong>{" "}
                          <span className="text-lg">
                            Fyysinen selviytyminen. Vahingot ja rasitus vähentävät kehon resursseja.
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>{" "}
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-3">
                            Taito:
                          </strong>{" "}
                          <span className="text-lg">
                            Tekniset, asiapohjaiset tai erikoistuneet toimet.
                          </span>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span>{" "}
                        <div>
                          <strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-3">
                            Mieli:
                          </strong>{" "}
                          <span className="text-lg">
                            Henkinen vahvuus ja sosiaalinen murtumattomuus.
                          </span>
                        </div>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </HeadingLevelProvider>
        </TabsContent>
        <TabsContent value="maailma">
          <HeadingLevelProvider>
            <div className="flex flex-col space-y-6">
              <div className="border-b-2 border-[var(--theme-primary)]/20 pb-4">
                <Heading>Maailma</Heading>
                <p className="text-lg font-bold uppercase tracking-wider text-[var(--theme-text)]/80 mt-2">
                  Eventuellit maailman kuvaus ja lore tulee tänne.
                </p>
              </div>
            </div>
          </HeadingLevelProvider>
        </TabsContent>
      </Tabs>
    </Page>
  );
}

export default App;
