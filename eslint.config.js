import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
<<<<<<< HEAD
=======
    ...js.configs.recommended,
>>>>>>> 5d73c961b8b00a97ccf6a031ed7db878f06aa342
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
<<<<<<< HEAD
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
=======
        ecmaFeatures: {
          jsx: true,
        },
>>>>>>> 5d73c961b8b00a97ccf6a031ed7db878f06aa342
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
<<<<<<< HEAD
      'no-unused-vars': 'warn',
=======
      'no-unused-vars': 'off',
>>>>>>> 5d73c961b8b00a97ccf6a031ed7db878f06aa342
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
];
