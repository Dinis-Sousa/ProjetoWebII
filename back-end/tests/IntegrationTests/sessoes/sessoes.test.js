const { request } = require('../setup');

describe('Rotas de Sessão (Integração)', () => {
  let tokenClient;
  let createdSessaoId;

  const novaSessao = {
    atividade_id: 1, // ⚠️ ID de uma atividade existente na BD de testes
    data: '2025-07-01',
    hora_inicio: '10:00',
    hora_fim: '12:00',
    local: 'Sala A'
  };

  beforeAll(async () => {
    // Autenticação de cliente
    const loginRes = await request
      .post('/users/login')
      .send({ email: 'client@example.com', password: 'password123' });

    tokenClient = loginRes.body.token;
  });

  test('GET /sessao - Deve retornar todas as sessões', async () => {
    const res = await request.get('/sessao');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /sessao - Deve criar uma nova sessão (com token)', async () => {
    const res = await request
      .post('/sessao')
      .set('Authorization', `Bearer ${tokenClient}`)
      .send(novaSessao);

    expect(res.statusCode).toBe(201); // ou 200 dependendo do teu controller
    expect(res.body).toHaveProperty('sessao_id');

    createdSessaoId = res.body.sessao_id;
  });

  test('GET /sessao/sessao?data=YYYY-MM-DD - Deve buscar sessões por data', async () => {
    const res = await request.get('/sessao/sessao').query({ data: '2025-07-01' });

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('GET /sessao/:sessao_id/users - Deve listar utilizadores inscritos na sessão', async () => {
    const res = await request.get(`/sessao/${createdSessaoId}/users`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /sessao/:sessao_id - Deve apagar a sessão criada (com token)', async () => {
    const res = await request
      .delete(`/sessao/${createdSessaoId}`)
      .set('Authorization', `Bearer ${tokenClient}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
