import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createUniqueHeadingId, normalizeHeadingLabel } from "./article-navigation-utils";
import { GameTerm } from "./GameTerm";
import { cn, Heading } from "./Heading";
import { Link } from "./Link";
import { List, ListItem } from "./List";
import { Text } from "./Text";

export interface MarkdownRendererProps {
  children: string;
  className?: string;
  headingIdPrefix?: string;
}

/**
 * A standardized Markdown renderer that maps Markdown elements
 * to Design System components.
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

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  children,
  className,
  headingIdPrefix,
}) => {
  const headingUsageMap = new Map<string, number>();

  return (
    <div className={cn("space-y-4", className)}>
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
                : createUniqueHeadingId(headingLabel, headingUsageMap, headingIdPrefix);

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
          li: ({ node, className, ref, ...props }) => <ListItem className={className} {...props} />,
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
              className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm my-4 border border-white/10"
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
              <GameTerm variant="primary" className={className} {...props}>
                {children}
              </GameTerm>
            );
          },
          strong: ({ node, className, ref, ...props }) => (
            <GameTerm variant="accent" className={className} {...props} />
          ),
          em: ({ node, ref, ...props }) => <em className="italic opacity-90" {...props} />,
          blockquote: ({ node, ref, ...props }) => (
            <blockquote
              className="border-l-4 border-[var(--theme-accent)] pl-4 italic opacity-80 my-4"
              {...props}
            />
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
};
