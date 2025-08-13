import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable unused variables and imports warnings
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": "off",
      
      // Disable unused components warnings
      "react/jsx-no-undef": "off",
      
      // Disable unused imports
      "import/no-unused-modules": "off",
      
      // Disable missing props validation
      "react/prop-types": "off",
      
      // Disable exhaustive deps warning for hooks
      "react-hooks/exhaustive-deps": "off",
      
      // Additional common rules you might want to disable
      "no-empty": "off",
      "react/display-name": "off",
      
      // Disable TypeScript specific errors from your list
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      
      // Other TypeScript rules you might want to disable
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      'prefer-const': 'off'
    }
  }
];

export default eslintConfig;