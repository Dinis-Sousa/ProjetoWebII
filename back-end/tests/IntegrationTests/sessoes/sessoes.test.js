const { request, db } = require('../setup');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock data for testing
const testActivity = {
  nome: 'Test Activity',
  descricao: 'Test Description',
  area_id: '1',
  dataInicio: new Date(),
  dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  estado: 'PENDENTE'
};

const testSession = {
  dataMarcada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
  horaMarcada: '14:00:00',
  vagas: 20
};

const testUser = {
  escola_id: 1,
  nome: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashedpassword123',
  perfil: 'ADMIN', // Admin to ensure authorization
  pontos: 0
};

// Clean up database before and after tests
beforeAll(async () => {
  try {
    // Clear tables or create test data
    await db.Sessao.destroy({ where: {} });
    await db.Atividade.destroy({ where: {} });
    await db.Utilizador.destroy({ where: {} });

    // Create test user for authentication
    await db.Utilizador.create(testUser);
  } catch (error) {
    console.error('Error in beforeAll:', error);
  }
});

afterAll(async () => {
  try {
    // Clean up after tests
    await db.Sessao.destroy({ where: {} });
    await db.Atividade.destroy({ where: {} });
    await db.Utilizador.destroy({ where: {} });
  } catch (error) {
    console.error('Error in afterAll:', error);
  }
});

describe('Session API Integration Tests', () => {
  let activityId;
  let sessionId;
  let authToken;

  // Get authentication token
  beforeAll(async () => {
    const response = await request
      .post('/users/login')
      .send({
        tEmail: testUser.email,
        passHash: testUser.passwordHash
      });

    authToken = response.body.token;
  });

  // Test activity creation (needed for sessions)
  test('Should create a new activity for sessions', async () => {
    const response = await request
      .post('/ativities')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testActivity);

    expect(response.status).toBe(201);

    // Get the activity ID
    const activity = await db.Atividade.findOne({ where: { nome: testActivity.nome } });
    expect(activity).not.toBeNull();
    activityId = activity.atividade_id;
    testSession.atividade_id = activityId;
  });

  // Test session creation
  test('Should create a new session', async () => {
    const response = await request
      .post('/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testSession);

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('Sessao criada com sucesso');

    // Verify session was created in database
    const createdSession = await db.Sessao.findOne({ 
      where: { 
        atividade_id: testSession.atividade_id,
        dataMarcada: testSession.dataMarcada
      } 
    });
    expect(createdSession).not.toBeNull();
    sessionId = createdSession.sessao_id;
  });

  // Test get all sessions
  test('Should get all sessions', async () => {
    const response = await request
      .get('/sessions')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Check if our test session is in the list
    const foundSession = response.body.find(session => session.sessao_id === sessionId);
    expect(foundSession).toBeDefined();
  });

  // Test get sessions by date
  test('Should get sessions by date', async () => {
    const response = await request
      .get('/sessions/sessao')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ sessionDate: testSession.dataMarcada });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);

    // Check if our test session is in the list
    const foundSession = response.body.data.find(session => session.sessao_id === sessionId);
    expect(foundSession).toBeDefined();
  });

  // Test delete session
  test('Should delete a session', async () => {
    const response = await request
      .delete(`/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);

    // Verify session was deleted
    const deletedSession = await db.Sessao.findOne({ where: { sessao_id: sessionId } });
    expect(deletedSession).toBeNull();
  });

  // Test creating session with invalid activity ID
  test('Should reject session creation with invalid activity ID', async () => {
    const invalidSession = {
      atividade_id: 9999, // Non-existent activity ID
      dataMarcada: testSession.dataMarcada,
      horaMarcada: testSession.horaMarcada,
      vagas: testSession.vagas
    };

    const response = await request
      .post('/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidSession);

    expect(response.status).toBe(400);
  });
});
