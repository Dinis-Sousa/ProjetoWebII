const {
  getSessaoInscritasByUser,
  getAllUsers,
  checkUser,
  addUser,
  apagarUser,
} = require('../../controllers/usersControllers.js');

const db = require('../../models/connect.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/connect.js');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn();
  res.send = jest.fn();
  return res;
};

const mockNext = jest.fn();

describe('User Controller', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const req = {};
      const res = mockRes();
      const users = [{ user_id: 1, nome: 'Teste' }];

      db.Utilizador.findAll.mockResolvedValue(users);

      await getAllUsers(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(users);
    });

    it('should handle no users', async () => {
      const req = {};
      const res = mockRes();

      db.Utilizador.findAll.mockResolvedValue(null);

      await getAllUsers(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getSessaoInscritasByUser', () => {
    it('should return sessions for user', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();

      db.Utilizador.findOne.mockResolvedValue({ nome: 'João' });
      db.InscritosSessao.findAll.mockResolvedValue([
        { get: () => ({ sessao_id: 1, user_id: 1, presenca: true }) },
      ]);

      await getSessaoInscritasByUser(req, res, mockNext);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { sessao_id: 1, user_id: 1, presenca: true },
      ]);
    });

    it('should handle user not found', async () => {
      const req = { params: { id: 999 } };
      const res = mockRes();

      db.Utilizador.findOne.mockResolvedValue(null);

      await getSessaoInscritasByUser(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('addUser', () => {
    it('should create a new user', async () => {
      const req = {
        body: {
          escola_id: 1,
          nome: 'Ana',
          email: 'ana@email.com',
          passwordHash: '1234',
        },
      };
      const res = mockRes();

      bcrypt.hash.mockResolvedValue('hashed_pass');
      db.Utilizador.create.mockResolvedValue({});

      await addUser(req, res, mockNext);
      expect(bcrypt.hash).toHaveBeenCalledWith('1234', 10);
      expect(db.Utilizador.create).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Utilizador criado com sucesso!' });
    });
  });

  describe('apagarUser', () => {
    it('should delete user', async () => {
      const req = { params: { user_id: 1 } };
      const res = mockRes();

      db.Utilizador.destroy.mockResolvedValue(1);

      await apagarUser(req, res, mockNext);
      expect(db.Utilizador.destroy).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('checkUser', () => {
    it('should authenticate and return token for ADMIN', async () => {
      const req = {
        body: { tEmail: 'admin@test.com', passHash: '1234' },
      };
      const res = mockRes();

      const mockUser = {
        user_id: 4,
        perfil: 'ADMIN',
        passwordHash: 'hashed',
      };

      db.Utilizador.findAll.mockResolvedValue([{ dataValues: mockUser }]);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await checkUser(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        msg: 'Admin logado',
        token: 'fake-jwt-token',
        perfil: 'ADMIN',
      }));
    });

    it('should throw error on wrong password', async () => {
      const req = {
        body: { tEmail: 'admin@test.com', passHash: 'wrongpass' },
      };
      const res = mockRes();

      const mockUser = {
        user_id: 4,
        perfil: 'ADMIN',
        passwordHash: 'hashed',
      };

      db.Utilizador.findAll.mockResolvedValue([{ dataValues: mockUser }]);
      bcrypt.compare.mockResolvedValue(false);

      await checkUser(req, res, mockNext);

      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should throw error if user not found', async () => {
      const req = { body: { tEmail: 'none@none.com', passHash: 'x' } };
      const res = mockRes();

      db.Utilizador.findAll.mockResolvedValue([]);

      await checkUser(req, res, mockNext);
      expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
