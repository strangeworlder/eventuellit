import { Heading, HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement, type ImageSource } from "@repo/ui/components/ImageElement";
import { Link } from "@repo/ui/components/Link";
import { Page } from "@repo/ui/components/Page";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Tabs, TabsList, TabsLink } from "@repo/ui/components/Tabs";
import { Badge } from "@repo/ui/components/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/components/Card";
import { useEffect, useState } from "react";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { List, ListItem } from "@repo/ui/components/List";

// Lightweight frontmatter parser
function parseFrontmatter(md: string) {
    const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
    const data: Record<string, any> = {};
    let content = md;

    if (match) {
        const frontmatter = match[1];
        content = md.slice(match[0].length);

        const lines = frontmatter.split(/\r?\n/);
        let currentKey: string | null = null;
        let isBlock = false;
        let blockLines: string[] = [];

        for (const line of lines) {
            const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);

            // If we find what looks like a new key, and we're not currently in a block
            // OR we are in a block but this line isn't indented (meaning the block ended)
            if (topLevelMatch && (!isBlock || (line.trim() !== "" && !line.startsWith("  ") && !line.startsWith("\t")))) {
                // If we were in a block, save it before starting the new key
                if (isBlock && currentKey) {
                    data[currentKey] = blockLines.join("\n").trim();
                    isBlock = false;
                    blockLines = [];
                }

                const key = topLevelMatch[1];
                const rest = topLevelMatch[2].trim();

                if (rest === "|") {
                    currentKey = key;
                    isBlock = true;
                    blockLines = [];
                } else {
                    currentKey = key;
                    let value = rest;
                    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
                        value = value.slice(1, -1);
                    }
                    if (!isNaN(Number(value)) && value !== "") {
                        data[key] = Number(value);
                    } else {
                        data[key] = value;
                    }
                }
            } else if (isBlock) {
                // We are in a block, just accumulate lines and strip leading spaces (up to 2)
                blockLines.push(line.replace(/^ {0,2}/, ""));
            }
        }

        // Finalize last block if exists
        if (isBlock && currentKey) {
            data[currentKey] = blockLines.join("\n").trim();
        }
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
    image?: string;
    imageAlt?: string;
}

interface ImageVariant {
    width: number;
    avif: string;
    webp: string;
    jpg: string;
}

interface ManifestImageEntry {
    width: number;
    height: number;
    placeholder: string;
    variants: ImageVariant[];
}

type ImageManifest = Record<string, ManifestImageEntry>;

const remoteOrigin = new URL(import.meta.url).origin;
const manifestUrl = `${remoteOrigin}/images/manifest.json`;

function resolveRemoteAssetUrl(assetPath: string) {
    if (assetPath.startsWith("http://") || assetPath.startsWith("https://") || assetPath.startsWith("data:")) {
        return assetPath;
    }

    const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
    return `${remoteOrigin}${normalizedPath}`;
}

function buildImageSources(variants: ImageVariant[]): ImageSource[] {
    const sorted = [...variants].sort((a, b) => a.width - b.width);
    const avifSrcSet = sorted.map((variant) => `${resolveRemoteAssetUrl(variant.avif)} ${variant.width}w`).join(", ");
    const webpSrcSet = sorted.map((variant) => `${resolveRemoteAssetUrl(variant.webp)} ${variant.width}w`).join(", ");

    return [
        { type: "image/avif", srcSet: avifSrcSet },
        { type: "image/webp", srcSet: webpSrcSet },
    ];
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
        image: data.image,
        imageAlt: data.imageAlt,
    };
}).sort((a, b) => a.order - b.order);

function EpisodeDetails({ episode, imageManifest }: { episode: EpisodePage; imageManifest: ImageManifest }) {
    const imageEntry = episode.image ? imageManifest[episode.image] : undefined;
    const sortedVariants = imageEntry ? [...imageEntry.variants].sort((a, b) => a.width - b.width) : [];
    const largestJpg = sortedVariants.length > 0
        ? resolveRemoteAssetUrl(sortedVariants[sortedVariants.length - 1].jpg)
        : undefined;
    const imageSources = imageEntry ? buildImageSources(imageEntry.variants) : undefined;

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

                <div className="grid grid-cols-1 desktop:grid-cols-[2fr_1fr] gap-8 px-4 tablet:pr-8 tablet:pl-0">
                    <div className="space-y-6">
                        <HeadingLevelProvider>
                            <MarkdownRenderer>{episode.content}</MarkdownRenderer>
                        </HeadingLevelProvider>
                    </div>
                    <div className="space-y-8 pt-6">
                        {imageEntry && largestJpg && (
                            <ImageElement
                                src={largestJpg}
                                sources={imageSources}
                                sizes="(max-width: 1024px) 100vw, 24rem"
                                width={imageEntry.width}
                                height={imageEntry.height}
                                alt={episode.imageAlt || episode.title}
                                placeholderSrc={imageEntry.placeholder}
                                variant="secondary"
                            />
                        )}

                        <div className="space-y-4">
                            <Card variant="secondary" className="gap-2">
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
                                                <List variant="unbulleted">
                                                    {episode.sessionDates.split(',').map((dateStr, index) => {
                                                        const date = new Date(dateStr.trim());
                                                        const formattedDate = isNaN(date.getTime())
                                                            ? dateStr.trim()
                                                            : date.toLocaleDateString('fi-FI');
                                                        return (
                                                            <ListItem key={index}>{formattedDate}</ListItem>
                                                        );
                                                    })}
                                                </List>
                                            </>
                                        )}
                                        {episode.location && (
                                            <>
                                                <Heading>Sijainti</Heading>
                                                <Link
                                                    href={episode.locationLink || "#"}
                                                    external={Boolean(episode.locationLink)}
                                                >
                                                    {episode.location}
                                                </Link>
                                            </>
                                        )}
                                    </HeadingLevelProvider>
                                </CardContent>
                            </Card>
                        </div>

                        {episode.mechanicalAdditions && (
                            <div className="desktop:col-span-1 space-y-4">
                                <Card iconName="zap">
                                    <CardHeader>
                                        <CardTitle>Mekaaniset Lisäykset</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-0 tablet:pt-0">
                                        <MarkdownRenderer>{episode.mechanicalAdditions}</MarkdownRenderer>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                </div>
            </HeadingLevelProvider>
        </div>
    );
}

function App() {
    const { pathname } = useLocation();
    const [imageManifest, setImageManifest] = useState<ImageManifest>({});

    const getBasePath = () => {
        const segments = pathname.split('/').filter(Boolean);
        if (segments.length === 0) return '/';
        if (episodes.some(p => p.id === segments[0])) return '/';
        return `/${segments[0]}`;
    };

    const basePath = getBasePath();
    const defaultPath = episodes.length > 0 ? episodes[0].id : "";

    useEffect(() => {
        let cancelled = false;

        fetch(manifestUrl)
            .then((response) => (response.ok ? response.json() : {}))
            .then((manifest: ImageManifest) => {
                if (!cancelled) {
                    setImageManifest(manifest);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setImageManifest({});
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

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
                                    element={<EpisodeDetails episode={episode} imageManifest={imageManifest} />}
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
