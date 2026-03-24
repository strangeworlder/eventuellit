import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { GameTerm } from "./GameTerm";
import { NoticePanel } from "./NoticePanel";
import "../styles.css";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/NoticePanel",
  component: NoticePanel,
  parameters: {
    layout: "padded",
  },
} satisfies Meta<typeof NoticePanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Onnistuminen: Story = {
  args: {
    variant: "success",
    title: "Hahmo luotu onnistuneesti!",
    children: "Hahmosi tallennettiin tietokantaan.",
    actions: (
      <>
        <Button>Palaa listaan</Button>
        <Button variant="secondary">Tee uusi hahmo</Button>
      </>
    ),
  },
};

export const Tieto: Story = {
  render: () => (
    <NoticePanel variant="info" title="Nopat ja toiminta">
      <p className="text-lg leading-relaxed">
        Sinulla on <GameTerm variant="accent" className="font-black text-xl">5n20</GameTerm>{" "}
        oletuksena. Olet ottanut{" "}
        <GameTerm variant="primary" className="font-bold">2 harmia</GameTerm>, joten
        noppapoolisi koko on{" "}
        <GameTerm variant="primary" className="font-black text-2xl">3</GameTerm>.
      </p>
    </NoticePanel>
  ),
};
