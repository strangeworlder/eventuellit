import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { EditableField } from "./EditableField";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/EditableField",
  component: EditableField,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof EditableField>;

export default meta;
type Story = StoryObj<typeof meta>;

const sukupuoliOptions = [
  { value: "male", label: "Mies" },
  { value: "female", label: "Nainen" },
  { value: "non-binary", label: "Ei-binäärinen" },
  { value: "none", label: "Ei määritelty" },
];

// ── Static / read-only ──────────────────────────────────────────────────────

export const VainLukuArvo: Story = {
  name: "Vain luku (arvo asetettu)",
  args: {
    label: "Arkkityyppi",
    value: "Varjo-agentti",
    readOnly: true,
  },
};

export const VainLukuTyhja: Story = {
  name: "Vain luku (tyhjä → näkymätön)",
  args: {
    label: "Motivaatio",
    value: "",
  },
  render: (args) => (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">
        Vain luku -tilassa tyhjä kenttä ei renderöi mitään. Alla oleva kenttä
        on tyhjä:
      </p>
      <EditableField {...args} readOnly />
      <p className="text-sm italic text-text-placeholder">
        (ei renderöintiä — null)
      </p>
    </div>
  ),
};

// ── Editable single-line ─────────────────────────────────────────────────────

export const MuokattavaYksirivi: Story = {
  name: "Muokattava — yksirivinen",
  args: {
    label: "Arkkityyppi",
    value: "Varjo-agentti",
    placeholder: "Ei arkkityyppiä.",
  },
  render: (args) => {
    const [arvo, setArvo] = useState(args.value);
    return <EditableField {...args} value={arvo} onSave={setArvo} />;
  },
};

// ── Editable multiline ───────────────────────────────────────────────────────

export const MuokattavaMonirivi: Story = {
  name: "Muokattava — monirivi",
  args: {
    label: "Motivaatio",
    value:
      "Löytää kadonneen sisarensa ennen kuin kaupunki suljetaan lopullisesti.",
    placeholder: "Ei motivaatiota kirjattu.",
    multiline: true,
  },
  render: (args) => {
    const [arvo, setArvo] = useState(args.value);
    return <EditableField {...args} value={arvo} onSave={setArvo} />;
  },
};

// ── Empty editable field ─────────────────────────────────────────────────────

export const TyhjaPaikkamerkkitekstilla: Story = {
  name: "Tyhjä kenttä (paikkamerkkiteksti)",
  args: {
    label: "Muistiinpanot",
    value: "",
    placeholder: "Ei muistiinpanoja. Klikkaa lisätäksesi.",
    multiline: true,
  },
  render: (args) => {
    const [arvo, setArvo] = useState(args.value);
    return <EditableField {...args} value={arvo} onSave={setArvo} />;
  },
};

// ── Select mode ──────────────────────────────────────────────────────────────

export const ValintaModeMuokattava: Story = {
  name: "Valintamo — muokattava",
  args: {
    label: "Sukupuoli",
    value: "female",
    placeholder: "Ei valittu",
    options: sukupuoliOptions,
    selectPlaceholder: "Valitse sukupuoli...",
  },
  render: (args) => {
    const [arvo, setArvo] = useState(args.value);
    return <EditableField {...args} value={arvo} onSave={setArvo} />;
  },
};

export const ValintaModetyhjä: Story = {
  name: "Valintamo — tyhjä arvo",
  args: {
    label: "Sukupuoli",
    value: "",
    placeholder: "Ei valittu",
    options: sukupuoliOptions,
    selectPlaceholder: "Valitse sukupuoli...",
  },
  render: (args) => {
    const [arvo, setArvo] = useState(args.value);
    return <EditableField {...args} value={arvo} onSave={setArvo} />;
  },
};

export const ValintaModeVainLuku: Story = {
  name: "Valintamo — vain luku",
  args: {
    label: "Sukupuoli",
    value: "non-binary",
    options: sukupuoliOptions,
    readOnly: true,
  },
};

export const ValintaModeVainLukuTyhja: Story = {
  name: "Valintamo — vain luku, tyhjä → null",
  args: {
    label: "Sukupuoli",
    value: "",
    options: sukupuoliOptions,
    readOnly: true,
  },
  render: (args) => (
    <div className="space-y-3">
      <p className="text-sm text-text-muted">
        Tyhjä vain luku -kenttä ei renderöi mitään:
      </p>
      <EditableField {...args} />
      <p className="text-sm italic text-text-placeholder">(ei renderöintiä — null)</p>
    </div>
  ),
};

// ── Obscured ─────────────────────────────────────────────────────────────────

export const Piilotettuna: Story = {
  name: "Piilotettuna (obscured)",
  args: {
    label: "Salainen identiteetti",
    value: "Vera Mäkinen, entinen kyberturvallisuusasiantuntija",
    obscured: true,
  },
};

// ── Theme override ────────────────────────────────────────────────────────────

export const TemaattinenenYliajos: Story = {
  name: "Teemayliajo (primary-dark)",
  args: {
    label: "Arkkityyppi",
    value: "Varjo-agentti",
    placeholder: "Ei arkkityyppiä.",
    theme: "primary-dark",
  },
  render: (args) => {
    const [arvo, setArvo] = useState(args.value);
    return <EditableField {...args} value={arvo} onSave={setArvo} />;
  },
};

// ── All states side-by-side ───────────────────────────────────────────────────

export const KaikkiTilat: Story = {
  name: "Kaikki tilat",
  tags: ["!manifest"],
  args: {
    label: "Kenttä",
    value: "",
  },
  render: () => {
    const [yksiRivi, setYksiRivi] = useState("Varjo-agentti");
    const [moniRivi, setMoniRivi] = useState(
      "Löytää kadonneen sisarensa ennen kuin kaupunki suljetaan lopullisesti.",
    );
    const [tyhja, setTyhja] = useState("");
    const [sukupuoli, setSukupuoli] = useState("female");

    return (
      <div className="flex flex-col gap-8 max-w-sm">
        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
            Vain luku (arvo)
          </p>
          <EditableField label="Arkkityyppi" value="Varjo-agentti" readOnly />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
            Muokattava — yksirivinen
          </p>
          <EditableField
            label="Arkkityyppi"
            value={yksiRivi}
            placeholder="Ei arkkityyppiä."
            onSave={setYksiRivi}
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
            Muokattava — monirivi
          </p>
          <EditableField
            label="Motivaatio"
            value={moniRivi}
            placeholder="Ei motivaatiota kirjattu."
            onSave={setMoniRivi}
            multiline
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
            Tyhjä (paikkamerkkiteksti)
          </p>
          <EditableField
            label="Muistiinpanot"
            value={tyhja}
            placeholder="Ei muistiinpanoja."
            onSave={setTyhja}
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
            Valintamo (select mode)
          </p>
          <EditableField
            label="Sukupuoli"
            value={sukupuoli}
            placeholder="Ei valittu"
            options={sukupuoliOptions}
            selectPlaceholder="Valitse sukupuoli..."
            onSave={setSukupuoli}
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-widest text-[var(--theme-text)]/40 mb-3 font-heading">
            Piilotettuna
          </p>
          <EditableField
            label="Salainen identiteetti"
            value="Vera Mäkinen, entinen kyberturvallisuusasiantuntija"
            obscured
          />
        </div>
      </div>
    );
  },
};
