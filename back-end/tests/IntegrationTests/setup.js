const { sequelize } = require('../../models/connect');

// Configuração global para os testes de integração
beforeAll(async () => {
  // Configurar o ambiente de teste
  process.env.NODE_ENV = 'test';
  
  // Sincronizar o banco de dados de teste
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Fechar a conexão com o banco de dados após todos os testes
  await sequelize.close();
});

// Limpar os dados entre os testes
afterEach(async () => {
  // Limpar todas as tabelas
  await sequelize.truncate({ cascade: true });
});
