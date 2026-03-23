import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/Button",
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
    variant: "primary",
    children: "Hyökkää",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
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
    variant: "ghost-secondary",
    children: "Peruuta",
  },
};

export const NavButton: Story = {
  args: {
    variant: "ghost-secondary",
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
    variant: "primary",
    disabled: true,
    children: "Ei käytössä",
  },
};

export const DisabledSecondary: Story = {
  name: "Ei käytössä (secondary)",
  args: {
    variant: "secondary",
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
    variant: "ghost-secondary",
    disabled: true,
    children: "Ei käytössä",
  },
};

/* ── States: Obscured ── */

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    variant: "obscured",
    children: "Lähetä raportti",
  },
};

export const ObscuredAllSizes: Story = {
  name: "Piilotettu (koot)",
  render: () => (
    <div className="flex flex-wrap items-end gap-4">
      <Button variant="obscured" size="sm">Pieni</Button>
      <Button variant="obscured" size="default">Oletus</Button>
      <Button variant="obscured" size="lg">Suuri painike</Button>
    </div>
  ),
};

/* ── States: Loading ── */

export const LoadingPrimary: Story = {
  name: "Ladataan (primary)",
  args: {
    variant: "primary",
    loading: true,
    loadingMessage: "Tallennus on kaynnissa, odota hetki",
    children: "Tallennetaan...",
  },
};

export const LoadingSecondary: Story = {
  name: "Ladataan (secondary)",
  args: {
    variant: "secondary",
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
    variant: "primary",
    size: "lg",
    loading: true,
    children: "Tallennetaan hahmoa...",
  },
};

/* ── States: All variants side-by-side ── */

export const AllStates: Story = {
  name: "Kaikki tilat",
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Oletus
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Ensisijainen</Button>
          <Button variant="secondary">Toissijainen</Button>
          <Button variant="danger">Vaara</Button>
          <Button variant="ghost-secondary">Haamu</Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Ei käytössä
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" disabled>Ensisijainen</Button>
          <Button variant="secondary" disabled>Toissijainen</Button>
          <Button variant="danger" disabled>Vaara</Button>
          <Button variant="ghost-secondary" disabled>Haamu</Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Ladataan
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary" loading>Ensisijainen</Button>
          <Button variant="secondary" loading>Toissijainen</Button>
          <Button variant="danger" loading>Vaara</Button>
          <Button variant="ghost-secondary" loading>Haamu</Button>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--theme-text)]/50">
          Piilotettu
        </p>
        <div className="flex flex-wrap gap-4">
          <Button variant="obscured">Ensisijainen</Button>
          <Button variant="obscured">Toissijainen</Button>
          <Button variant="obscured">Vaara</Button>
          <Button variant="obscured">Haamu</Button>
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
        <Button variant="primary">Tallenna</Button>
        <Button variant="secondary">Peruuta</Button>
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
