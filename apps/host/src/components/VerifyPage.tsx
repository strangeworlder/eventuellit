import { verifyToken } from "@repo/auth/api";
import { Button } from "@repo/ui/components/Button";
import { Hero } from "@repo/ui/components/Hero";
import { Stack } from "@repo/ui/components/Layout";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page, PageBody } from "@repo/ui/components/Page";
import { Text } from "@repo/ui/components/Text";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RATE_LIMIT_KEY } from "./LoginPage";

export function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!token) {
      setError("Kirjautumislinkki puuttuu");
      setIsVerifying(false);
      return;
    }

    const verify = async () => {
      try {
        const user = await verifyToken(token);
        // Invalidate auth query to refresh user state
        queryClient.setQueryData(["auth", "me"], user);
        queryClient.invalidateQueries({ queryKey: ["auth"] });
        // Clear rate limit so returning users start fresh next time
        localStorage.removeItem(RATE_LIMIT_KEY);
        // Redirect to generator after successful login
        navigate("/generator");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Kirjautuminen epäonnistui");
        setIsVerifying(false);
      }
    };

    verify();
  }, [token, navigate, queryClient]);

  if (isVerifying) {
    return (
      <Page>
        <Hero title="Vahvistetaan kirjautumista..." />
        <PageBody>
          <LoadingState message="Vahvistetaan kirjautumislinkkiä..." />
        </PageBody>
      </Page>
    );
  }

  return (
    <Page>
      <Hero title="Kirjautuminen epäonnistui" />
      <PageBody>
        <NoticePanel variant="error" title="Virhe">
          <Text variant="lead">{error || "Kirjautumislinkki on virheellinen tai vanhentunut."}</Text>
          <Text variant="small" className="mt-4">
            Pyydä uusi kirjautumislinkki, jos ongelma jatkuu.
          </Text>
        </NoticePanel>
        <Stack direction="row" gap={4}>
          <Button onClick={() => navigate("/kirjaudu")}>Yritä uudelleen</Button>
          <Button variant="outline" onClick={() => navigate("/")}>
            Palaa etusivulle
          </Button>
        </Stack>
      </PageBody>
    </Page>
  );
}
