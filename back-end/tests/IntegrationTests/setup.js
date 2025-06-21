// setup.js
const supertest = require('supertest');
const app = require('../../server'); // o teu app Express exportado
const db = require('../../models/connect'); // o teu sequelize ou conexões

// Mock dos modelos - comentado para permitir conexão com banco de dados real
// jest.mock('../../models/connect', () => {
//   const originalModule = jest.requireActual('../../models/connect');
//
//   // Create mock functions for all models
//   const mockModelFunctions = {
//     findOne: jest.fn().mockResolvedValue(null),
//     findAll: jest.fn().mockResolvedValue([]),
//     create: jest.fn().mockImplementation(data => Promise.resolve({
//       ...data,
//       get: jest.fn().mockReturnValue(data),
//       dataValues: data,
//       save: jest.fn().mockResolvedValue(true)
//     })),
//     destroy: jest.fn().mockResolvedValue(1),
//     update: jest.fn().mockResolvedValue([1]),
//   };
//
//   // Apply mock functions to all models
//   const mockModels = {};
//   ['Utilizador', 'Atividade', 'Sessao', 'InscritosSessao', 'School', 'Area', 'Conquistas'].forEach(model => {
//     mockModels[model] = {
//       ...originalModule[model],
//       ...mockModelFunctions
//     };
//   });
//
//   // Return the mock implementation
//   return {
//     ...originalModule,
//     ...mockModels,
//     sequelize: {
//       ...originalModule.sequelize,
//       sync: jest.fn().mockResolvedValue(true),
//       close: jest.fn().mockResolvedValue(true),
//     },
//   };
// });

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
