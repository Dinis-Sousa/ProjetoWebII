const { request, app, db } = require('../setup');

describe('Atividades API', () => {
  describe('GET /atividades', () => {
    it('deve retornar todas as atividades', async () => {
      // Mock dos dados
      const mockAtividades = [
        { atividade_id: 1, nome: 'Atividade 1' },
        { atividade_id: 2, nome: 'Atividade 2' },
      ];

      // Configurar o mock
      db.Atividade.findAll.mockResolvedValue(mockAtividades);

      // Fazer a requisição
      const response = await request(app)
        .get('/atividades')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(db.Atividade.findAll).toHaveBeenCalled();
    });

    it('deve retornar 404 quando não há atividades', async () => {
      // Configurar o mock para retornar array vazio
      db.Atividade.findAll.mockResolvedValue([]);

      // Fazer a requisição
      const response = await request(app)
        .get('/atividades')
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Atividade nao existem!');
    });
  });

  // Adicione mais testes de atividades aqui
  // Exemplo: POST /atividades, GET /atividades/:id, PUT /atividades/:id, DELETE /atividades/:id
});
