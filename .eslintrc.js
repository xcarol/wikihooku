module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-airbnb',
    'prettier',
  ],

  plugins: [
    'vue',
  ],

  rules: {
    'max-len': 0,
    'vue/max-len': 0,
    'no-underscore-dangle': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/extensions': ['error', 'always', {
      js: 'never',
      vue: 'never',
    }],
    'arrow-parens': ['error', 'always'],
    "comma-dangle": ["error", "always-multiline"],
    "semi": ["error", "always"],
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
  },

  parserOptions: {
    ecmaVersion: 14,
    sourceType: 'module',
  },
};
