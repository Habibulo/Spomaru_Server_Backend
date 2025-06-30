module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['prettier'],
  ignorePatterns: ['doc/assets/main.bundle.js'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': 'warn',
    'no-useless-escape': 'off',
  },
};
