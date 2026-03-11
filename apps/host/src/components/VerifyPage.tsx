import { Button } from "@repo/ui/components/Button";
import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { LoadingState } from "@repo/ui/components/LoadingState";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Page } from "@repo/ui/components/Page";
import { verifyToken } from "@repo/auth/api";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

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
        <HeadingLevelProvider>
          <Hero title="Vahvistetaan kirjautumista..." />
          <div className="px-4">
            <LoadingState message="Vahvistetaan kirjautumislinkkiä..." />
          </div>
        </HeadingLevelProvider>
      </Page>
    );
  }

  return (
    <Page>
      <HeadingLevelProvider>
        <Hero title="Kirjautuminen epäonnistui" />
        <div className="px-4 space-y-8 animate-in fade-in duration-500">
          <NoticePanel variant="error" title="Virhe">
            <p className="text-lg">{error || "Kirjautumislinkki on virheellinen tai vanhentunut."}</p>
            <p className="text-sm text-text/60 mt-4">
              Pyydä uusi kirjautumislinkki, jos ongelma jatkuu.
            </p>
          </NoticePanel>
          <div className="flex gap-4">
            <Button onClick={() => navigate("/kirjaudu")}>Yritä uudelleen</Button>
            <Button variant="secondary" onClick={() => navigate("/")}>
              Palaa etusivulle
            </Button>
          </div>
        </div>
      </HeadingLevelProvider>
    </Page>
  );
}
