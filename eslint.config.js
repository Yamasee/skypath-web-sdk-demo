import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  js.configs.recommended,
  react.configs.flat.recommended,
  react.configs.flat["jsx-runtime"],
  reactHooks.configs.flat.recommended,
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    settings: { react: { version: "detect" } },
    plugins: { "react-refresh": reactRefresh },
    rules: {
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
];
