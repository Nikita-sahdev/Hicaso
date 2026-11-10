import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Full page loads (<a href>) so the kit scripts initialise on every page.
  { rules: { "@next/next/no-html-link-for-pages": "off" } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Kit files are copied verbatim from the design skill.
    "public/assets/**",
  ]),
]);

export default eslintConfig;
