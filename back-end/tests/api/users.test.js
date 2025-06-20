const request = require('supertest');
const app = require('../../server');
const db = require('../../models/connect');
const { sequelize } = require('../../models/connect');

// Mock data
const mockUser = {
  user_id: 1,
  nome: 'Test User',
  email: 'test@example.com',
  password: 'hashedpassword',
  role: 'user',
  escola_id: 1,
  turma_id: 1
};

const mockSessoes = [
  {
    sessao_id: 1,
    user_id: 1,
    presenca: true
  },
  {
    sessao_id: 2,
    user_id: 1,
    presenca: false
  }
];

describe('GET /users/:id/sessoes', () => {
  beforeAll(async () => {
    // Sync all models with the database
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    // Clear all test data before each test
    await db.InscritosSessao.destroy({ where: {} });
    await db.Utilizador.destroy({ where: {} });
    
    // Create test user
    await db.Utilizador.create(mockUser);
  });

  afterAll(async () => {
    // Close the database connection after all tests
    await sequelize.close();
  });

  it('deve retornar 200 e as sessões do utilizador', async () => {
    // Arrange
    await db.InscritosSessao.bulkCreate(mockSessoes);
    
    // Act
    const response = await request(app)
      .get('/users/1/sessoes')
      .expect('Content-Type', /json/);
    
    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(2);
    expect(response.body[0]).toHaveProperty('sessao_id');
    expect(response.body[0]).toHaveProperty('user_id', 1);
    expect(response.body[0]).toHaveProperty('presenca');
  });

  it('deve retornar 404 quando o utilizador não existe', async () => {
    // Act
    const response = await request(app)
      .get('/users/999/sessoes')
      .expect('Content-Type', /json/);
    
    // Assert
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'Utilizador nao encontrado');
  });

  it('deve retornar array vazio quando não há sessões', async () => {
    // Act
    const response = await request(app)
      .get('/users/1/sessoes')
      .expect('Content-Type', /json/);
    
    // Assert
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
  });
});
