import { Badge } from "@repo/ui/components/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/components/Card";
import { Heading, HeadingLevelContext } from "@repo/ui/components/Heading";

import { useNavigate } from "react-router-dom";

export function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] py-12 px-4">
            <HeadingLevelContext.Provider value={1}>
                <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <Badge icon="sparkles" className="mb-4">
                        Tervetuloa seikkailuun
                    </Badge>
                    <Heading className="text-5xl tablet:text-7xl font-black tracking-tighter">
                        EVENTUELLIT
                    </Heading>
                    <p className="text-xl text-text/60 max-w-2xl mx-auto leading-relaxed">
                        Kaikki mitä tarvitset seuraavaan roolipelisessioosi.
                        Luo hahmoja, tarkista säännöt ja uppoudu tarinaan.
                    </p>
                </div>

                <div className="grid grid-cols-1 tablet:grid-cols-2 desktop:grid-cols-3 gap-8 w-full max-w-6xl">
                    <Card
                        className="group cursor-pointer hover:border-primary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10 animate-in fade-in slide-in-from-left-8 duration-700 delay-100"
                        onClick={() => navigate("/generator")}
                        theme="base"
                        iconName="dice5"
                        iconVariant="primary"
                    >
                        <CardHeader>
                            <CardTitle>Hahmopaja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text/70">
                                Luo ja muokkaa hahmoja Eventuellit-järjestelmään. Kaikki työkalut hahmonkehitykseen yhdessä paikassa.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="group cursor-pointer hover:border-secondary/50 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200"
                        onClick={() => navigate("/ruleset")}
                        theme="base"
                        iconName="book"
                        iconVariant="secondary"
                    >
                        <CardHeader>
                            <CardTitle>Sääntökirja</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text/70">
                                Tutustu pelin sääntöihin ja maailmaan. Kattava ja helposti selattava opas kaikille pelaajille.
                            </p>
                        </CardContent>
                    </Card>

                    <Card
                        className="group cursor-pointer hover:border-accent/50 transition-all duration-300 hover:shadow-2xl hover:shadow-accent/10 animate-in fade-in slide-in-from-right-8 duration-700 delay-300"
                        onClick={() => navigate("/episodes")}
                        theme="base"
                        iconName="zap"
                        iconVariant="accent"
                    >
                        <CardHeader>
                            <CardTitle>Jaksot</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-text/70">
                                Seuraa meneillään olevia jaksoja ja tutki menneitä seikkailuja. Valmistaudu seuraavaan istuntoon.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </HeadingLevelContext.Provider>
        </div>
    );
}
