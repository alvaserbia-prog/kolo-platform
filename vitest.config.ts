import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  test: {
    // Podrazumevano node; pojedinačni komponentni testovi biraju jsdom preko
    // `// @vitest-environment jsdom` na vrhu fajla.
    environment: "node",
    include: ["__tests__/**/*.test.ts", "__tests__/**/*.test.tsx"],
  },
});
