// setup.js
const supertest = require('supertest');
const app = require('../../server'); // o teu app Express exportado
const db = require('../../models/connect'); // o teu sequelize ou conexões
const request = supertest(app);



// Limpar mocks entre testes e fechar conexões
afterEach(() => {
  jest.clearAllMocks();
});

// Fecha conexão com o banco de dados após todos os testes
afterAll(async () => {
  try {
    await db.sequelize.close();
    console.log('Database connection closed successfully');
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
});

module.exports = { request, app, db };