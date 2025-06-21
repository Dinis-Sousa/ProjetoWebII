module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/IntegrationTests/**/*.test.js'],
  setupFilesAfterEnv: ['<rootDir>/tests/IntegrationTests/setup.js'],
  testTimeout: 30000, // 30 segundos
  collectCoverage: true,
  collectCoverageFrom: [
    'controllers/**/*.js',
    'routes/**/*.js',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage/integration',
  coverageReporters: ['text', 'lcov'],
  verbose: true,
};
