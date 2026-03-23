import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";
import { Input } from "./Input";
import { RadioGroup, RadioGroupItem } from "./RadioGroup";
import { Select } from "./Select";
import { Switch } from "./Switch";
import { TextArea } from "./TextArea";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/Lomakkeet",
  parameters: {
    layout: "padded",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Showcase of all form input components rendered side-by-side
 * for visual harmony verification.
 */
export const Kaikki: Story = {
  render: () => {
    const [radioValue, setRadioValue] = useState("expert");
    const [switchChecked, setSwitchChecked] = useState(false);

    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <h2 className="text-2xl font-heading font-bold mb-6">
          Lomake-elementit
        </h2>

        {/* Input */}
        <section>
          <Input
            label="Tekstikenttä"
            placeholder="Kirjoita tähän..."
          />
        </section>

        {/* TextArea */}
        <section>
          <TextArea
            label="Tekstialue"
            placeholder="Pidempi teksti..."
            className="h-24"
          />
        </section>

        {/* TextArea monospace */}
        <section>
          <TextArea
            label="Koodieditori"
            placeholder="### Markdown..."
            variant="monospace"
            className="h-24"
          />
        </section>

        {/* Select */}
        <section>
          <Select
            label="Pudotusvalikko"
            placeholder="Valitse..."
            options={[
              { value: "a", label: "Vaihtoehto A" },
              { value: "b", label: "Vaihtoehto B" },
              { value: "c", label: "Vaihtoehto C" },
            ]}
          />
        </section>

        {/* Checkbox */}
        <section>
          <Checkbox
            label="Valintaruutu"
            description="Valinnallinen kuvaus valintaruudulle."
          />
        </section>

        {/* RadioGroup */}
        <section>
          <RadioGroup
            name="showcase-radio"
            label="Radiopainikkeet"
            value={radioValue}
            onValueChange={setRadioValue}
          >
            <RadioGroupItem value="expert" label="Vaihtoehto 1" description="Ensimmäinen vaihtoehto." />
            <RadioGroupItem value="soldier" label="Vaihtoehto 2" description="Toinen vaihtoehto." />
            <RadioGroupItem value="monk" label="Estetty" disabled />
          </RadioGroup>
        </section>

        {/* Switch */}
        <section>
          <Switch
            label="Kytkin"
            description="Päälle tai pois."
            checked={switchChecked}
            onChange={(e) => setSwitchChecked(e.target.checked)}
          />
        </section>

        {/* Error states */}
        <div className="border-t-2 border-[var(--theme-secondary)]/20 pt-8 mt-8">
          <h3 className="text-lg font-heading font-bold mb-4 text-[var(--theme-accent)]">
            Virhetilat
          </h3>
          <div className="space-y-6">
            <Input label="Virheellinen" error="Kenttä on pakollinen." />
            <TextArea label="Virheellinen" error="Kenttä on pakollinen." className="h-16" />
            <Select
              label="Virheellinen"
              error="Valinta on pakollinen."
              options={[{ value: "a", label: "A" }]}
            />
            <Checkbox label="Virheellinen" error="Hyväksy ehdot." />
            <RadioGroup name="error-radio" label="Virheellinen" error="Valinta puuttuu.">
              <RadioGroupItem value="a" label="A" />
              <RadioGroupItem value="b" label="B" />
            </RadioGroup>
            <Switch label="Virheellinen" error="Asetus vaaditaan." />
          </div>
        </div>
        {/* Obscured states */}
        <div className="border-t-2 border-[var(--theme-secondary)]/20 pt-8 mt-8">
          <h3 className="text-lg font-heading font-bold mb-4 text-[var(--theme-secondary)]">
            Piilotettu
          </h3>
          <div className="space-y-6">
            <Input label="Tekstikenttä" placeholder="Ei näkyvissä..." obscured />
            <TextArea label="Tekstialue" placeholder="Pidempi teksti..." className="h-24" obscured />
            <Select
              label="Pudotusvalikko"
              options={[
                { value: "a", label: "Vaihtoehto A" },
                { value: "b", label: "Vaihtoehto B" },
              ]}
              obscured
            />
            <Checkbox label="Valintaruutu" description="Valinnallinen kuvaus." obscured />
            <RadioGroup name="obscured-radio" label="Radiopainikkeet" obscured>
              <RadioGroupItem value="a" label="Vaihtoehto 1" description="Ensimmäinen." />
              <RadioGroupItem value="b" label="Vaihtoehto 2" description="Toinen." />
            </RadioGroup>
            <Switch label="Kytkin" description="Ei näkyvissä." obscured />
          </div>
        </div>
      </div>
    );
  },
};
