import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { SkillTagList, type SkillTagItem } from "./SkillTagList";

const meta = {
  title: "Suunnittelujarjestelma/Organismit/SkillTagList",
  component: SkillTagList,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof SkillTagList>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleSkills: SkillTagItem[] = [
  { id: 1, name: "Hakkerointi" },
  { id: 2, name: "Lääketiede" },
  { id: 3, name: "Navigointi", isCustom: true },
  { id: 4, name: "Tarkkuusammunta" },
];

export const VainLuku: Story = {
  name: "Vain luku",
  args: {
    items: sampleSkills,
    readOnly: true,
  },
};

export const Muokattava: Story = {
  name: "Muokattava (täysi CRUD)",
  args: {
    items: sampleSkills,
  },
  render: (args) => {
    const [skills, setSkills] = useState<SkillTagItem[]>([...args.items]);
    let nextId = 100;

    return (
      <SkillTagList
        items={skills}
        onItemEdit={(id, name) => {
          setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
        }}
        onItemRemove={(id) => {
          setSkills((prev) => prev.filter((s) => s.id !== id));
        }}
        onItemAdd={(name) => {
          setSkills((prev) => [...prev, { id: ++nextId, name }]);
        }}
      />
    );
  },
};

export const MuokkausIlmanLisaysta: Story = {
  name: "Muokkaus ilman lisäystä",
  args: {
    items: sampleSkills,
  },
  render: (args) => {
    const [skills, setSkills] = useState<SkillTagItem[]>([...args.items]);

    return (
      <SkillTagList
        items={skills}
        showCustomToggle
        onItemEdit={(id, name, isCustom) => {
          setSkills((prev) =>
            prev.map((s) => (s.id === id ? { ...s, name, isCustom: isCustom ?? s.isCustom } : s)),
          );
        }}
      />
    );
  },
};

export const Tyhja: Story = {
  name: "Tyhjä lista",
  args: {
    items: [],
  },
};

export const TyhjaLisaysmahdollisuudella: Story = {
  name: "Tyhjä + lisäys",
  args: {
    items: [],
  },
  render: (args) => {
    const [skills, setSkills] = useState<SkillTagItem[]>([...args.items]);
    let nextId = 1;

    return (
      <SkillTagList
        items={skills}
        onItemEdit={(id, name) => {
          setSkills((prev) => prev.map((s) => (s.id === id ? { ...s, name } : s)));
        }}
        onItemAdd={(name) => {
          setSkills((prev) => [...prev, { id: ++nextId, name }]);
        }}
      />
    );
  },
};
