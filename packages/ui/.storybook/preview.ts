import type { Preview } from "@storybook/react-vite";
import "./storybook.css"; // Import Tailwind styles + Storybook sources (including apps/ship stories)

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    options: {
      storySort: {
        method: "alphabetical",
        order: [
          "Suunnittelujarjestelma",
          ["Perustat", "Atomit", "Molekyylit", "Organismit", "Pelimekaniikka", "Konsoli", "Sivupohjat"],
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      options: {
        dark: {
          name: "dark",
          value: "#0a0a0c",
        },

        light: {
          name: "light",
          value: "#f8f9fa",
        },
      },
    },
  },

  initialGlobals: {
    backgrounds: {
      value: "dark",
    },
  },
};

export default preview;
