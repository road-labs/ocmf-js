// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/webpack.config.js',
      '**/jest.config.js',
    ],
  },
  eslint.configs.recommended,
  tseslint.configs.recommended
);
