import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@repo/ui/components/Card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@repo/ui/components/Tabs";
import { Page } from "@repo/ui/components/Page";

function App() {
  return (
    <Page>
      <Tabs defaultValue="mekaniikat">
        <TabsList>
          <TabsTrigger value="mekaniikat">Säännöt & Mekaniikat</TabsTrigger>
          <TabsTrigger value="maailma">Maailma</TabsTrigger>
        </TabsList>

        <TabsContent value="mekaniikat">
          <Card>
            <CardHeader>
              <CardTitle>Säännöt & Mekaniikat</CardTitle>
              <CardDescription>
                Tämä on Eventuellit roolipelin virallinen sääntökirjamoduuli.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-text/90 leading-relaxed font-light">
              <Card variant="rule">
                <CardContent>
                  <CardTitle>Heiton Ratkaisu</CardTitle>
                  <p className="font-sans text-lg mt-4">
                    Heitä <strong className="text-[var(--theme-accent)] font-bold">2d6</strong> ja lisää kykysi arvo. Jos heitto on vähintään <strong className="text-[var(--theme-accent)] font-bold">10</strong>, toimitus onnistuu täydellisesti.
                    Jos heitto on <strong className="text-[var(--theme-accent)] font-bold">7-9</strong>, onnistut mutta joudut maksamaan hinnan tai kohtaamaan seurauksen.
                  </p>
                </CardContent>
              </Card>

              <Card variant="rule">
                <CardContent>
                  <CardTitle>Ominaisuudet</CardTitle>
                  <ul className="list-none space-y-4 mt-4">
                    <li className="flex items-start"><span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span> <div><strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-3">Keho:</strong> <span className="text-lg">Fyysinen selviytyminen. Vahingot ja rasitus vähentävät kehon resursseja.</span></div></li>
                    <li className="flex items-start"><span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span> <div><strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-3">Taito:</strong> <span className="text-lg">Tekniset, asiapohjaiset tai erikoistuneet toimet.</span></div></li>
                    <li className="flex items-start"><span className="text-[var(--theme-accent)] mr-3 font-bold">▶</span> <div><strong className="text-[var(--theme-primary)] font-black uppercase tracking-widest ml-3">Mieli:</strong> <span className="text-lg">Henkinen vahvuus ja sosiaalinen murtumattomuus.</span></div></li>
                  </ul>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="maailma">
          <Card>
            <CardHeader>
              <CardTitle>Maailma</CardTitle>
              <CardDescription>Eventuellit maailman kuvaus ja lore tulee tänne.</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </Page>
  );
}

export default App;
