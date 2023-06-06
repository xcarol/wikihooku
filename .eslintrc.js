module.exports = {
  root: true,

  env: {
    node: true,
    browser: true,
  },

  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:security/recommended',
    'plugin:vuejs-accessibility/recommended',
  ],

  plugins: [
    'vue',
    'security',
    'vuejs-accessibility',
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
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
  },

  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
      ],
      env: {
        mocha: true,
      },
    },
  ],
};
