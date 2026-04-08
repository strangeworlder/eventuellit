import { requestMagicLink } from "@repo/auth/api";
import { Button } from "@repo/ui/components/Button";
import { Card, CardContent } from "@repo/ui/components/Card";
import { Heading } from "@repo/ui/components/Heading";
import { Icon } from "@repo/ui/components/Icon";
import { Input } from "@repo/ui/components/Input";
import { Stack } from "@repo/ui/components/Layout";
import { Link } from "@repo/ui/components/Link";
import { NoticePanel } from "@repo/ui/components/NoticePanel";
import { Text } from "@repo/ui/components/Text";
import { UtilityPage } from "@repo/ui/components/UtilityPage";
import { useEffect, useRef, useState } from "react";

export const RATE_LIMIT_KEY = "magic_link_rate_limit";
const BASE_COOLDOWN_SECONDS = 30;

interface RateLimitState {
  lastRequestTime: number;
  attemptCount: number;
  nonce: string;
}

function getRateLimitState(): RateLimitState | null {
  try {
    const stored = localStorage.getItem(RATE_LIMIT_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as RateLimitState;
  } catch {
    return null;
  }
}

function setRateLimitState(state: RateLimitState): void {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
}

function getCooldownSeconds(attemptCount: number): number {
  // 30s, 60s, 120s, 240s, ...
  return BASE_COOLDOWN_SECONDS * Math.pow(2, Math.max(0, attemptCount - 1));
}

function getRemainingCooldown(state: RateLimitState | null): number {
  if (!state) return 0;
  const cooldown = getCooldownSeconds(state.attemptCount);
  const elapsed = (Date.now() - state.lastRequestTime) / 1000;
  return Math.max(0, Math.ceil(cooldown - elapsed));
}

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isTampered, setIsTampered] = useState(false);
  const sessionNonce = useRef<string>("");

  // On mount: seed localStorage with a session nonce if not already present,
  // or adopt the existing state but attach our nonce so we can detect tampering.
  useEffect(() => {
    const nonce = crypto.randomUUID();
    sessionNonce.current = nonce;

    const existing = getRateLimitState();
    if (existing) {
      setRateLimitState({ ...existing, nonce });
      setCooldownRemaining(getRemainingCooldown(existing));
    } else {
      setRateLimitState({ lastRequestTime: 0, attemptCount: 0, nonce });
      setCooldownRemaining(0);
    }
  }, []);

  // Tick the cooldown timer every second.
  useEffect(() => {
    if (cooldownRemaining <= 0) return;
    const timer = setInterval(() => {
      const state = getRateLimitState();
      const remaining = getRemainingCooldown(state);
      setCooldownRemaining(remaining);
      if (remaining <= 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const currentState = getRateLimitState();
    if (!currentState || currentState.nonce !== sessionNonce.current) {
      setIsTampered(true);
      return;
    }

    const remaining = getRemainingCooldown(currentState);
    if (remaining > 0) {
      setCooldownRemaining(remaining);
      return;
    }

    setIsLoading(true);

    const attemptCount = currentState.attemptCount + 1;
    setRateLimitState({
      lastRequestTime: Date.now(),
      attemptCount,
      nonce: sessionNonce.current,
    });

    try {
      await requestMagicLink(email);
    } catch {
      // Silently ignore errors — always show success to prevent email enumeration.
    } finally {
      setIsLoading(false);
      setIsSuccess(true);
    }
  };

  if (isSuccess) {
    return (
      <UtilityPage>
        <Icon name="circle-check" variant="branded" />
        <Heading className="text-center">Tarkista<br />sähköpostisi</Heading>

        <NoticePanel variant="success" title="Linkki lähetetty">
          <Text variant="lead">
            Jos sähköpostiosoite on järjestelmässämme, olemme lähettäneet sinulle
            kirjautumislinkin. Tarkista sähköpostisi ja klikkaa linkkiä
            kirjautuaksesi sisään.
          </Text>
          <Text variant="small" className="mt-4">
            Linkki on voimassa 15 minuuttia. Tarkista myös roskapostikansio.
          </Text>
        </NoticePanel>

        <Link href="/">Palaa etusivulle</Link>
      </UtilityPage>
    );
  }

  return (
    <UtilityPage>
      <Icon name="log-in" variant="branded" />
      <Heading className="text-center">Kirjaudu sisään</Heading>

      <Card variant="outline" className="w-full">
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack gap={6}>
              <Input
                label="Sähköpostiosoite"
                type="email"
                placeholder="sähköposti@esimerkki.fi"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading || cooldownRemaining > 0 || isTampered}
              />
              {isTampered && (
                <NoticePanel variant="error" title="Istunto vanhentunut">
                  Selaimen tallennustila on muuttunut. Päivitä sivu ja yritä
                  uudelleen.
                </NoticePanel>
              )}
              {!isTampered && cooldownRemaining > 0 && (
                <NoticePanel variant="info" title="Odota hetki">
                  Voit pyytää uuden linkin {cooldownRemaining} sekunnin
                  kuluttua.
                </NoticePanel>
              )}
              <Button
                type="submit"
                loading={isLoading}
                disabled={!email || cooldownRemaining > 0 || isTampered}
              >
                {isLoading
                  ? "Lähetetään..."
                  : cooldownRemaining > 0
                    ? `Odota ${cooldownRemaining}s`
                    : "Lähetä linkki"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>

      <Stack gap={2} align="center">
        <Text variant="caption" className="text-center max-w-md">
          Kirjautuminen käyttää välttämätöntä evästettä istunnon
          ylläpitämiseksi.{" "}
          <Link href="/tietosuoja">Lue tietosuojaselosteemme</Link>.
        </Text>
        <Link href="/">Palaa etusivulle</Link>
      </Stack>
    </UtilityPage>
  );
}
