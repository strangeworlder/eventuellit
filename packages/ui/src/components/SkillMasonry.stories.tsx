import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkillMasonry } from "./SkillMasonry";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/SkillMasonry",
  component: SkillMasonry,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SkillMasonry>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: "Oletusasettelu",
  args: {
    skills: [
      { id: "1", name: "Hakkerointi" },
      { id: "2", name: "Lääketiede" },
      { id: "3", name: "Tarkkuusammunta" },
      { id: "4", name: "Lähitaistelu" },
      { id: "5", name: "Räjähdysaineet" },
      { id: "6", name: "Tiedustelu" },
    ],
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
  },
};

export const MasonryPacking: Story = {
  name: "Masonry-tiivistys (eri pituudet)",
  args: {
    skills: [
      { id: "1", name: "Hakkerointi" },
      { id: "2", name: "Koneiden korjaus ja purkaminen" },
      { id: "3", name: "Lääketiede", selected: true },
      { id: "4", name: "Avaruuslentojen hallinta ja navigointi" },
      { id: "5", name: "Tiedustelu" },
      { id: "6", name: "Neuvottelu ja suostuttelu muiden kanssa" },
      { id: "7", name: "Taistelutaktiikka ja sotilastiedustelun perusteet" },
      { id: "8", name: "Räjähdysaineet" },
      { id: "9", name: "Lähitaistelu", disabled: true },
    ],
    showCustomButton: true,
    customButtonLabel: "Oma taito...",
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
    onCustomClick: () => console.log("Clicked custom skill"),
  },
};

export const WithSelections: Story = {
  name: "Valintoja tehty",
  args: {
    skills: [
      { id: "1", name: "Hakkerointi", selected: true },
      { id: "2", name: "Lääketiede" },
      { id: "3", name: "Tarkkuusammunta", disabled: true },
      { id: "4", name: "Lähitaistelu" },
      { id: "5", name: "Räjähdysaineet", disabled: true },
      { id: "6", name: "Neuvottelu ja suostuttelu", selected: true },
    ],
    showCustomButton: true,
    isCustomSelected: false,
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
    onCustomClick: () => console.log("Clicked custom skill"),
  },
};

export const CustomSelected: Story = {
  name: "Oma taito valittu",
  args: {
    skills: [
      { id: "1", name: "Avaruuslentojen hallinta ja navigointi (pitkä taito)" },
      { id: "2", name: "Tiedustelu" },
      { id: "3", name: "Neuvottelu ja suostuttelu" },
      { id: "4", name: "Räjähdysaineet" },
    ],
    showCustomButton: true,
    isCustomSelected: true,
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
    onCustomClick: () => console.log("Clicked custom skill"),
  },
};

export const FewItems: Story = {
  name: "Vähän taitoja",
  args: {
    skills: [
      { id: "1", name: "Hakkerointi" },
      { id: "2", name: "Lääketiede" },
    ],
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
  },
};

const sortDemoSkills = [
  { id: "1", name: "Hakkerointi" },
  { id: "2", name: "Koneiden korjaus ja purkaminen" },
  { id: "3", name: "Lääketiede" },
  { id: "4", name: "Avaruuslentojen hallinta ja navigointi" },
  { id: "5", name: "Tiedustelu" },
  { id: "6", name: "Neuvottelu" },
  { id: "7", name: "Taistelutaktiikka ja sotilastiedustelun perusteet" },
  { id: "8", name: "Räjähdysaineet" },
  { id: "9", name: "Lähitaistelu" },
];

export const SortAlphabetical: Story = {
  name: "Järjestys: aakkosjärjestys",
  args: {
    skills: sortDemoSkills,
    sort: "alphabetical",
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
  },
};

export const SortOptimal: Story = {
  name: "Järjestys: optimaalinen tiivistys",
  args: {
    skills: sortDemoSkills,
    sort: "optimal",
    onSkillClick: (skill) => console.log("Clicked:", skill.name),
  },
};

