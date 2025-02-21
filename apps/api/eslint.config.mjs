// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['eslint.config.mjs', 'dist/**']
  },
  eslint.configs.recommended,
  {
    files: ['**/*.ts'],
    plugins: {
      '@typescript-eslint': typescript
    },
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
      },
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      ...typescript.configs['recommended'].rules,
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off'
    }
  },
  prettierConfig
];