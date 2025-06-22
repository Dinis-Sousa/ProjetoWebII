const request = require('supertest');
const app = require('../../../server.js'); // Adjust the path if needed
const db = require('../../../models/connect.js'); // Sequelize models, if used

let authToken;
let createdActivity;

const testActivity = {
  nome: "Teste Atividade",
  data_inicio: "2025-06-22T09:00:00Z",
  data_fim: "2025-06-22T11:00:00Z",
  local: "Sala 101"
};

beforeAll(async () => {
  const res = await request(app)
    .post('/api/login')
    .send({ email: 'admin@example.com', password: 'adminpassword' });

  authToken = res.body.token;
});

afterAll(async () => {
  await db.sequelize.close(); // Close DB connection
});

describe('Activity API Integration Tests', () => {
  test('Should create a new activity', async () => {
    const response = await request(app)
      .post('/api/atividade')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testActivity);

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('atividade criada com sucesso');

    createdActivity = response.body.atividade;
  });

  test('Should get all activities', async () => {
    const response = await request(app)
      .get('/api/atividade')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('Should get activity name by ID', async () => {
    const response = await request(app)
      .get(`/api/atividade/${createdActivity.atividade_id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('nome');
    expect(response.body.nome).toBe(testActivity.nome);
  });

  test('Should update activity status', async () => {
    const response = await request(app)
      .patch(`/api/atividade/${createdActivity.atividade_id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ estado: 'CONCLUÍDO' });

    expect(response.status).toBe(200);
    expect(response.body.msg).toBe('estado atulizado');
    expect(response.body.estado).toBe('cancelado');
  });

  test('Should create session for activity and get sessions by activity', async () => {
    const sessionPayload = {
      nome: 'Sessão Teste',
      data_inicio: '2025-06-22T09:30:00Z',
      data_fim: '2025-06-22T10:00:00Z',
      atividade_id: createdActivity.atividade_id
    };

    const createResponse = await request(app)
      .post('/api/sessao')
      .set('Authorization', `Bearer ${authToken}`)
      .send(sessionPayload);

    expect(createResponse.status).toBe(201);

    const getSessions = await request(app)
      .get(`/api/atividade/${createdActivity.atividade_id}/sessions`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(getSessions.status).toBe(200);
    expect(Array.isArray(getSessions.body)).toBe(true);
  });

  test('Should delete an activity', async () => {
    const response = await request(app)
      .delete(`/api/atividade/${createdActivity.atividade_id}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);
  });

  test('Should reject activity creation with invalid data', async () => {
    const response = await request(app)
      .post('/api/atividade')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ nome: '', data_inicio: '2025-01-01' }); // Invalid/missing fields

    expect(response.status).toBe(400); // Assuming validation returns 400
  });
});
