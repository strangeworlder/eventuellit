import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  {
    test: {
      globals: true,
      name: "apps",
      include: ["apps/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    },
  },
  {
    test: {
      globals: true,
      name: "packages",
      include: ["packages/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
    },
  },
]);
