import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Icon } from "./Icon";
import { Input } from "./Input";
import { Stack } from "./Layout";
import { Link } from "./Link";
import { NoticePanel } from "./NoticePanel";
import { Text } from "./Text";
import { UtilityPage } from "./UtilityPage";

const meta: Meta<typeof UtilityPage> = {
  title: "Suunnittelujarjestelma/Sivupohjat/UtilityPage",
  component: UtilityPage,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof UtilityPage>;


export const Kirjautuminen: Story = {
  render: () => (
    <UtilityPage>
      <Icon name="log-in" variant="branded" />
      <Heading className="text-center">Kirjaudu sisään</Heading>
      <Card variant="outline" className="w-full">
        <CardContent>
          <Stack gap={6}>
            <Input label="Sähköpostiosoite" type="email" placeholder="sähköposti@esimerkki.fi" />
            <Button>Lähetä linkki</Button>
          </Stack>
        </CardContent>
      </Card>
      <Stack gap={2} align="center">
        <Text variant="caption" className="text-center">
          Kirjautuminen käyttää välttämätöntä evästettä istunnon ylläpitämiseksi.
        </Text>
        <Link href="/">Palaa etusivulle</Link>
      </Stack>
    </UtilityPage>
  ),
};

export const Onnistuminen: Story = {
  render: () => (
    <UtilityPage>
      <Icon name="circle-check" variant="branded" />
      <Heading className="text-center">Tarkista sähköpostisi</Heading>
      <NoticePanel variant="success" title="Linkki lähetetty">
        <Text variant="lead">
          Jos sähköpostiosoite on järjestelmässämme, olemme lähettäneet sinulle
          kirjautumislinkin. Tarkista sähköpostisi.
        </Text>
      </NoticePanel>
      <Link href="/">Palaa etusivulle</Link>
    </UtilityPage>
  ),
};

export const Virhe: Story = {
  render: () => (
    <UtilityPage>
      <Icon name="alert-triangle" variant="branded" />
      <Heading className="text-center">Jokin meni pieleen</Heading>
      <NoticePanel variant="error" title="Virhe">
        <Text>Kirjautumislinkki on virheellinen tai vanhentunut.</Text>
      </NoticePanel>
      <HeadingLevelProvider>
        <Stack direction="row" gap={4}>
          <Button>Yritä uudelleen</Button>
          <Button variant="outline">Palaa etusivulle</Button>
        </Stack>
      </HeadingLevelProvider>
    </UtilityPage>
  ),
};
