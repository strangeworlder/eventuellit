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
        <Stack
          gap={6}
          align="center"
          className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700"
        >
          <Heading className="text-3xl mobile:text-5xl tablet:text-7xl font-black tracking-tighter">
            EVENTUELLIT
          </Heading>
          <Text variant="lead" className="max-w-2xl mx-auto">
            Kaikki mitä tarvitset seuraavaan roolipelisessioosi. Luo hahmoja, tarkista säännöt ja
            uppoudu tarinaan.
          </Text>
        </Stack>

        <div className="w-full max-w-4xl mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
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
              className="group cursor-pointer hover:border-[var(--theme-border-medium)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] animate-in fade-in slide-in-from-left-8 duration-700 delay-100"
              onClick={() => navigate("/generator")}
              iconName="player-character"
              iconVariant="primary"
            >
              <CardHeader>
                <CardTitle>Hahmopaja</CardTitle>
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
            className="group cursor-pointer hover:border-[var(--theme-border-medium)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
            onClick={() => navigate("/ruleset")}
            iconName="rulebook"
            iconVariant="primary"
          >
            <CardHeader>
              <CardTitle>Sääntökirja</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>
                Tutustu pelin sääntöihin ja maailmaan. Kattava ja helposti selattava opas kaikille
                pelaajille.
              </Text>
            </CardContent>
          </Card>

          <Card
            className="group cursor-pointer hover:border-[var(--theme-border-medium)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] animate-in fade-in slide-in-from-right-8 duration-700 delay-300"
            onClick={() => navigate("/episodes")}
            iconName="zap"
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

          <Card
            className="group cursor-pointer hover:border-[var(--theme-border-medium)] transition-all duration-300 hover:shadow-[var(--shadow-floating)] animate-in fade-in slide-in-from-right-8 duration-700 delay-300"
            onClick={() => navigate("/world")}
            iconName="world"
            iconVariant="primary"
          >
            <CardHeader>
              <CardTitle>Maailma</CardTitle>
            </CardHeader>
            <CardContent>
              <Text>Tutustu pelin maailmaan. Tutki eri alueita, kulttuureja ja tapahtumia.</Text>
            </CardContent>
          </Card>
        </div>
      </HeadingLevelContext.Provider>
    </div>
  );
}
