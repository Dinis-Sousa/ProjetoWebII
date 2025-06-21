const { request, app, db } = require('../setup');

describe('Autenticação API', () => {
  describe('POST /auth/login', () => {
    it('deve autenticar um utilizador com credenciais válidas', async () => {
      // Mock dos dados
      const mockUser = {
        user_id: 1,
        email: 'teste@example.com',
        password: '$2b$10$examplehash', // Senha "hashada"
        validatePassword: jest.fn().mockResolvedValue(true)
      };

      // Configurar o mock
      db.Utilizador.findOne.mockResolvedValue(mockUser);

      // Fazer a requisição
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'teste@example.com',
          password: 'senha123'
        })
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(db.Utilizador.findOne).toHaveBeenCalledWith({
        where: { email: 'teste@example.com' }
      });
    });

    it('deve retornar 401 para credenciais inválidas', async () => {
      // Configurar o mock para retornar null (usuário não encontrado)
      db.Utilizador.findOne.mockResolvedValue(null);

      // Fazer a requisição
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'inexistente@example.com',
          password: 'senha123'
        })
        .expect('Content-Type', /json/);
      
      // Verificar a resposta
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Credenciais inválidas');
    });
  });

  // Adicione mais testes de autenticação aqui
  // Exemplo: registro, refresh token, recuperação de senha
});
