module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  extends: ['plugin:react/recommended', 'airbnb', 'plugin:prettier/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    UploadChangeEvent: true,
    SelectFileProps: true,
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {
    'no-new': 'off',
    'no-shadow': 'off',
    'no-empty': 'off',
    'no-unused-vars': 'off',
    'no-constructor-return': 'off',
    'no-template-curly-in-string': 'off',
    'no-param-reassign': 'off',
    'dot-notation': 'off',
    'linebreak-style': 'off',
    'global-require': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/alt-text': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': [2, { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/function-component-definition': 'off',
    'react/jsx-no-constructed-context-values': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'react/no-danger': 'off',
    'import/prefer-default-export': 'off',
    'import/no-cycle': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        printWidth: 100,
        endOfLine: 'auto',
        trailingComma: 'all',
      },
    ],
  },
};
