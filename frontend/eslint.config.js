import globals from "globals";

export default [
  {
    ignores: ["dist", "node_modules"],
  },

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "warn",
      "no-debugger": "warn",
    },
  },
];
