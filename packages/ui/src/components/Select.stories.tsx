import type { Meta, StoryObj } from "@storybook/react-vite";
import { Select } from "./Select";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const statusOptions = [
  { value: "active", label: "Aktiivinen" },
  { value: "completed", label: "Arkistoitu" },
  { value: "planned", label: "Tulossa" },
];

// ── Default (full size) ──────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    options: statusOptions,
  },
};

export const WithLabel: Story = {
  args: {
    label: "Tila",
    options: statusOptions,
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: "Tila",
    placeholder: "Valitse tila...",
    options: statusOptions,
    defaultValue: "",
  },
};

export const WithError: Story = {
  args: {
    label: "Tila",
    options: statusOptions,
    error: "Tila on pakollinen.",
  },
};

export const Obscured: Story = {
  name: "Piilotettu",
  args: {
    label: "Salainen valinta",
    options: statusOptions,
    obscured: true,
  },
};

// ── Compact size ─────────────────────────────────────────────────────────────

export const Compact: Story = {
  name: "Kompakti",
  args: {
    label: "Tila",
    options: statusOptions,
    size: "compact",
  },
};

export const CompactWithPlaceholder: Story = {
  name: "Kompakti (paikkamerkkiteksti)",
  args: {
    label: "Tila",
    placeholder: "Valitse tila...",
    options: statusOptions,
    size: "compact",
    defaultValue: "",
  },
};

// ── Size comparison ───────────────────────────────────────────────────────────

export const KokoVertailu: Story = {
  name: "Kokovertailu (default vs compact)",
  tags: ["!manifest"],
  args: {
    options: statusOptions,
  },
  render: () => (
    <div className="flex flex-col gap-6 w-56">
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
          Default
        </p>
        <Select label="Tila" options={statusOptions} defaultValue="active" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
          Compact
        </p>
        <Select label="Tila" options={statusOptions} size="compact" defaultValue="active" />
      </div>
    </div>
  ),
};
