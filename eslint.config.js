import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      quotes: 'off',
      curly: 'off',
      'no-useless-escape': 'off',
      'react-native/no-inline-styles': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'no-var': 'warn',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.jest,
        ...globals.node,
        ...globals.browser,
        __DEV__: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      quotes: 'off',
      curly: 'off',
      'no-useless-escape': 'off',
      'react-native/no-inline-styles': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
      'no-var': 'warn',
      'prefer-const': 'warn',
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['e2e/**/*.e2e.js', 'e2e/**/*.e2e.ts'],
    languageOptions: {
      globals: {
        ...globals.jest,
        device: 'readonly',
        element: 'readonly',
        by: 'readonly',
        waitFor: 'readonly',
      },
    },
  },
  {
    files: ['jest.setup.cjs', 'jest.config.cjs'],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    ignores: [
      'node_modules/',
      'android/build/',
      'ios/build/',
      'dist/',
      'build/',
      'coverage/',
      'android/',
      'ios/',
      'e2e/artifacts/',
      'e2e/screenshots/',
      '*.log',
      '.DS_Store',
      '.gradle/',
      'DerivedData/',
      'Pods/',
      '.expo/',
      '.sisyphus/',
      '.superset/',
      '.vscode/',
    ],
  },
];