/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    curly: ['error', 'all'],
    semi: ['error', 'always'],
    eqeqeq: ['error', 'always'],
    quotes: ['error', 'single'],
    indent: ['error', 2],
    'no-unused-vars': 'off',
    'no-console': 'warn',
    'no-debugger': 'warn',
    'no-tabs': 'error',
    'no-trailing-spaces': ['error'],
    'no-await-in-loop': 'error',
    'no-alert': 'error',
    'no-eval': 'error',
    'no-implied-eval': 'error',
    'no-lonely-if': 'error',
    'no-shadow': 'off',
    'no-useless-concat': 'error',
    'no-multi-spaces': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'arrow-parens': ['error', 'as-needed'],
    'arrow-spacing': ['error', {'before': true, 'after': true}],
    'block-spacing': 'error',
    'dot-location': ['error', 'property'],
    'prefer-template': 'error',
    'comma-dangle': ['error', 'never'],
    'object-curly-spacing': ['error', 'never'],
    'object-shorthand': ['error', 'always'],
    'prefer-const': 'off',
    'func-style': ['error', 'declaration', {'allowArrowFunctions': true}],
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/array-type': ['error', {
      default: 'array-simple'
    }],
    '@typescript-eslint/member-delimiter-style': ['error', {
      multiline: {
        delimiter: 'semi',
        requireLast: true
      },
      singleline: {
        delimiter: 'semi',
        requireLast: false
      }
    }],
    '@typescript-eslint/brace-style': ['error'],
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/require-default-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/component-api-style': ['error', ['script-setup', 'composition']],
    'vue/component-name-in-template-casing': ['error', 'PascalCase', {'registeredComponentsOnly': false, ignores: ['i18n-t']}],
    'vue/max-attributes-per-line': 'error',
    'vue/object-curly-spacing': ['error', 'always'],
    'vue/dot-location': ['error', 'property'],
    'vue/arrow-spacing': ['error', {'before': true, 'after': true}],
    'vue/comma-dangle': ['error', 'never'],
    'vue/component-tags-order': ['error', {
      'order': [ 'script', 'template', 'style' ]
    }],
    'vue/valid-v-slot': ['error', {
      'allowModifiers': true
    }]
  }
};
