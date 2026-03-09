import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { ImageElement } from "@repo/ui/components/ImageElement";
import { Page } from "@repo/ui/components/Page";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { Tabs, TabsList, TabsLink } from "@repo/ui/components/Tabs";

import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Lightweight frontmatter parser to avoid Node 'Buffer' dependency from gray-matter in the browser
function parseFrontmatter(md: string) {
  const match = md.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  const data: Record<string, unknown> = {};
  let content = md;
  let frontmatter = "";

  if (match) {
    frontmatter = match[1];
    content = md.slice(match[0].length);

    const lines = frontmatter.split(/\r?\n/);
    let currentKey: string | null = null;
    let isBlock = false;
    let blockLines: string[] = [];

    for (const line of lines) {
      const topLevelMatch = line.match(/^([a-zA-Z0-9_-]+):\s*(.*)$/);

      if (topLevelMatch && (!isBlock || (line.trim() !== "" && !line.startsWith("  ") && !line.startsWith("\t")))) {
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
        blockLines.push(line.replace(/^ {0,2}/, ""));
      }
    }

    if (isBlock && currentKey) {
      data[currentKey] = blockLines.join("\n").trim();
    }
  }
  return { data, content, frontmatter };
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function removeOptionalQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseImagesFromFrontmatter(frontmatter: string): string[] {
  const imagesMatch = frontmatter.match(/(?:^|\r?\n)images:\s*\r?\n((?:[ \t]*-\s*.+\r?\n?)*)/);
  if (!imagesMatch) {
    return [];
  }

  return imagesMatch[1]
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s*(.+)\s*$/)?.[1] ?? "")
    .map(removeOptionalQuotes)
    .filter((value) => value.length > 0);
}

function splitByMajorSections(content: string): string[] {
  const lines = content.split(/\r?\n/);
  const sections: string[] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.startsWith("### ") && current.length > 0) {
      sections.push(current.join("\n").trim());
      current = [line];
      continue;
    }
    current.push(line);
  }

  if (current.length > 0) {
    sections.push(current.join("\n").trim());
  }

  return sections.filter((section) => section.length > 0);
}

// Dynamically import all markdown files in the content directory and subdirectories
const modules = import.meta.glob("./content/**/*.md", { eager: true, query: "?raw", import: "default" });

interface MarkdownPage {
  id: string;
  title: string;
  order: number;
  content: string;
  description?: string;
  images: string[];
}

const remoteOrigin = new URL(import.meta.url).origin;

function resolveRemoteAssetUrl(assetPath: string) {
  if (assetPath.startsWith("http://") || assetPath.startsWith("https://") || assetPath.startsWith("data:")) {
    return assetPath;
  }

  const normalizedPath = assetPath.startsWith("/") ? assetPath : `/${assetPath}`;
  return `${remoteOrigin}${normalizedPath}`;
}

const pages: MarkdownPage[] = Object.entries(modules).map(([path, rawMdx]) => {
  const rawString = typeof rawMdx === "string" ? rawMdx : "";
  const { data, content, frontmatter } = parseFrontmatter(rawString);

  // Fallback ID from filename
  const filename = path.split("/").pop()?.replace(".md", "") || "unknown";

  const legacyImage = asString(data.image);
  const images = parseImagesFromFrontmatter(frontmatter);
  const resolvedImages =
    images.length > 0 ? images : legacyImage ? [legacyImage] : [];

  return {
    id: filename.toLowerCase(),
    title: asString(data.title) || filename,
    order: asNumber(data.order) || 99,
    description: asString(data.description) || "",
    content: content,
    images: resolvedImages,
  };
}).sort((a, b) => a.order - b.order);

function App() {
  const { pathname } = useLocation();

  const defaultPath = pages.length > 0 ? pages[0].id : "";

  // Dynamically determine the correct base path for absolute routing to avoid nesting issues
  const getBasePath = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 0) return '/';
    // If the first segment exactly matches a page ID, it means we are mounted at the root
    if (pages.some(p => p.id === segments[0])) return '/';
    // Otherwise, use the first segment as the mount point (e.g. "/ruleset")
    return `/${segments[0]}`;
  };

  const basePath = getBasePath();

  return (
    <Page>
      {pages.length > 0 && (
        <Tabs>
          <TabsList>
            {pages.map((page) => (
              <TabsLink
                key={page.id}
                to={basePath === '/' ? `/${page.id}` : `${basePath}/${page.id}`}
              >
                {page.title}
              </TabsLink>
            ))}
          </TabsList>

          <div className="animate-in fade-in duration-300">
            <Routes>
              <Route path="/" element={<Navigate to={defaultPath} replace />} />
              {pages.map((page) => {
                const heroImage = page.images[0];
                const inContentImages = page.images.slice(1);
                const sections = splitByMajorSections(page.content);

                return (
                  <Route
                    key={page.id}
                    path={page.id}
                    element={(
                      <HeadingLevelProvider>
                        <Hero
                          title={page.title}
                          description={page.description}
                          backgroundImageSrc={heroImage ? resolveRemoteAssetUrl(heroImage) : undefined}
                        />
                        <div className="layout-stack">
                          <HeadingLevelProvider>
                            <div className="space-y-8">
                              {sections.map((section, index) => {
                                const imagePath = inContentImages[index];
                                const imageUrl = imagePath ? resolveRemoteAssetUrl(imagePath) : undefined;

                                return (
                                  <div key={`${page.id}-section-${index}`} className="space-y-6">
                                    <MarkdownRenderer>{section}</MarkdownRenderer>
                                    {imageUrl && (
                                      <ImageElement
                                        src={imageUrl}
                                        alt={`${page.title} kuvitus ${index + 2}`}
                                        variant="secondary"
                                        className="w-full max-w-2xl mx-auto"
                                        imgClassName="max-h-[24rem]"
                                      />
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </HeadingLevelProvider>
                        </div>
                      </HeadingLevelProvider>
                    )}
                  />
                );
              })}
            </Routes>
          </div>
        </Tabs>
      )}
    </Page>
  );
}

export default App;
