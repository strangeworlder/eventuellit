import { HeadingLevelProvider } from "@repo/ui/components/Heading";
import { Hero } from "@repo/ui/components/Hero";
import { Page } from "@repo/ui/components/Page";
import { MarkdownRenderer } from "@repo/ui/components/Markdown";
import { cn } from "@repo/ui/components/Button";

import { Routes, Route, Navigate, NavLink, useLocation } from "react-router-dom";

// Lightweight frontmatter parser to avoid Node 'Buffer' dependency from gray-matter in the browser
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

// Dynamically import all markdown files in the content directory and subdirectories
const modules = import.meta.glob("./content/**/*.md", { eager: true, query: "?raw", import: "default" });

interface MarkdownPage {
  id: string;
  title: string;
  order: number;
  content: string;
  description?: string;
}

const pages: MarkdownPage[] = Object.entries(modules).map(([path, rawMdx]) => {
  const rawString = typeof rawMdx === "string" ? rawMdx : "";
  const { data, content } = parseFrontmatter(rawString);

  // Fallback ID from filename
  const filename = path.split("/").pop()?.replace(".md", "") || "unknown";

  return {
    id: filename.toLowerCase(),
    title: data.title || filename,
    order: data.order || 99,
    description: data.description || "",
    content: content,
  };
}).sort((a, b) => a.order - b.order);

function App() {
  const { pathname } = useLocation();

  const tabClass = (isActive: boolean) => cn(
    "relative cursor-pointer inline-flex items-center justify-center whitespace-nowrap px-6 py-3 text-sm sm:text-base font-bold uppercase tracking-widest transition-all",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)]",
    "disabled:pointer-events-none disabled:opacity-50",
    "rounded-t-md",
    "mb-[-2px]", // Overlap the bottom border of the list
    isActive
      ? "bg-[var(--theme-bg)] text-[var(--theme-primary)] z-10 border-2 border-b-[var(--theme-text)] font-bold"
      : "border-2 border-transparent bg-transparent text-[var(--theme-text)] hover:bg-[var(--theme-primary)]/15 hover:text-[var(--theme-text)] font-semibold"
  );

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
        <>
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="flex flex-wrap items-end border-b-2 border-[var(--theme-primary)] gap-1 px-4 sm:px-0"
          >
            {pages.map((page) => (
              <NavLink
                key={page.id}
                to={basePath === '/' ? `/${page.id}` : `${basePath}/${page.id}`}
                className={({ isActive }) => tabClass(isActive)}
              >
                {page.title}
              </NavLink>
            ))}
          </div>

          <div className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-secondary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-bg)] animate-in fade-in duration-300 pt-4">
            <Routes>
              <Route path="/" element={<Navigate to={defaultPath} replace />} />
              {pages.map((page) => (
                <Route key={page.id} path={page.id} element={
                  <HeadingLevelProvider>
                    <Hero
                      title={page.title}
                      description={page.description}
                    />
                    <div className="space-y-10">
                      <HeadingLevelProvider>
                        <MarkdownRenderer>
                          {page.content}
                        </MarkdownRenderer>
                      </HeadingLevelProvider>
                    </div>
                  </HeadingLevelProvider>
                } />
              ))}
            </Routes>
          </div>
        </>
      )}
    </Page>
  );
}

export default App;
