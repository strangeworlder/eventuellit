import type { Meta, StoryObj } from "@storybook/react";
import { CommentThread } from "./CommentThread";

const EXAMPLE_COMMENTS = [
  {
    id: 1,
    author: "Kaisa K.",
    anonymous: false,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    content: "Tämä on paras vaihtoehto — riskit ovat hallittavissa.",
  },
  {
    id: 2,
    author: "Nimetön",
    anonymous: true,
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    content: "Kannatan, mutta tarvitaan lisää tietoa kohteesta.",
  },
];

const meta: Meta<typeof CommentThread> = {
  title: "Suunnittelujarjestelma/Molekyylit/CommentThread",
  component: CommentThread,
  tags: ["autodocs"],
  argTypes: {
    allowNew: { control: "boolean" },
    defaultOpen: { control: "boolean" },
    isSubmitting: { control: "boolean" },
  },
  args: {
    onNewComment: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof CommentThread>;

export const Tyhja: Story = {
  name: "Tyhjä",
  args: {
    comments: [],
    allowNew: true,
    defaultOpen: true,
  },
};

export const KommenttejaTaynnna: Story = {
  name: "Kommentteja",
  args: {
    comments: EXAMPLE_COMMENTS,
    allowNew: true,
    defaultOpen: true,
  },
};

export const Suljettu: Story = {
  name: "Suljettu (ei uusia kommentteja)",
  args: {
    comments: EXAMPLE_COMMENTS,
    allowNew: false,
    defaultOpen: true,
  },
};

export const Lahettaa: Story = {
  name: "Lähettää...",
  args: {
    comments: EXAMPLE_COMMENTS,
    allowNew: true,
    isSubmitting: true,
    defaultOpen: true,
  },
};
