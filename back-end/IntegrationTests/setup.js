// Configuração comum para todos os testes de integração
const request = require('supertest');
const app = require('../server.js');
const db = require('../models/connect');

// Mock dos modelos do Sequelize
jest.mock('../models/connect', () => {
  const originalModule = jest.requireActual('../models/connect');
  return {
    ...originalModule,
    Utilizador: {
      ...originalModule.Utilizador,
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    InscritosSessao: {
      ...originalModule.InscritosSessao,
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    },
    Sessao: {
      ...originalModule.Sessao,
      findOne: jest.fn(),
      findAll: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      destroy: jest.fn(),
    },
    sequelize: {
      ...originalModule.sequelize,
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
    },
  };
});

// Limpar todos os mocks antes de cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Fechar a conexão após todos os testes
afterAll(async () => {
  await db.sequelize.close();
});

module.exports = {
  request,
  app,
  db,
};
