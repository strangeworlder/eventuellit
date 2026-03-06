import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      "apps/**/*.{test,spec}.?(c|m)[jt]s?(x)",
      "packages/**/*.{test,spec}.?(c|m)[jt]s?(x)",
    ],
  },
});
