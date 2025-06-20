// This file runs before all tests
const { sequelize } = require('../../models/connect');

// Set the environment to test
process.env.NODE_ENV = 'test';

// Set test database configuration
process.env.DB_TEST_NAME = 'test_db_test';
process.env.DB_TEST_USER = 'root';
process.env.DB_TEST_PASSWORD = '';
process.env.DB_TEST_HOST = '127.0.0.1';

// Close the database connection when all tests are done
afterAll(async () => {
  await sequelize.close();
});
