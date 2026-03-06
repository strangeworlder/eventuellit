import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Page } from "@repo/ui/components/Page";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Tabs, TabsList, TabsLink } from "@repo/ui/components/Tabs";
import { Badge } from "@repo/ui/components/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/components/Card";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Lightweight frontmatter parser
function parseFrontmatter(md: string) {
    const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    const data: Record<string, any> = {};
    let content = md;
    if (match) {
        const frontmatter = match[1];
        content = md.slice(match[0].length);
        frontmatter.split(/\r?\n/).forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex !== -1) {
                const key = line.slice(0, colonIndex).trim();
                let value = line.slice(colonIndex + 1).trim();
                if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                    value = value.slice(1, -1);
                }
                if (!isNaN(Number(value)) && value !== '') {
                    data[key] = Number(value);
                } else {
                    data[key] = value;
                }
            }
        });
    }
    return { data, content };
}

const modules = import.meta.glob("./content/**/*.md", { eager: true, query: "?raw", import: "default" });

interface EpisodePage {
    id: string;
    title: string;
    order: number;
    content: string;
    description?: string;
    status: 'active' | 'completed' | 'planned';
    players?: string;
    sessionDates?: string;
    location?: string;
    locationLink?: string;
    mechanicalAdditions?: string;
}

const episodes: EpisodePage[] = Object.entries(modules).map(([path, rawMdx]) => {
    const rawString = typeof rawMdx === "string" ? rawMdx : "";
    const { data, content } = parseFrontmatter(rawString);

    const filename = path.split("/").pop()?.replace(".md", "") || "unknown";

    return {
        id: filename.toLowerCase(),
        title: data.title || filename,
        order: data.order || 99,
        description: data.description || "",
        content: content,
        status: data.status || 'planned',
        players: data.players,
        sessionDates: data.sessionDates,
        location: data.location,
        locationLink: data.locationLink,
        mechanicalAdditions: data.mechanicalAdditions,
    };
}).sort((a, b) => a.order - b.order);

function EpisodeDetails({ episode }: { episode: EpisodePage }) {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <HeadingLevelProvider>
                <Hero
                    title={episode.title}
                    description={episode.description}
                >
                    <div className="flex gap-2 mt-4">
                        {episode.status === 'active' && <Badge variant="primary" icon="sparkles">Aktiivinen Jakso</Badge>}
                        {episode.status === 'completed' && <Badge variant="secondary">Arkistoitu</Badge>}
                        {episode.status === 'planned' && <Badge variant="outline">Tulossa</Badge>}
                    </div>
                </Hero>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4">
                    <div className="lg:col-span-2 space-y-10">
                        <Card>
                            <CardHeader>
                                <CardTitle>Synopsis & Tapahtumat</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MarkdownRenderer>{episode.content}</MarkdownRenderer>
                            </CardContent>
                        </Card>

                        {episode.mechanicalAdditions && (
                            <Card theme="secondary-light" iconName="zap">
                                <CardHeader>
                                    <CardTitle>Mekaaniset Lisäykset</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <MarkdownRenderer>{episode.mechanicalAdditions}</MarkdownRenderer>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="space-y-6">
                        <Card variant="secondary">
                            <CardHeader>
                                <CardTitle>Tiedot</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <HeadingLevelProvider>
                                    {episode.players && (
                                        <>
                                            <Heading>Pelaajat</Heading>
                                            <p>{episode.players}</p>
                                        </>
                                    )}
                                    {episode.sessionDates && (
                                        <>
                                            <Heading>Sessiot</Heading>
                                            <p>{episode.sessionDates}</p>
                                        </>
                                    )}
                                    {episode.location && (
                                        <>
                                            <Heading>Sijainti</Heading>
                                            <a
                                                href={episode.locationLink || "#"}
                                            >
                                                {episode.location}
                                            </a>
                                        </>
                                    )}
                                </HeadingLevelProvider>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </HeadingLevelProvider>
        </div>
    );
}

function App() {
    const { pathname } = useLocation();

    const getBasePath = () => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length === 0) return '/';
        if (episodes.some(p => p.id === segments[0])) return '/';
        return `/${segments[0]}`;
    };

    const basePath = getBasePath();
    const defaultPath = episodes.length > 0 ? episodes[0].id : "";

    return (
        <Page>
            {episodes.length > 0 && (
                <Tabs>
                    <TabsList>
                        {episodes.map((episode) => (
                            <TabsLink
                                key={episode.id}
                                to={basePath === '/' ? `/${episode.id}` : `${basePath}/${episode.id}`}
                            >
                                #{episode.order}: {episode.title}
                            </TabsLink>
                        ))}
                    </TabsList>

                    <div>
                        <Routes>
                            <Route path="/" element={<Navigate to={defaultPath} replace />} />
                            {episodes.map((episode) => (
                                <Route
                                    key={episode.id}
                                    path={episode.id}
                                    element={<EpisodeDetails episode={episode} />}
                                />
                            ))}
                        </Routes>
                    </div>
                </Tabs>
            )}
            {episodes.length === 0 && (
                <div className="flex items-center justify-center min-h-[50vh]">
                    <p className="text-text/40 italic">Ei jaksoja löydetty.</p>
                </div>
            )}
        </Page>
    );
}

export default App;
