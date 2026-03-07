import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Heading } from "./Heading";
import { Text } from "./Text";
import { GameTerm } from "./GameTerm";
import { List, ListItem } from "./List";
import { Link } from "./Link";
import { cn } from "./Heading";

export interface MarkdownRendererProps {
    children: string;
    className?: string;
}

/**
 * A standardized Markdown renderer that maps Markdown elements 
 * to Design System components.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children, className }) => {
    return (
        <div className={cn("space-y-4", className)}>
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({ node, ...props }: any) => <Heading as="h1" variant="h1" className="mt-8 mb-4" {...props} />,
                    h2: ({ node, ...props }: any) => <Heading as="h2" variant="h2" className="mt-8 mb-4" {...props} />,
                    h3: ({ node, ...props }: any) => <Heading as="h3" variant="h3" className="mt-6 mb-3" {...props} />,
                    h4: ({ node, ...props }: any) => <Heading as="h4" variant="h4" className="mt-6 mb-3" {...props} />,
                    h5: ({ node, ...props }: any) => <Heading as="h5" variant="h5" className="mt-4 mb-2" {...props} />,
                    h6: ({ node, ...props }: any) => <Heading as="h6" variant="h6" className="mt-4 mb-2" {...props} />,
                    p: ({ node, ...props }: any) => <Text className="mb-4" {...props} />,
                    ul: ({ node, className, ...props }: any) => <List as="ul" className={className} {...props} />,
                    ol: ({ node, className, ...props }: any) => <List as="ol" className={className} {...props} />,
                    li: ({ node, className, ...props }: any) => <ListItem className={className} {...props} />,
                    a: ({ node, href, children, ...props }: any) => {
                        const isExternal = href?.startsWith("http");
                        return <Link href={href} external={isExternal} {...props}>{children}</Link>;
                    },
                    pre: ({ node, className, children, ...props }: any) => (
                        <pre className="bg-black/50 p-4 rounded-md overflow-x-auto text-sm my-4 border border-white/10" {...props}>
                            {children}
                        </pre>
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                        const isBlock = /language-(\w+)/.exec(className || '');
                        if (isBlock) {
                            return <code className={className} {...props}>{children}</code>;
                        }
                        return <GameTerm variant="accent" className={className} {...props}>{children}</GameTerm>;
                    },
                    strong: ({ node, className, ...props }: any) => (
                        <GameTerm variant="primary" className={className} {...props} />
                    ),
                    em: ({ node, ...props }: any) => (
                        <em className="italic opacity-90" {...props} />
                    ),
                    blockquote: ({ node, ...props }: any) => (
                        <blockquote className="border-l-4 border-[var(--theme-accent)] pl-4 italic opacity-80 my-4" {...props} />
                    ),
                }}
            >
                {children}
            </ReactMarkdown>
        </div>
    );
};
