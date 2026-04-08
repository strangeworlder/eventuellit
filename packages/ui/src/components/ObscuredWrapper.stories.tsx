import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { Heading, HeadingLevelProvider } from "./Heading";
import { Input } from "./Input";
import { ObscuredWrapper } from "./ObscuredWrapper";

const meta: Meta<typeof ObscuredWrapper> = {
  title: "Suunnittelujarjestelma/Molekyylit/ObscuredWrapper",
  component: ObscuredWrapper,
  argTypes: {
    revealed: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof ObscuredWrapper>;

export const Piilotettu: Story = {
  name: "Piilotettu",
  args: {
    revealed: false,
  },
  render: (args) => (
    <HeadingLevelProvider>
      <ObscuredWrapper {...args}>
        <div className="space-y-4">
          <Heading>Arkkityyppi</Heading>
          <p className="text-sm">Valitse hahmosi arkkityyppi alta.</p>
          <div className="flex gap-3">
            <Button variant="outline">Ekspertti</Button>
            <Button variant="outline">Sotilas</Button>
          </div>
          <Input label="Hahmon nimi" placeholder="Syötä nimi..." value="" onChange={() => {}} />
        </div>
      </ObscuredWrapper>
    </HeadingLevelProvider>
  ),
};

export const Paljastettu: Story = {
  name: "Paljastettu",
  args: {
    revealed: true,
  },
  render: (args) => (
    <HeadingLevelProvider>
      <ObscuredWrapper {...args}>
        <div className="space-y-4">
          <Heading>Arkkityyppi</Heading>
          <p className="text-sm">Valitse hahmosi arkkityyppi alta.</p>
          <div className="flex gap-3">
            <Button variant="outline">Ekspertti</Button>
            <Button variant="outline">Sotilas</Button>
          </div>
          <Input label="Hahmon nimi" placeholder="Syötä nimi..." value="" onChange={() => {}} />
        </div>
      </ObscuredWrapper>
    </HeadingLevelProvider>
  ),
};
