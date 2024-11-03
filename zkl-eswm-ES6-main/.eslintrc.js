// .eslintrc.js
module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    rules: {
      'import/prefer-default-export': 'off',
      '@typescript-eslint/explicit-function-return-type': 'on',
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  };