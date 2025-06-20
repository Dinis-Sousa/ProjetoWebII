const request = require('supertest');
const app = require('../server');
const db = require('../models/connect');
const { sequelize } = require('../models/connect');
const { ErrorHandler } = require('../utils/error');

// Mock dos modelos do Sequelize
jest.mock('../models/connect', () => {
  const originalModule = jest.requireActual('../models/connect');
  return {
    ...originalModule,
    Utilizador: {
      ...originalModule.Utilizador,
      findOne: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
      update: jest.fn(),
    },
    InscritosSessao: {
      ...originalModule.InscritosSessao,
      findAll: jest.fn(),
      create: jest.fn(),
      destroy: jest.fn(),
    },
    sequelize: {
      ...originalModule.sequelize,
      sync: jest.fn().mockResolvedValue(true),
      close: jest.fn().mockResolvedValue(true),
    },
  };
});

describe('Users API', () => {
  let req, res, next;

  beforeEach(() => {
    // Limpar todos os mocks antes de cada teste
    jest.clearAllMocks();
    
    // Configurar req, res, next para testes de controladores
    req = { params: {}, body: {}, query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterAll(async () => {
    // Fechar a conexão com o banco de dados após todos os testes
    await sequelize.close();
  });

  describe('GET /users/:id/sessoes', () => {
    it('deve retornar 200 e as sessões do utilizador', async () => {
      // Mock dos dados
      const mockUser = { user_id: 1, nome: 'Utilizador Teste' };
      const mockSessoes = [
        { sessao_id: 1, user_id: 1, presenca: true },
        { sessao_id: 2, user_id: 1, presenca: false },
      ];

      // Configurar os mocks
      db.Utilizador.findOne.mockResolvedValue(mockUser);
      db.InscritosSessao.findAll.mockResolvedValue(mockSessoes);

      // Fazer a requisição
      const response = await request(app)
        .get('/users/1/sessoes')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(db.Utilizador.findOne).toHaveBeenCalledWith({
        where: { user_id: 1 },
        attributes: ['nome']
      });
      expect(db.InscritosSessao.findAll).toHaveBeenCalledWith({
        where: { user_id: 1 },
        attributes: ['sessao_id', 'user_id', 'presenca']
      });
    });

    it('deve retornar 404 quando o utilizador não existe', async () => {
      // Configurar o mock para retornar null (usuário não encontrado)
      db.Utilizador.findOne.mockResolvedValue(null);

      // Fazer a requisição
      const response = await request(app)
        .get('/users/999/sessoes')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Utilizador nao encontrado');
    });

    it('deve retornar array vazio quando não há sessões', async () => {
      // Mock dos dados
      const mockUser = { user_id: 1, nome: 'Utilizador Teste' };
      
      // Configurar os mocks
      db.Utilizador.findOne.mockResolvedValue(mockUser);
      db.InscritosSessao.findAll.mockResolvedValue([]);

      // Fazer a requisição
      const response = await request(app)
        .get('/users/1/sessoes')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('deve retornar 500 em caso de erro no servidor', async () => {
      // Configurar o mock para lançar um erro
      db.Utilizador.findOne.mockRejectedValue(new Error('Erro no servidor'));

      // Fazer a requisição
      const response = await request(app)
        .get('/users/1/sessoes')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /users', () => {
    it('deve retornar todos os utilizadores', async () => {
      // Mock dos dados
      const mockUsers = [
        { user_id: 1, nome: 'Utilizador 1' },
        { user_id: 2, nome: 'Utilizador 2' },
      ];

      // Configurar o mock
      db.Utilizador.findAll.mockResolvedValue(mockUsers);

      // Fazer a requisição
      const response = await request(app)
        .get('/users')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(db.Utilizador.findAll).toHaveBeenCalled();
    });

    it('deve retornar 404 quando não há utilizadores', async () => {
      // Configurar o mock para retornar array vazio
      db.Utilizador.findAll.mockResolvedValue([]);

      // Fazer a requisição
      const response = await request(app)
        .get('/users')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'There are no users!');
    });
  });
});
