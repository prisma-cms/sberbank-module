module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: [
    'standard'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    "no-multiple-empty-lines": "off",
    "comma-dangle": "off",
    "semi": "off",
    "quotes": "off",
    "brace-style": "off",
    "padded-blocks": "off",
    "space-before-function-paren": "off",
    "generator-star-spacing": "off",
    "no-cond-assign": "off",
    "camelcase": "off",
  }
}
