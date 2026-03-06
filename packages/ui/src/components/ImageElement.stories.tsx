import type { Meta, StoryObj } from "@storybook/react-vite";
import { ImageElement } from "./ImageElement";

const placeholder =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoICAkLCgoLDhgQDg0NDh0VFhEYIB8iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQ0NDw0NDisZFRkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAH4AfgMBIgACEQEDEQH/xAAXAAADAQAAAAAAAAAAAAAAAAABAgME/8QAHhABAQEAAgIDAQAAAAAAAAAAAQIDABEhMQQSIkH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABcRAQEBAQAAAAAAAAAAAAAAAAEAESH/2gAMAwEAAhEDEQA/ALxJ8fQxqzKxKObK5YjN6Mmy3ee5mVQm0kW1bbkFqQ4fW9qJCVFQ8Dk7WjYx6H4WGNqelV8O8s7kWQ4DscQhHn4Q5f2dU8jGzT5rU1qVhG9r3vE0xqf4rY3J7x4q+R2k0V0H2sWH3QJX1Nw0xR0wqef/2Q==";

const meta = {
  title: "Suunnittelujarjestelma/Komponentit/ImageElement",
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
    variant: "secondary",
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
    variant: "primary",
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
    variant: "accent",
  },
  parameters: {
    layout: "padded",
  },
};
