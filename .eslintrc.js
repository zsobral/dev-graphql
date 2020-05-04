module.exports = {
  env: {
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: 'eslint:recommended',
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'no-unused-vars': ['error', { args: 'none' }],
  },
}
