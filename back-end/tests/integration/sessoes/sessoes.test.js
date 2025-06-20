const { request, app, db } = require('../setup');

describe('Sessões API', () => {
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
  });

  // Adicione mais testes de sessões aqui
  // Exemplo: POST /sessoes, GET /sessoes/:id, PUT /sessoes/:id, DELETE /sessoes/:id
});
