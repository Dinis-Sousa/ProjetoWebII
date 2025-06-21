// setup.js
const supertest = require('supertest');
const app = require('../../server'); // o teu app Express exportado
const db = require('../../models/connect'); // o teu sequelize ou conexões

// Mock dos modelos - só se quiseres isolar a lógica e não tocar na DB real
jest.mock('../../models/connect', () => {
  const originalModule = jest.requireActual('../../models/connect');
  return {
    ...originalModule,
    Utilizador: {
      ...originalModule.Utilizador,
      findOne: jest.fn(),
      // ...
    },
    sequelize: {
      ...originalModule.sequelize,
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
    },
  };
});

const request = supertest(app);

// Limpar mocks entre testes
afterEach(() => {
  jest.clearAllMocks();
});

// Fecha conexão mockada ou real após todos os testes
afterAll(async () => {
  await db.sequelize.close();
});

module.exports = { request, app, db };
