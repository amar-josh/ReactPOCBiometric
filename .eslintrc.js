module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "simple-import-sort", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "prettier",
  ],
  rules: {
    "prettier/prettier": ["error"],
    // Simple Import Sort Rules
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    // Optional: turn off conflicting rules
    "import/order": "off",
    "sort-imports": "off",
  },
};
