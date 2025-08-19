module.exports = {
  extends: ['next/core-web-vitals'],
  overrides: [
    {
      files: ['jest.config.js', 'jest.setup.js'],
      env: {
        node: true,
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        'import/no-commonjs': 'off',
      },
    },
  ],
}
