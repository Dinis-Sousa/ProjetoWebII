const request = require('supertest');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const app = require('../../../server');
const db = require('../../../models/connect');

// Dados de teste
const mockAdminUser = {
  user_id: 1,
  nome: 'Admin',
  email: 'admin@test.com',
  role: 'ADMIN'
};

const mockAtividade = {
  nome: 'Atividade de Teste',
  descricao: 'Descrição da atividade de teste',
  area_id: '1',
  dataInicio: '2024-12-01T10:00:00Z',
  dataFim: '2024-12-31T18:00:00Z',
  estado: 'PENDENTE'
};

// Token de autenticação mockado
let authToken; // Será definido no beforeAll

// Configuração dos testes
describe('Testes de Integração - Atividades', () => {
  beforeAll(async () => {
    // Sincronizar o banco de dados de teste
    await db.sequelize.sync({ force: true });
    
    // Criar um token de autenticação mockado
    authToken = jwt.sign(
      { user_id: mockAdminUser.user_id, perfil: 'ADMIN' }, 
      process.env.JWT_SECRET || 'test_secret_key',
      { expiresIn: '1h' }
    );
    
    // Configurar o token no app para uso nos testes
    app.set('testToken', authToken);
  });

  afterAll(async () => {
    // Fechar a conexão com o banco de dados
    await db.sequelize.close();
  });

  describe('GET /ativities', () => {
    it('deve retornar uma lista vazia quando não há atividades', async () => {
      const response = await request(app).get('/ativities');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });

    it('deve retornar uma lista de atividades', async () => {
      // Primeiro, cria uma atividade
      await db.Atividade.create(mockAtividade);
      
      const response = await request(app).get('/ativities');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty('atividade_id');
      expect(response.body[0].nome).toBe(mockAtividade.nome);
    });
  });

  describe('POST /ativities', () => {
    it('deve criar uma nova atividade com dados válidos', async () => {
      const response = await request(app)
        .post('/ativities')
        .set('Authorization', `Bearer ${authToken}`)
        .send(mockAtividade);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('msg', 'atividade criada com sucesso');
      
      // Verifica se a atividade foi realmente criada
      const atividades = await db.Atividade.findAll();
      expect(atividades.length).toBe(1);
      expect(atividades[0].nome).toBe(mockAtividade.nome);
    });

    it('não deve criar atividade sem autenticação', async () => {
      const response = await request(app)
        .post('/ativities')
        .send(mockAtividade);
      
      expect(response.status).toBe(401);
    });

    it('não deve criar atividade com dados inválidos', async () => {
      const invalidAtividade = { ...mockAtividade, nome: '' };
      
      const response = await request(app)
        .post('/ativities')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidAtividade);
      
      expect(response.status).toBe(400);
    });
  });

  describe('GET /ativities/:id', () => {
    let atividadeId;

    beforeAll(async () => {
      // Criar uma atividade para teste
      const atividade = await db.Atividade.create(mockAtividade);
      atividadeId = atividade.atividade_id;
    });

    it('deve retornar os detalhes de uma atividade existente', async () => {
      const response = await request(app).get(`/ativities/${atividadeId}`);
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('atividade_id', atividadeId);
      expect(response.body.nome).toBe(mockAtividade.nome);
    });

    it('deve retornar 404 para uma atividade inexistente', async () => {
      const response = await request(app).get('/ativities/9999');
      
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /ativities/:atividade_id', () => {
    let atividadeId;

    beforeEach(async () => {
      // Criar uma atividade para teste
      const atividade = await db.Atividade.create(mockAtividade);
      atividadeId = atividade.atividade_id;
    });

    it('deve atualizar o estado de uma atividade', async () => {
      const response = await request(app)
        .patch(`/ativities/${atividadeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ estado: 'EM PROGRESSO' });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('estado', 'EM PROGRESSO');
      
      // Verifica se a atualização foi persistida
      const updatedAtividade = await db.Atividade.findByPk(atividadeId);
      expect(updatedAtividade.estado).toBe('EM PROGRESSO');
    });

    it('não deve atualizar com um estado inválido', async () => {
      const response = await request(app)
        .patch(`/ativities/${atividadeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ estado: 'ESTADO_INVALIDO' });
      
      expect(response.status).toBe(400);
    });
  });

  describe('DELETE /ativities/:id', () => {
    let atividadeId;

    beforeEach(async () => {
      // Criar uma atividade para teste
      const atividade = await db.Atividade.create(mockAtividade);
      atividadeId = atividade.atividade_id;
    });

    it('deve remover uma atividade existente', async () => {
      const response = await request(app)
        .delete(`/ativities/${atividadeId}`)
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(204);
      
      // Verifica se a atividade foi realmente removida
      const atividade = await db.Atividade.findByPk(atividadeId);
      expect(atividade).toBeNull();
    });

    it('não deve remover uma atividade inexistente', async () => {
      const response = await request(app)
        .delete('/ativities/9999')
        .set('Authorization', `Bearer ${authToken}`);
      
      expect(response.status).toBe(404);
    });
  });

  describe('GET /ativities/:id/sessions', () => {
    let atividadeId;

    beforeAll(async () => {
      // Criar uma atividade e sessões associadas
      const atividade = await db.Atividade.create(mockAtividade);
      atividadeId = atividade.atividade_id;
      
      // Criar sessões para a atividade
      await db.Sessao.bulkCreate([
        { 
          dataMarcada: '2024-12-10', 
          horaMarcada: '10:00',
          vagas: 10,
          atividade_id: atividadeId
        },
        { 
          dataMarcada: '2024-12-17', 
          horaMarcada: '14:00',
          vagas: 15,
          atividade_id: atividadeId
        }
      ]);
    });

    it('deve retornar as sessões de uma atividade', async () => {
      const response = await request(app).get(`/ativities/${atividadeId}/sessions`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('sessao_id');
      expect(response.body[0].atividade_id).toBe(atividadeId);
    });

    it('deve retornar array vazio para atividade sem sessões', async () => {
      // Criar uma nova atividade sem sessões
      const novaAtividade = await db.Atividade.create({
        ...mockAtividade,
        nome: 'Atividade sem sessões'
      });
      
      const response = await request(app).get(`/ativities/${novaAtividade.atividade_id}/sessions`);
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });
});
