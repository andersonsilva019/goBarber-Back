module.exports = {
  env: {
    commonjs: true,
    es6: true,
  },
  plugin:['prettier'],
  extends: [
    'airbnb-base',
    'prettier', 
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "no-spaced-func": "off",
     "prettier/prettier": "error",
    "class-methods-use-this": "off",
    /* "arrow-spacing": "off",
    "keyword-spacing" : "off", */
    "no-param-reassign":"off",
    "camelcase": "off",
    "no-unused-vars":["error", {"argsIgnorePattern" : "next" }],
    /* "space-before-blocks": ["error", { "functions": "never", "keywords": "never", "classes": "always" }] */
  },
};
