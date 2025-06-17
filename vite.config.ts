/// <reference types="vitest" />
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: env.VITE_BASE_URL || "/",
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
        provider: "istanbul", // or 'v8',
        reporter: ["text", "json", "html"],
      },
      exclude: [
        "node_modules/**",
        "src/components/ui/**",
        "vite.config.ts",
        ".eslintrc.js",
        "src/features/reKYC/mocks/**",
        "src/constants/**",
      ],
    },
  };
});
