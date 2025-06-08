// usersController.test.js
const {
  getSessaoInscritasByUser,
  getAllUsers,
  checkUser,
  addUser,
  apagarUser,
} = require('../controllers/usersControllers.js');

// Mock your db models from ../models/connect.js
jest.mock('../models/connect.js', () => ({
  Utilizador: {
    findOne: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  School: {
    findAll: jest.fn(),
  },
  InscritosSessao: {
    findAll: jest.fn(),
  },
}));

const db = require('../models/connect.js');
const User = db.Utilizador;
const School = db.School;
const InscritosSessao = db.InscritosSessao;

describe('User Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();

    // Clear mocks before each test
    jest.clearAllMocks();
  });

  describe('getSessaoInscritasByUser', () => {
    it('should return sessions for a user', async () => {
      req.params.id = 1;

      User.findOne.mockResolvedValue({ get: () => ({ nome: 'Alice' }) });
      InscritosSessao.findAll.mockResolvedValue([
        { get: () => ({ sessao_id: 1, user_id: 1, presenca: true }) },
        { get: () => ({ sessao_id: 2, user_id: 1, presenca: false }) },
      ]);

      await getSessaoInscritasByUser(req, res, next);

      expect(User.findOne).toHaveBeenCalledWith({
        attributes: ['nome'],
        where: { user_id: 1 },
      });
      expect(InscritosSessao.findAll).toHaveBeenCalledWith({
        attributes: ['sessao_id', 'user_id', 'presenca'],
        where: { user_id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { sessao_id: 1, user_id: 1, presenca: true },
          { sessao_id: 2, user_id: 1, presenca: false },
        ],
      });
    });

    it('should call next with error if user not found', async () => {
      req.params.id = 1;
      User.findOne.mockResolvedValue(null);

      await getSessaoInscritasByUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next with error if no sessions found', async () => {
      req.params.id = 1;
      User.findOne.mockResolvedValue({ get: () => ({ nome: 'Alice' }) });
      InscritosSessao.findAll.mockResolvedValue(null);

      await getSessaoInscritasByUser(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      User.findAll.mockResolvedValue([
        { get: () => ({ user_id: 1, nome: 'Alice' }) },
        { get: () => ({ user_id: 2, nome: 'Bob' }) },
      ]);

      await getAllUsers(req, res, next);

      expect(User.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { user_id: 1, nome: 'Alice' },
          { user_id: 2, nome: 'Bob' },
        ],
      });
    });

    it('should call next with error if no users found', async () => {
      User.findAll.mockResolvedValue(null);

      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      await getAllUsers(req, res, next);

      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  describe('checkUser', () => {
    it('should return correct message on successful login', async () => {
      req.body = { tEmail: 'a@a.com', passHash: 'hash' };

      User.findAll.mockResolvedValue([
        { dataValues: { passwordHash: 'hash', perfil: 'ALUNO' } },
      ]);

      await checkUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Aluno logado' });
    });
    it('should return correct message on successful login', async () => {
      req.body = { tEmail: 'a@a.com', passHash: 'hash' };

      User.findAll.mockResolvedValue([
        { dataValues: { passwordHash: 'hash', perfil: 'COLABORADOR' } },
      ]);

      await checkUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Colaborador logado' });
    });
    it('should return correct message on successful login', async () => {
      req.body = { tEmail: 'a@a.com', passHash: 'hash' };

      User.findAll.mockResolvedValue([
        { dataValues: { passwordHash: 'hash', perfil: 'ADMIN' } },
      ]);

      await checkUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Admin logado' });
    });

    it('should throw error if user not found', async () => {
      req.body = { tEmail: 'a@a.com', passHash: 'hash' };

      User.findAll.mockResolvedValue([]);

      await checkUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should throw error if password incorrect', async () => {
      req.body = { tEmail: 'a@a.com', passHash: 'wrong' };

      User.findAll.mockResolvedValue([
        { dataValues: { passwordHash: 'hash', perfil: 'ALUNO' } },
      ]);

      await checkUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    it('should create a new user successfully', async () => {
      req.body = {
        nome: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hash',
        escola: 'MySchool',
      };

      School.findAll.mockResolvedValue([
        { dataValues: { escola_id: 1 } },
      ]);

      User.create.mockResolvedValue({});

      await addUser(req, res, next);

      expect(School.findAll).toHaveBeenCalledWith({
        attributes: ['escola_id'],
        where: { nome: 'MySchool' },
      });
      expect(User.create).toHaveBeenCalledWith({
        escola_id: 1,
        nome: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hash',
        pontos: 0,
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Utilizador criado com sucesso!',
      });
    });

    it('should call next if school not found', async () => {
      req.body = {
        nome: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hash',
        escola: 'UnknownSchool',
      };

      School.findAll.mockResolvedValue(null);

      await addUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should call next if User.create fails', async () => {
      req.body = {
        nome: 'Alice',
        email: 'alice@example.com',
        passwordHash: 'hash',
        escola: 'MySchool',
      };

      School.findAll.mockResolvedValue([
        { dataValues: { escola_id: 1 } },
      ]);
      User.create.mockRejectedValue(new Error('Failed to create'));

      await addUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('apagarUser', () => {
    it('should delete user successfully', async () => {
      req.body = 1;
      User.destroy.mockResolvedValue(1);

      await apagarUser(req, res, next);

      expect(User.destroy).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'UTLIZADOR APAGADO COM SUCESSO',
      });
    });

    it('should call next if destroy fails', async () => {
      req.body = 1;
      User.destroy.mockRejectedValue(new Error('Destroy failed'));

      await apagarUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
