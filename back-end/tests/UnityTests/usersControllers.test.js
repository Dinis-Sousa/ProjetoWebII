// tests/usersControllers.unit.test.js
const userController = require('../../controllers/usersControllers');
const db = require('../../models/connect.js');
const jwt = require('jsonwebtoken');

jest.mock('../../models/connect.js');
jest.mock('jsonwebtoken');

describe('User Controller Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getSessaoInscritasByUser', () => {
    it('should call next with error if user not found', async () => {
      req.params.id = 123;
      db.Utilizador.findOne.mockResolvedValue(null);

      await userController.getSessaoInscritasByUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Utilizador nao encontrado');
    });

    it('should call next with error if no sessions found', async () => {
      req.params.id = 123;
      db.Utilizador.findOne.mockResolvedValue({ nome: 'Teste' });
      db.InscritosSessao.findAll.mockResolvedValue(null);

      await userController.getSessaoInscritasByUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toMatch(/Sessoes nao encontradas/);
    });

    it('should return plain sessions array', async () => {
      req.params.id = 123;
      db.Utilizador.findOne.mockResolvedValue({ nome: 'Teste' });

      const mockSessaoInstance = {
        get: jest.fn().mockReturnValue({ sessao_id: 1, user_id: 123, presenca: true }),
      };
      db.InscritosSessao.findAll.mockResolvedValue([mockSessaoInstance]);

      await userController.getSessaoInscritasByUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ sessao_id: 1, user_id: 123, presenca: true }]);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should call next with error if no users', async () => {
      db.Utilizador.findAll.mockResolvedValue(null);

      await userController.getAllUsers(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('There are no users!');
    });

    it('should return users list', async () => {
      const fakeUsers = [{ user_id: 1, nome: 'User1' }, { user_id: 2, nome: 'User2' }];
      db.Utilizador.findAll.mockResolvedValue(fakeUsers);

      await userController.getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeUsers);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('apagarUser', () => {
    it('should delete user and respond 204', async () => {
      req.params.user_id = 42;
      db.Utilizador.destroy.mockResolvedValue(1);

      await userController.apagarUser(req, res, next);

      expect(db.Utilizador.destroy).toHaveBeenCalledWith({ where: { user_id: 42 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next on destroy error', async () => {
      const error = new Error('destroy fail');
      db.Utilizador.destroy.mockRejectedValue(error);

      await userController.apagarUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('checkUser', () => {
    it('should call next with error if user email not found', async () => {
      req.body = { tEmail: 'email@test.com', passHash: '123' };
      db.Utilizador.findAll.mockResolvedValue([]);

      await userController.checkUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Nao existe utilizador com esse email');
    });

    it('should call next with error if password incorrect', async () => {
      req.body = { tEmail: 'email@test.com', passHash: 'wrongpass' };
      db.Utilizador.findAll.mockResolvedValue([
        { dataValues: { user_id: 1, perfil: 'ALUNO', passwordHash: 'correctpass' } }
      ]);

      await userController.checkUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toBe('Password incorreta!');
    });

    it('should return token and message on success for ALUNO', async () => {
      req.body = { tEmail: 'email@test.com', passHash: 'correctpass' };
      const userData = { user_id: 1, perfil: 'ALUNO', passwordHash: 'correctpass' };
      db.Utilizador.findAll.mockResolvedValue([{ dataValues: userData }]);
      jwt.sign.mockReturnValue('mocktoken');

      await userController.checkUser(req, res, next);

      expect(jwt.sign).toHaveBeenCalledWith(
        { user_id: 1, perfil: 'ALUNO' },
        expect.any(String),
        { expiresIn: '1h' }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Aluno logado', token: 'mocktoken' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return token and message on success for COLABORADOR', async () => {
      req.body = { tEmail: 'email@test.com', passHash: 'correctpass' };
      const userData = { user_id: 1, perfil: 'COLABORADOR', passwordHash: 'correctpass' };
      db.Utilizador.findAll.mockResolvedValue([{ dataValues: userData }]);
      jwt.sign.mockReturnValue('mocktoken');

      await userController.checkUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ msg: 'Colaborador logado', token: 'mocktoken' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return token and message on success for ADMIN', async () => {
      req.body = { tEmail: 'email@test.com', passHash: 'correctpass' };
      const userData = { user_id: 1, perfil: 'ADMIN', passwordHash: 'correctpass' };
      db.Utilizador.findAll.mockResolvedValue([{ dataValues: userData }]);
      jwt.sign.mockReturnValue('mocktoken');

      await userController.checkUser(req, res, next);

      expect(res.json).toHaveBeenCalledWith({ msg: 'Admin logado', token: 'mocktoken' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next on error', async () => {
      const error = new Error('fail');
      db.Utilizador.findAll.mockRejectedValue(error);

      await userController.checkUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addUser', () => {
    it('should create user and respond success', async () => {
      req.body = {
        escola_id: 1,
        nome: 'Test User',
        email: 'test@test.com',
        passwordHash: '123456',
      };
      db.Utilizador.create.mockResolvedValue(true);

      await userController.addUser(req, res, next);

      expect(db.Utilizador.create).toHaveBeenCalledWith({
        escola_id: 1,
        nome: 'Test User',
        email: 'test@test.com',
        passwordHash: '123456',
        pontos: 0,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Utilizador criado com sucesso!' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next on create error', async () => {
      const error = new Error('create failed');
      db.Utilizador.create.mockRejectedValue(error);

      await userController.addUser(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
