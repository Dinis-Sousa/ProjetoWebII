const { request, db } = require('../setup');

describe('Rotas de Utilizador (Integração)', () => {
  const fakeUser = {
    name: 'Utilizador Teste',
    email: `teste_${Date.now()}@example.com`,
    password: '123456',
    role: 'client'
  };

  let userId;
  let tokenClient;
  let sessaoId = 1; // ⚠️ Substituir por um ID válido na BD de testes

  test('POST /users - Deve registar um novo utilizador', async () => {
    const res = await request
      .post('/users')
      .send(fakeUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('user_id');

    userId = res.body.user_id;
  });

  test('POST /users/login - Deve autenticar e devolver token', async () => {
    const res = await request
      .post('/users/login')
      .send({
        email: fakeUser.email,
        password: fakeUser.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');

    tokenClient = res.body.token;
  });

  test('PUT /users/:user_id/sessions/:sessao_id - Deve inscrever utilizador numa sessão', async () => {
    const res = await request
      .put(`/users/${userId}/sessions/${sessaoId}`)
      .send({}); // Adiciona dados se necessário

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /users/:user_id/sessions/:sessao_id - Deve obter inscrição do utilizador numa sessão', async () => {
    const res = await request
      .get(`/users/${userId}/sessions/${sessaoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('registration_id');
  });

  test('PATCH /users/:user_id/sessions/:sessao_id - Deve marcar presença (token necessário)', async () => {
    const res = await request
      .patch(`/users/${userId}/sessions/${sessaoId}`)
      .set('Authorization', `Bearer ${tokenClient}`)
      .send({ presenca: true }); // Ajusta o payload conforme o teu controller

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('GET /users/:user_id/sessions - Deve obter todas as sessões em que o utilizador está inscrito', async () => {
    const res = await request
      .get(`/users/${userId}/sessions`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('DELETE /users/:user_id/sessions/:sessao_id - Deve remover inscrição do utilizador', async () => {
    const res = await request
      .delete(`/users/${userId}/sessions/${sessaoId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  // ⚠️ Teste de DELETE /users/:id requer token de administrador
  // Podes testar isso se já tiveres um token de admin válido disponível.
  // Exemplo comentado abaixo:

  // test('DELETE /users/:user_id - Deve apagar o utilizador (admin token)', async () => {
  //   const res = await request
  //     .delete(`/users/${userId}`)
  //     .set('Authorization', `Bearer ${tokenAdmin}`);
  //
  //   expect(res.statusCode).toBe(200);
  //   expect(res.body).toHaveProperty('message');
  // });
});
