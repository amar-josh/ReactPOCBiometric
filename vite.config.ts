/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8", // or 'v8',
      reporter: ["text", "json", "html"],
      exclude: [
        "dist/**",
        "**/constants.ts",
        "tailwind.config.ts",
        "node_modules/**",
        "tailwind.config.ts",
        "vite.config.ts",
        "eslint.config.js",
        ".eslintrc.js",
        "src/constants/**",
        "src/features/re-kyc/mocks/**",
        "src/components/ui",
        "src/vite-env.d.ts",
        "src/i18n/translations/*",
        "src/i18n/translator.tsx",
        "**/types.ts",
      ],
    },
  },
});
