module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:react/jsx-runtime",
    "prettier",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "node_modules"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "18.2",
    },
  },
  plugins: ["react-refresh", "@typescript-eslint"],
  rules: {
    // React rules
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",

    // TypeScript rules
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",

    //  React Refresh rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],

    // Disable problematic rules
    "react/set-state-in-effect": "off",
    "react/immutability": "off",
  },
};
