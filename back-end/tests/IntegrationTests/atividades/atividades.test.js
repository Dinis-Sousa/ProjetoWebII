const { request } = require('../setup');

describe('Rotas de Atividade (Integração)', () => {
  let tokenClient;
  let atividadeIdCriada;

  const novaAtividade = {
    nome: `Atividade Teste ${Date.now()}`,
    descricao: 'Descrição de teste',
    data_inicio: '2025-07-01',
    data_fim: '2025-07-03'
  };

  beforeAll(async () => {
    const loginRes = await request
      .post('/users/login')
      .send({
        email: 'client@example.com',
        password: 'password123'
      });

    tokenClient = loginRes.body.token;
  });

  test('GET /atividade - Deve retornar todas as atividades', async () => {
    const res = await request.get('/atividade');

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /atividade - Deve criar uma nova atividade (com token e datas válidas)', async () => {
    const res = await request
      .post('/atividade')
      .set('Authorization', `Bearer ${tokenClient}`)
      .send(novaAtividade);

    expect(res.statusCode).toBe(201); // ou 200, dependendo do teu controller
    expect(res.body).toHaveProperty('atividade_id');

    atividadeIdCriada = res.body.atividade_id;
  });

  test('GET /atividade/:atividade_id - Deve retornar o nome da atividade', async () => {
    const res = await request.get(`/atividade/${atividadeIdCriada}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('nome');
  });

  test('GET /atividade/:id/sessions - Deve retornar sessões da atividade (mesmo que vazio)', async () => {
    const res = await request.get(`/atividade/${atividadeIdCriada}/sessions`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('PATCH /atividade/:atividade_id - Deve alterar o estado da atividade (com token)', async () => {
    const res = await request
      .patch(`/atividade/${atividadeIdCriada}`)
      .set('Authorization', `Bearer ${tokenClient}`)
      .send({ estado: 'PENDENTE' }); // Ajusta ao que o teu controller espera

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('DELETE /atividade/:id - Deve apagar a atividade criada (com token)', async () => {
    const res = await request
      .delete(`/atividade/${atividadeIdCriada}`)
      .set('Authorization', `Bearer ${tokenClient}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });
});
