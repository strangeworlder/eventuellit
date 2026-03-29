import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Variants ── */

export const Primary: Story = {
  args: {
    variant: "solid",
    children: "Hyökkää",
  },
};

export const Secondary: Story = {
  args: {
    variant: "outline",
    children: "Puolusta",
  },
};

export const Danger: Story = {
  args: {
    variant: "danger",
    children: "Tuhoa",
  },
};

export const GhostSecondary: Story = {
  args: {
    variant: "ghost-subtle",
    children: "Peruuta",
  },
};

export const NavButton: Story = {
  args: {
    variant: "ghost-subtle",
    size: "nav",
    justify: "start",
    children: "Sääntökirja",
  },
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-64 bg-background border border-border p-2 rounded-md">
        <Story />
      </div>
    ),
  ],
};

/* ── States: Disabled ── */

export const DisabledPrimary: Story = {
  name: "Ei käytössä (primary)",
  args: {
    variant: "solid",
    disabled: true,
    children: "Ei käytössä",
  },
};

export const DisabledSecondary: Story = {
  name: "Ei käytössä (secondary)",
  args: {
    variant: "outline",
    disabled: true,
    children: "Ei käytössä",
  },
};

export const DisabledDanger: Story = {
  name: "Ei käytössä (danger)",
  args: {
    variant: "danger",
    disabled: true,
    children: "Ei käytössä",
  },
};

export const DisabledGhostSecondary: Story = {
  name: "Ei käytössä (ghost-secondary)",
  args: {
    variant: "ghost-subtle",
    disabled: true,
    children: "Ei käytössä",
  },
};

/* ── States: Obscured ── */

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    obscured: true,
    children: "Lähetä raportti",
  },
};

export const CompactSize: Story = {
  name: "Tiivis (GM-työkalut)",
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="compact" variant="solid">Tallenna</Button>
      <Button size="compact" variant="outline">Peruuta</Button>
      <Button size="compact" variant="danger">Poista</Button>
      <Button size="compact" variant="ghost-subtle">Lisää</Button>
    </div>
  ),
};

export const CompactVsDefault: Story = {
  name: "Tiivis vs. oletus",
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <Button size="default" variant="solid">Oletus</Button>
        <Button size="sm" variant="solid">Pieni</Button>
        <Button size="compact" variant="solid">Tiivis</Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button size="default" variant="outline">Oletus</Button>
        <Button size="sm" variant="outline">Pieni</Button>
        <Button size="compact" variant="outline">Tiivis</Button>
      </div>
    </div>
  ),
};

export const ObscuredAllSizes: Story = {
  name: "Piilotettu (koot)",
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button obscured size="sm">Pieni</Button>
      <Button obscured size="default">Oletus</Button>
      <Button obscured size="lg">Suuri painike</Button>
    </div>
  ),
};

/* ── States: Multiline ── */

export const Multiline: Story = {
  name: "Monirivi",
  render: () => (
    <div className="flex flex-col gap-6 max-w-xs">
      <Button>Lyhyt teksti</Button>
      <Button>Pidempi teksti joka menee kahdelle riville tässä painikkeessa</Button>
      <Button size="sm">Pieni painike jolla on pitkä teksti monella rivillä esimerkkinä</Button>
      <Button size="lg">Suuri painike jossa on erityisen pitkä teksti joka vaatii useamman rivin näytöllä</Button>
    </div>
  ),
};

export const MultilineAllVariants: Story = {
  name: "Monirivi (kaikki variantit)",
  tags: ["!manifest"],
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4 max-w-2xl">
      <Button variant="solid">Ensisijainen painike jonka teksti on pitkä ja menee monelle riville</Button>
      <Button variant="outline">Toissijainen painike jonka teksti on pitkä ja menee monelle riville</Button>
      <Button variant="danger">Vaarapainike jonka teksti on pitkä ja menee monelle riville</Button>
      <Button variant="ghost-subtle">Haamupainike jonka teksti on pitkä ja menee monelle riville</Button>
    </div>
  ),
};

/* ── States: Loading ── */

export const LoadingPrimary: Story = {
  name: "Ladataan (primary)",
  args: {
    variant: "solid",
    loading: true,
    loadingMessage: "Tallennus on kaynnissa, odota hetki",
    children: "Tallennetaan...",
  },
};

export const LoadingSecondary: Story = {
  name: "Ladataan (secondary)",
  args: {
    variant: "outline",
    loading: true,
    children: "Ladataan...",
  },
};

export const LoadingDanger: Story = {
  name: "Ladataan (danger)",
  args: {
    variant: "danger",
    loading: true,
    loadingMessage: "Poisto on kaynnissa, odota hetki",
    children: "Poistetaan...",
  },
};

export const LoadingLarge: Story = {
  name: "Ladataan (suuri)",
  args: {
    variant: "solid",
    size: "lg",
    loading: true,
    children: "Tallennetaan hahmoa...",
  },
};

/* ── States: All variants side-by-side ── */

export const AllStates: Story = {
  name: "Kaikki tilat",
  tags: ["!manifest"],
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Oletus
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="solid">Ensisijainen</Button>
          <Button variant="outline">Toissijainen</Button>
          <Button variant="danger">Vaara</Button>
          <Button variant="ghost-subtle">Haamu</Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Ei käytössä
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="solid" disabled>Ensisijainen</Button>
          <Button variant="outline" disabled>Toissijainen</Button>
          <Button variant="danger" disabled>Vaara</Button>
          <Button variant="ghost-subtle" disabled>Haamu</Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Ladataan
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="solid" loading>Ensisijainen</Button>
          <Button variant="outline" loading>Toissijainen</Button>
          <Button variant="danger" loading>Vaara</Button>
          <Button variant="ghost-subtle" loading>Haamu</Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Piilotettu
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="solid" obscured>Ensisijainen</Button>
          <Button variant="outline" obscured>Toissijainen</Button>
          <Button variant="danger" obscured>Vaara</Button>
          <Button variant="ghost-subtle" obscured>Haamu</Button>
        </div>
      </div>
    </div>
  ),
};

export const DangerDistinct: Story = {
  name: "Vaara (monikanavainen vihje)",
  render: () => (
    <div className="flex flex-col gap-4">
      <p className="text-sm opacity-80 max-w-[48ch]">
        Vaarapainikkeessa on oletusikoni, taustaikoni ja vahvempi rakenne (reuna + varjo), jotta
        merkitys ei perustu vain variin.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button variant="solid">Tallenna</Button>
        <Button variant="outline">Peruuta</Button>
        <Button variant="danger">Poista hahmo</Button>
        <Button variant="danger" loading loadingMessage="Poisto on kaynnissa, odota hetki">
          Poistetaan...
        </Button>
      </div>
    </div>
  ),
};

export const LoadingTooltipByTheme: Story = {
  name: "Latausvihje teemoissa",
  tags: ["!manifest"],
  parameters: {
    layout: "padded",
  },
  render: () => (
    <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
      {(["base", "inverted", "secondary-dark", "accent-dark"] as const).map((theme) => (
        <div
          key={theme}
          data-theme={theme}
          className="rounded-xl border border-[var(--theme-secondary)]/30 p-4 space-y-3 bg-[var(--theme-bg)] text-[var(--theme-text)]"
        >
          <p className="text-xs uppercase tracking-widest opacity-70">{theme}</p>
          <Button
            theme={theme}
            variant="danger"
            loading
            loadingMessage="Toiminto on kaynnissa, odota hetki"
          >
            Kriittinen toiminto
          </Button>
        </div>
      ))}
    </div>
  ),
};
