module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true
  },
  extends: [
    "airbnb-base",
    'prettier'
  ],
  plugins: [
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2017
  },
  rules: {
    'linebreak-style': 0,
    'no-plusplus': 0,
    'no-param-reassign': 0,
    'no-undef': 0,
    'no-use-before-define': 0,
    'no-return-await': 0,
    'prefer-template': 0,
    'prefer-arrow-callback': 0,
    'func-names': 0,
    'no-alert': 0,
    'no-unused-vars': 0,
    'no-template-curly-in-string': 0,
    'no-console': 0
  }
};