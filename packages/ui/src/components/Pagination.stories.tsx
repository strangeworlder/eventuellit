import type { Meta, StoryObj } from "@storybook/react";
import type React from "react";
import { useState } from "react";
import { Pagination } from "./Pagination";

const meta = {
  title: "Suunnittelujarjestelma/Molekyylit/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

function ControlledPagination(args: React.ComponentProps<typeof Pagination>) {
  const [page, setPage] = useState(args.currentPage);
  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination {...args} currentPage={page} onPageChange={setPage} />
      <p className="text-[var(--theme-text-muted)] text-sm font-sans">
        Sivu {page} / {args.totalPages}
      </p>
    </div>
  );
}

export const Oletus: Story = {
  name: "Oletus (5 sivua)",
  render: (args) => <ControlledPagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 5,
    onPageChange: () => {},
  },
};

export const PaljonSivuja: Story = {
  name: "Paljon sivuja (pisteet näkyvissä)",
  render: (args) => <ControlledPagination {...args} />,
  args: {
    currentPage: 8,
    totalPages: 20,
    onPageChange: () => {},
  },
};

export const YksiSivu: Story = {
  name: "Yksi sivu (painikkeet poistettu käytöstä)",
  render: (args) => <ControlledPagination {...args} />,
  args: {
    currentPage: 1,
    totalPages: 1,
    onPageChange: () => {},
  },
};

export const ViimeinenSivu: Story = {
  name: "Viimeinen sivu",
  render: (args) => <ControlledPagination {...args} />,
  args: {
    currentPage: 10,
    totalPages: 10,
    onPageChange: () => {},
  },
};
