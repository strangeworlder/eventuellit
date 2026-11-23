import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ConsoleDock, ConsoleDockItem } from "./ConsoleDock";
import { ConsolePill } from "./ConsolePill";

const meta: Meta<typeof ConsoleDock> = {
  title: "Suunnittelujarjestelma/Konsoli/ConsoleDock",
  component: ConsoleDock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ConsoleDock>;

export const Telakka: Story = {
  render: () => {
    const [tab, setTab] = React.useState<"map" | "cabin" | "downtime" | "gm">("map");
    const [deck, setDeck] = React.useState<string>("all");
    return (
      <div className="max-w-xl p-4">
        <ConsoleDock
          utilityBar={
            <div className="flex items-center gap-1.5">
              {["all", "K01", "K02", "K03", "K04", "K05", "K06"].map((item) => (
                <ConsolePill
                  key={item}
                  active={deck === item}
                  tone={deck === item ? "secondary" : "neutral"}
                  onClick={() => setDeck(item)}
                >
                  {item === "all" ? "KAIKKI" : item}
                </ConsolePill>
              ))}
            </div>
          }
        >
          <ConsoleDockItem
            icon="compass"
            label="Alus"
            active={tab === "map"}
            onClick={() => setTab("map")}
          />
          <ConsoleDockItem
            icon="home"
            label="Hytti"
            active={tab === "cabin"}
            onClick={() => setTab("cabin")}
          />
          <ConsoleDockItem
            icon="dice5"
            label="Väliaika"
            badge="5"
            active={tab === "downtime"}
            onClick={() => setTab("downtime")}
          />
          <ConsoleDockItem
            icon="gear"
            label="Komento"
            active={tab === "gm"}
            onClick={() => setTab("gm")}
          />
        </ConsoleDock>
      </div>
    );
  },
};
