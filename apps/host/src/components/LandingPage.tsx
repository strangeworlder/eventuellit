import { useAuth } from "@repo/auth/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelContext } from "@repo/ui/components/Heading";
import { Stack } from "@repo/ui/components/Layout";
import { Text } from "@repo/ui/components/Text";
import { VideoCta } from "@repo/ui/components/VideoCta";

import { useNavigate } from "react-router-dom";

export function LandingPage() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4">
      <HeadingLevelContext.Provider value={1}>
        <Stack gap={6} align="center" className="text-center mb-16">
          <Heading className="text-3xl mobile:text-5xl tablet:text-7xl font-black tracking-tighter">
            EVENTUELLIT
          </Heading>
          <Text variant="lead" className="max-w-2xl mx-auto">
            Kapina staattisuutta vastaan.
          </Text>
          <Text variant="muted" className="max-w-2xl mx-auto">
            Eventuellit on pöytäroolipeli, jossa pelaajat muokkaavat maailmaa yhdessä.
            Säännöt painottavat improvisaatiota, vapaata narratiivia ja yhteisiä päätöksiä
            – ei staattisia taulukoita.
          </Text>
        </Stack>

        <div className="w-full max-w-4xl mb-16">
          <VideoCta
            youtubeId="I6QePHTGGqU"
            title="Eventuellit – Kutsu kapinaan staattisuutta vastaan"
            ctaText="Lue esittely"
            onClickCta={() => navigate("/ruleset/johdanto")}
          />
        </div>

        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-8 w-full max-w-4xl">
          {isLoggedIn && (
            <Card
              variant="interactive"
              onClick={() => navigate("/oma-sivu")}
              iconName="list-checks"
              iconVariant="primary"
            >
              <CardHeader>
                <CardTitle>Oma sivu</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>
                  Ilmoitukset, hahmosi ja ajankohtaiset tapahtumat yhdellä silmäyksellä.
                </Text>
              </CardContent>
            </Card>
          )}

          {isLoggedIn && (
            <Card
              variant="interactive"
              onClick={() => navigate("/generator")}
              iconName="player-character"
              iconVariant="primary"
            >
              <CardHeader>
                <CardTitle>Hahmot</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>
                  Luo ja muokkaa hahmoja Eventuellit-järjestelmään. Kaikki työkalut
                  hahmonkehitykseen yhdessä paikassa.
                </Text>
              </CardContent>
            </Card>
          )}

          <Card
            variant="interactive"
            onClick={() => navigate("/ruleset/johdanto")}
            iconName="rulebook"
            iconVariant="primary"
          >
            <CardHeader>
              <CardTitle>Sääntökirja</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>
                Tutustu pelin sääntöihin ja mekaniikkoihin. Kattava ja helposti selattava opas
                kaikille pelaajille.
              </Text>
            </CardContent>
          </Card>

          <Card
            variant="interactive"
            onClick={() => navigate("/episodes/latest")}
            iconName="file-cabinet"
            iconVariant="primary"
          >
            <CardHeader>
              <CardTitle>Jaksot</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>
                Seuraa meneillään olevia jaksoja ja tutki menneitä seikkailuja. Valmistaudu
                seuraavaan istuntoon.
              </Text>
            </CardContent>
          </Card>

          {isLoggedIn && (
            <Card
              variant="interactive"
              onClick={() => navigate("/operaatiot")}
              iconName="arrow-right"
              iconVariant="primary"
            >
              <CardHeader>
                <CardTitle>Operaatiot</CardTitle>
              </CardHeader>
              <CardContent>
                <Text>
                  Äänestä tulevista operaatioista ja vaikuta seuraavan session suuntaan.
                </Text>
              </CardContent>
            </Card>
          )}

          <Card
            variant="interactive"
            onClick={() => navigate("/world")}
            iconName="world"
            iconVariant="primary"
          >
            <CardHeader>
              <CardTitle>Maailma</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>
                Tutustu pelin maailmaan ja sen historiaan. Tutki alueita, faktioita ja tapahtumia.
              </Text>
            </CardContent>
          </Card>
        </div>
      </HeadingLevelContext.Provider>
    </div>
  );
}
