import type { Meta, StoryObj } from "@storybook/react";
import { MarkdownRenderer } from "./Markdown";

const meta = {
    title: "Components/MarkdownRenderer",
    component: MarkdownRenderer,
    parameters: {
        layout: "padded",
    },
    tags: ["autodocs"],
} satisfies Meta<typeof MarkdownRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleMarkdown = `
# Markdown Renderer Test

This is a paragraph of ordinary text demonstrating how the \`MarkdownRenderer\` maps standard markdown to the **Design System**. Notice how the bold text utilizes the proper typography weight, and how *italic* text is appropriately styled.

## Headings and Sections

Here is an \`inline_code_snippet\` which maps to the GameTerm component. By default, it uses the accent variant.

### Lists and Links

Let's look at an unordered list:
- First item
- Second item
  - Inner items also work if supported by the list component structure natively, though nested lists might look basic here.
- Third item, containing a [link to example.com](https://example.com)

And an ordered list:
1. One step
2. Two step
3. Three step

> Blockquotes are also supported, giving a nice stylized border treatment on the left edge.
`;

export const Default: Story = {
    args: {
        children: sampleMarkdown,
    },
};
