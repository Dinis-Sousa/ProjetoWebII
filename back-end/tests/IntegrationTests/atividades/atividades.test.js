const { request, db } = require('../setup');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock data for testing
const testActivity = {
  nome: 'Test Activity',
  descricao: 'Test Description',
  area_id: '1',
  dataInicio: new Date().toISOString(),
  dataFim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
  estado: 'PENDENTE'
};

const testUser = {
  escola_id: 1,
  nome: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashedpassword123',
  perfil: 'ADMIN', // Admin to ensure authorization
  pontos: 0
};

const testSession = {
  dataMarcada: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days from now
  horaMarcada: '14:00:00',
  vagas: 20
};

// Clean up database before and after tests
beforeAll(async () => {
  // Clear tables or create test data
  await db.Sessao.destroy({ where: {} });
  await db.Atividade.destroy({ where: {} });
  await db.Utilizador.destroy({ where: {} });

  // Create test user for authentication
  await db.Utilizador.create(testUser);
});

afterAll(async () => {
  // Clean up after tests
  await db.Sessao.destroy({ where: {} });
  await db.Atividade.destroy({ where: {} });
  await db.Utilizador.destroy({ where: {} });
});

describe('Activity API Integration Tests', () => {
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

  // Test activity creation
  test('Should create a new activity', async () => {
    const response = await request
      .post('/ativities')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testActivity);

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('atividade criada com sucesso');

    // Verify activity was created in database
    const createdActivity = await db.Atividade.findOne({ where: { nome: testActivity.nome } });
    expect(createdActivity).not.toBeNull();
    activityId = createdActivity.atividade_id;
  });

  // Test get all activities
  test('Should get all activities', async () => {
    const response = await request
      .get('/ativities')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    // Check if our test activity is in the list
    const foundActivity = response.body.find(activity => activity.atividade_id === activityId);
    expect(foundActivity).toBeDefined();
    expect(foundActivity.nome).toBe(testActivity.nome);
  });

  // Test get activity name by ID
  test('Should get activity name by ID', async () => {
    const response = await request
      .get(`/ativities/${activityId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nome');
    expect(response.body.nome).toBe(testActivity.nome);
  });

  // Test update activity status
  test('Should update activity status', async () => {
    const newStatus = 'EM PROGRESSO';

    const response = await request
      .patch(`/ativities/${activityId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ estado: newStatus });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('estado atulizado');
    expect(response.body.estado).toBe(newStatus);

    // Verify status was updated in database
    const updatedActivity = await db.Atividade.findOne({ where: { atividade_id: activityId } });
    expect(updatedActivity.estado).toBe(newStatus);
  });

  // Test create session for activity and get sessions by activity
  test('Should create session for activity and get sessions by activity', async () => {
    // Create a session for the activity
    testSession.atividade_id = activityId;

    const createResponse = await request
      .post('/sessions')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testSession);

    expect(createResponse.status).toBe(201);

    // Get the session ID
    const createdSession = await db.Sessao.findOne({ 
      where: { 
        atividade_id: activityId,
        dataMarcada: testSession.dataMarcada
      } 
    });
    expect(createdSession).not.toBeNull();
    sessionId = createdSession.sessao_id;

    // Get sessions by activity
    const response = await request
      .get(`/ativities/${activityId}/sessions`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBeGreaterThan(0);

    // Check if our test session is in the list
    const foundSession = response.body.data.find(session => session.sessao_id === sessionId);
    expect(foundSession).toBeDefined();
  });

  // Test delete activity
  test('Should delete an activity', async () => {
    // First delete the session to avoid foreign key constraints
    await request
      .delete(`/sessions/${sessionId}`)
      .set('Authorization', `Bearer ${authToken}`);

    const response = await request
      .delete(`/ativities/${activityId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);

    // Verify activity was deleted
    const deletedActivity = await db.Atividade.findOne({ where: { atividade_id: activityId } });
    expect(deletedActivity).toBeNull();
  });

  // Test activity creation with invalid data
  test('Should reject activity creation with invalid data', async () => {
    const invalidActivity = {
      // Missing required fields
      nome: 'Invalid Activity',
      // No descricao
      // No dataInicio
      // No dataFim
      estado: 'INVALID_STATE' // Invalid enum value
    };

    const response = await request
      .post('/ativities')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invalidActivity);

    // Should return an error status
    expect(response.status).not.toBe(201);
  });
});
