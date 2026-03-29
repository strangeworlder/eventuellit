import type { Meta, StoryObj } from "@storybook/react-vite";
import React from "react";
import { ImageElement } from "./ImageElement";

const placeholder =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAkLCgoLDhgQDg0NDh0VFhEYIB8iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQ0NDw0NDisZFRkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAH4AfgMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAABAgME/8QAHhABAQEAAgIDAQAAAAAAAAAAAQIDABEhMQQSIkH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABcRAQEBAQAAAAAAAAAAAAAAAAEAESH/2gAMAwEAAhEDEQA/ALxJ8fQxqzKxKObK5YjN6Mmy3ee5mVQm0kW1bbkFqQ4fW9qJCVFQ8Dk7WjYx6H4WGNqelV8O8s7kWQ4DscQhHn4Q5f2dU8jGzT5rU1qVhG9r3vE0xqf4rY3J7x4q+R2k0V0H2sWH3QJX1Nw0xR0wqef/2Q==";

const meta = {
  title: "Suunnittelujarjestelma/Atomit/ImageElement",
  component: ImageElement,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ImageElement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Oletus: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=80",
    alt: "Avaruusnäkymä",
    width: 600,
    height: 380,
    className: "w-80",
    caption: "Kuvan kuvateksti",
    placeholderSrc: placeholder,
    variant: "outline",
  },
};

export const Primaarinen: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    alt: "Pilvipeitteinen horisontti",
    width: 480,
    height: 320,
    className: "w-72",
    caption: "Ensisijainen korostus",
    placeholderSrc: placeholder,
    variant: "surface",
  },
};

export const Korostus: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=900&q=80",
    alt: "Maski varjoissa",
    width: 480,
    height: 480,
    className: "w-72",
    caption: "Korostettu elementti",
    placeholderSrc: placeholder,
    variant: "highlight",
  },
  parameters: {
    layout: "padded",
  },
};

export const Pikkukuva: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=600&q=80",
    alt: "Avaruusnakyma pikkukuvana",
    width: 64,
    height: 64,
    className: "w-14 h-14",
    placeholderSrc: placeholder,
    variant: "thumbnail",
  },
  parameters: {
    layout: "centered",
  },
};

export const Sisaltokuva: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=900&q=80",
    alt: "Avaruusnäkymä tekstin sisällä",
    width: 900,
    height: 500,
    className: "w-full max-w-prose",
    caption: "Sisältökuva — ei avaa modaalia",
    placeholderSrc: placeholder,
    variant: "inline",
  },
  parameters: {
    layout: "padded",
  },
};

export const ModaaliKuva: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=600&q=80",
    alt: "Modaalikuva",
  },
  render: () => (
    <div className="flex flex-col gap-6 items-center max-w-sm">
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-text-subtle">
          enableModal — oletus (false)
        </p>
        <ImageElement
          src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=600&q=80"
          alt="Modaali pois käytöstä"
          width={480}
          height={320}
          className="w-64"
          placeholderSrc={placeholder}
          variant="outline"
          enableModal={false}
        />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-black uppercase tracking-widest text-text-subtle">
          enableModal — päällä (true)
        </p>
        <ImageElement
          src="https://images.unsplash.com/photo-1543722530-d2c3201371e7?auto=format&fit=crop&w=600&q=80"
          alt="Napsauta avataksesi suurennoksen"
          width={480}
          height={320}
          className="w-64"
          caption="Napsauta kuvaa avataksesi suurennoksen"
          placeholderSrc={placeholder}
          variant="outline"
          enableModal
        />
      </div>
    </div>
  ),
  parameters: {
    layout: "centered",
  },
};
