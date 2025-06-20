module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/integration/setup.js'],
  collectCoverage: true,
  coverageDirectory: 'coverage/integration',
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'lcov'],
  testTimeout: 10000,
};
