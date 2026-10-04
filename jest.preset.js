// jest.preset.js
const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
      },
    ],
  },
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageReporters: ['html', 'text', 'text-summary', 'lcov'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/environments/**'
  ]
};
