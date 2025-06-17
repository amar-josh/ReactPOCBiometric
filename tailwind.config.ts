// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      backgroundImage: {
        radial: "radial-gradient(ellipse at center, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // already part of your setup
  ],
};
