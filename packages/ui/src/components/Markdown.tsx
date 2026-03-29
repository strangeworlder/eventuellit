import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  extractH3SectionsFromMarkdown,
  normalizeHeadingLabel,
  slugifyHeadingLabel,
} from "./article-navigation-utils";
import { GameTerm } from "./GameTerm";
import { cn } from "./utils";
import { Heading } from "./Heading";
import { Link } from "./Link";
import { List, ListItem } from "./List";
import { Text } from "./Text";

export interface MarkdownRendererProps extends React.HTMLAttributes<HTMLDivElement> {
  children: string;
  headingIdPrefix?: string;
}

/**
 * A standardized Markdown renderer that maps Markdown elements
 * to Design System components (Heading, Text, List, Link, GameTerm, etc.).
 * Use for user-generated or CMS-authored content strings.
 *
 * @summary renders a markdown string using design system components; supports GFM tables and links
 */
function getNodeText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getNodeText).join(" ");
  }

  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getNodeText(node.props.children ?? "");
  }

  return "";
}

export const MarkdownRenderer = React.forwardRef<HTMLDivElement, MarkdownRendererProps>(
  function MarkdownRenderer({ children, className, headingIdPrefix, ...props }, ref) {
    // Pre-compute h3 heading IDs from raw markdown so the result is stable
    // across React strict-mode double-renders (no mutable map during render).
    const headingIdByLabel = useMemo(() => {
      const sections = extractH3SectionsFromMarkdown(children, headingIdPrefix);
      const map = new Map<string, string>();
      for (const s of sections) {
        if (!map.has(s.label)) map.set(s.label, s.id);
      }
      return map;
    }, [children, headingIdPrefix]);

    return (
      <div ref={ref} className={cn("space-y-4", className)} {...props}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ref, ...props }) => (
              <Heading as="h1" variant="h1" className="mt-8 mb-4" {...props} />
            ),
            h2: ({ node, ref, ...props }) => (
              <Heading as="h2" variant="h2" className="mt-8 mb-4" {...props} />
            ),
            h3: ({ node, id, children: headingChildren, ref, ...props }) => {
              const headingLabel = normalizeHeadingLabel(getNodeText(headingChildren));
              const headingId =
                typeof id === "string" && id.length > 0
                  ? id
                  : (headingIdByLabel.get(headingLabel) ??
                    (headingIdPrefix
                      ? `${headingIdPrefix}-${slugifyHeadingLabel(headingLabel)}`
                      : slugifyHeadingLabel(headingLabel)));

              return (
                <Heading
                  as="h3"
                  variant="h3"
                  id={headingId}
                  className="mt-6 mb-3 scroll-mt-24"
                  {...props}
                >
                  {headingChildren}
                </Heading>
              );
            },
            h4: ({ node, ref, ...props }) => (
              <Heading as="h4" variant="h4" className="mt-6 mb-3" {...props} />
            ),
            h5: ({ node, ref, ...props }) => (
              <Heading as="h5" variant="h5" className="mt-4 mb-2" {...props} />
            ),
            h6: ({ node, ref, ...props }) => (
              <Heading as="h6" variant="h6" className="mt-4 mb-2" {...props} />
            ),
            p: ({ node, ref, ...props }) => <Text className="mb-4" {...props} />,
            ul: ({ node, className, ref, ...props }) => (
              <List as="ul" className={className} {...props} />
            ),
            ol: ({ node, className, ref, ...props }) => (
              <List as="ol" className={className} {...props} />
            ),
            li: ({ node, className, ref, ...props }) => (
              <ListItem className={className} {...props} />
            ),
            a: ({ node, href, children, ref, ...props }) => {
              const isExternal = href?.startsWith("http");
              return (
                <Link href={href} external={isExternal} {...props}>
                  {children}
                </Link>
              );
            },
            pre: ({ node, className, children, ref, ...props }) => (
              <pre
                className="bg-[var(--theme-bg)]/80 p-4 rounded-md overflow-x-auto text-sm my-4 border border-[var(--theme-secondary)]/10"
                {...props}
              >
                {children}
              </pre>
            ),
            code: ({ node, className, children, ref, ...props }) => {
              const isBlock = /language-(\w+)/.exec(className || "");
              if (isBlock) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              }
              return (
                <GameTerm variant="emphasis" className={className} {...props}>
                  {children}
                </GameTerm>
              );
            },
            strong: ({ node, className, ref, ...props }) => (
              <GameTerm variant="accent" className={className} {...props} />
            ),
            em: ({ node, ref, ...props }) => <em className="italic" {...props} />,
            blockquote: ({ node, ref, ...props }) => (
              <blockquote
                className="border-l-4 border-[var(--theme-accent)] pl-4 italic text-text-muted my-4"
                {...props}
              />
            ),
          }}
        >
          {children}
        </ReactMarkdown>
      </div>
    );
  },
);
MarkdownRenderer.displayName = "MarkdownRenderer";
