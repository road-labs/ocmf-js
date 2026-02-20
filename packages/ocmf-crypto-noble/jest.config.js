const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    ...tsJestTransformCfg,
    '^.+/@noble/(curves|hashes)/.+\\.js$': ['ts-jest', { useESM: true }],
  },
  transformIgnorePatterns: [
    '/node_modules/.pnpm/(?!(@noble\\+curves|@noble\\+hashes))',
  ],
};
