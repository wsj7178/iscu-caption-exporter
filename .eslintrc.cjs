module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'prettier', 'import'],
  root: true,
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['dist/**/*'],
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'prettier/prettier': 'error',
    'import/order': [
      'error',
      {
        alphabetize: {
          order:
            'asc' /* sort in ascending order. Options: ['ignore', 'asc', 'desc'] */,
        },
      },
    ],
    'import/no-unresolved': 'off',
  },
}
