const { request, app, db } = require('../setup');

describe('Users API', () => {
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

  // Adicione mais testes de usuários aqui
  // Exemplo: POST /users, GET /users/:id, PUT /users/:id, DELETE /users/:id
});
