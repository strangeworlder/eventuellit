import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { EntityCard } from "./EntityCard";
import { Grid } from "./Layout";
import { Badge } from "./Badge";
import { Stack } from "./Layout";

const meta: Meta<typeof EntityCard> = {
    title: "Suunnittelujarjestelma/Molekyylit/EntityCard",
    component: EntityCard,
    tags: ["autodocs"],
    decorators: [
        (Story) => (
            <MemoryRouter>
                <Story />
            </MemoryRouter>
        ),
    ],
    argTypes: {
        color: {
            control: "select",
            options: ["primary", "secondary", "accent"],
        },
        variant: {
            control: "select",
            options: ["faction", "npc"],
        },
    },
};

export default meta;
type Story = StoryObj<typeof EntityCard>;

export const MainFaction: Story = {
    args: {
        name: "Tuhkan puolue",
        subtitle: "Yhteisöllinen vastaliike — vanhan liiton perintö ja Kynnyksen sydän.",
        color: "primary",
        variant: "faction",
        href: "/world/faktiot/tuhkan-puolue",
    },
};

export const Subfaction: Story = {
    args: {
        name: "Ratasvartio",
        subtitle: "Konsortion erikoisjoukot — kasvottomat kypärät ja rautainen järjestys.",
        color: "secondary",
        parentLabel: "KW-konsortio",
        variant: "npc",
        href: "/world/faktiot/ratasvartio",
    },
};

export const WithImage: Story = {
    args: {
        name: "Ekklesia",
        subtitle: "Teatterinen kirkko — kaaoksen ja kohtalon palvelijat.",
        color: "accent",
        imageUrl: "https://picsum.photos/seed/ekklesia/400/200",
        variant: "faction",
        href: "/world/faktiot/ekklesia",
    },
};

export const WithChildren: Story = {
    args: {
        name: "KW-konsortio",
        subtitle: "Suurkonsortio — koneiston isännät ja Kynnyksen taloudellinen selkäranka.",
        color: "secondary",
        variant: "faction",
        href: "/world/faktiot/kw-konsortio",
    },
    render: (args) => (
        <MemoryRouter>
            <EntityCard {...args} className="max-w-xs">
                <Stack gap={2} className="mt-1">
                    <Badge variant="ghost">3 alafaktiota</Badge>
                    <Badge variant="ghost">6 asemaa</Badge>
                </Stack>
            </EntityCard>
        </MemoryRouter>
    ),
};

export const PowerTriad: Story = {
    render: () => (
        <MemoryRouter>
            <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
                <div className="flex justify-center">
                    <EntityCard
                        name="Ekklesia"
                        subtitle="Teatterinen kirkko — kaaoksen ja kohtalon palvelijat."
                        color="accent"
                        href="/world/faktiot/ekklesia"
                        className="w-full max-w-xs"
                    >
                        <Stack gap={2} className="mt-1">
                            <Badge variant="ghost">3 alafaktiota</Badge>
                            <Badge variant="ghost">3 asemaa</Badge>
                        </Stack>
                    </EntityCard>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <EntityCard
                        name="Tuhkan puolue"
                        subtitle="Yhteisöllinen vastaliike — vanhan liiton perintö."
                        color="primary"
                        href="/world/faktiot/tuhkan-puolue"
                    >
                        <Stack gap={2} className="mt-1">
                            <Badge variant="ghost">3 alafaktiota</Badge>
                        </Stack>
                    </EntityCard>
                    <EntityCard
                        name="KW-konsortio"
                        subtitle="Suurkonsortio — koneiston isännät."
                        color="secondary"
                        href="/world/faktiot/kw-konsortio"
                    >
                        <Stack gap={2} className="mt-1">
                            <Badge variant="ghost">3 alafaktiota</Badge>
                        </Stack>
                    </EntityCard>
                </div>
            </div>
        </MemoryRouter>
    ),
};

export const AllFaktiotGrid: Story = {
    render: () => (
        <MemoryRouter>
            <Grid cols={3} gap={4} className="p-6">
                <EntityCard name="Tuhkan puolue" subtitle="Yhteisöllinen vastaliike." color="primary" href="/world/faktiot/tuhkan-puolue" />
                <EntityCard name="KW-konsortio" subtitle="Suurkonsortio." color="secondary" href="/world/faktiot/kw-konsortio" />
                <EntityCard name="Ekklesia" subtitle="Teatterinen kirkko." color="accent" href="/world/faktiot/ekklesia" />
                <EntityCard name="Muotinvalajat" subtitle="Agitaattorit ja propagandistit." color="primary" parentLabel="Tuhkan puolue" variant="npc" href="/world/faktiot/muotinvalajat" />
                <EntityCard name="Heimolaiset" subtitle="Yhteisöllinen kasvuliike." color="primary" parentLabel="Tuhkan puolue" variant="npc" href="/world/faktiot/heimolaiset" />
                <EntityCard name="Erottajat" subtitle="Separatistit." color="primary" parentLabel="Tuhkan puolue" variant="npc" href="/world/faktiot/erottajat" />
                <EntityCard name="Ratasvartio" subtitle="Erikoisjoukot." color="secondary" parentLabel="KW-konsortio" variant="npc" href="/world/faktiot/ratasvartio" />
                <EntityCard name="Logiikan Inkvisitio" subtitle="Ideologinen siivousosasto." color="secondary" parentLabel="KW-konsortio" variant="npc" href="/world/faktiot/logiikan-inkvisitio" />
                <EntityCard name="Haaskalinnut" subtitle="Opportunistit." color="secondary" parentLabel="KW-konsortio" variant="npc" href="/world/faktiot/haaskalinnut" />
            </Grid>
        </MemoryRouter>
    ),
};
