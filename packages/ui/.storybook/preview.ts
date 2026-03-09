import type { Preview } from "@storybook/react-vite";
import "../src/styles.css"; // Import the Tailwind styles we set up earlier

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
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
