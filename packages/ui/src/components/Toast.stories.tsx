import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Button } from "./Button";
import { Stack } from "./Layout";
import { ToastProvider, useToast } from "./Toast";

const meta = {
    title: "Suunnittelujarjestelma/Organismit/Toast",
    parameters: {
        layout: "centered",
    },
    tags: ["autodocs"],
    decorators: [
        (Story: React.ComponentType) => (
            <ToastProvider>
                <Story />
            </ToastProvider>
        ),
    ],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// ── Single-variant trigger stories ──

function TietoNappi() {
    const { toast } = useToast();
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast({
                    variant: "info",
                    message: "Kampanja ladataan — odota hetki.",
                })
            }
        >
            Näytä tietoilmoitus
        </Button>
    );
}

function OnnistuminenNappi() {
    const { toast } = useToast();
    return (
        <Button
            onClick={() =>
                toast({
                    variant: "success",
                    message: "Hahmo tallennettu onnistuneesti.",
                })
            }
        >
            Näytä onnistumisilmoitus
        </Button>
    );
}

function VirheNappi() {
    const { toast } = useToast();
    return (
        <Button
            variant="danger"
            onClick={() =>
                toast({
                    variant: "error",
                    message: "Tallennus epäonnistui. Yritä uudelleen.",
                })
            }
        >
            Näytä virhe-ilmoitus
        </Button>
    );
}

function VaroitusNappi() {
    const { toast } = useToast();
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast({
                    variant: "warning",
                    message: "Noppapooli on tyhjä — lisää noppia ennen heittoa.",
                })
            }
        >
            Näytä varoitusilmoitus
        </Button>
    );
}

function ToimintoNappi() {
    const { toast } = useToast();
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast({
                    variant: "info",
                    message: "Hahmo poistettu.",
                    action: {
                        label: "Kumoa",
                        onClick: () => {
                            toast({ variant: "success", message: "Poisto kumottu." });
                        },
                    },
                })
            }
        >
            Näytä toimintopainike
        </Button>
    );
}

function PysyväNappi() {
    const { toast } = useToast();
    return (
        <Button
            variant="outline"
            onClick={() =>
                toast({
                    variant: "warning",
                    message: "Peli päivittyy — tallenna edistymisesi ennen jatkamista.",
                    duration: 0,
                })
            }
        >
            Näytä pysyvä ilmoitus (kesto 0)
        </Button>
    );
}

export const Tieto: Story = {
    render: () => <TietoNappi />,
};

export const Onnistuminen: Story = {
    render: () => <OnnistuminenNappi />,
};

export const Virhe: Story = {
    render: () => <VirheNappi />,
};

export const Varoitus: Story = {
    render: () => <VaroitusNappi />,
};

export const ToiminnollaVarustettuna: Story = {
    render: () => <ToimintoNappi />,
};

export const PysyväIlmoitus: Story = {
    render: () => <PysyväNappi />,
};

export const KaikkiVariantit: Story = {
    render: () => {
        function Paneeli() {
            const { toast, dismissAll } = useToast();
            return (
                <Stack direction="column" gap={3} align="start">
                    <Stack direction="row" gap={2} wrap>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                toast({ variant: "info", message: "Tietoilmoitus: ladataan tietoja." })
                            }
                        >
                            Tieto
                        </Button>
                        <Button
                            size="sm"
                            onClick={() =>
                                toast({
                                    variant: "success",
                                    message: "Onnistuminen: tiedot tallennettu.",
                                })
                            }
                        >
                            Onnistuminen
                        </Button>
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                                toast({ variant: "error", message: "Virhe: yhteys katkesi." })
                            }
                        >
                            Virhe
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                toast({
                                    variant: "warning",
                                    message: "Varoitus: muutoksia ei ole tallennettu.",
                                })
                            }
                        >
                            Varoitus
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                toast({
                                    variant: "info",
                                    message: "Hahmo arkistoitu.",
                                    action: { label: "Kumoa", onClick: () => {} },
                                })
                            }
                        >
                            Toiminto
                        </Button>
                    </Stack>
                    <Button variant="ghost" size="sm" onClick={dismissAll}>
                        Sulje kaikki
                    </Button>
                </Stack>
            );
        }
        return <Paneeli />;
    },
};
