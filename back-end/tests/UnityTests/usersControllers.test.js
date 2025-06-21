const { getSessaoInscritasByUser, getAllUsers, checkUser, addUser, apagarUser } = require('../../controllers/usersControllers.js');
const db = require('../../models/connect');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../models/connect');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn();
  return res;
};

const next = jest.fn();

describe('User Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSessaoInscritasByUser', () => {
    it('should return session data for a valid user', async () => {
      const req = { params: { id: 1 } };
      const res = mockRes();

      db.Utilizador.findOne.mockResolvedValue({ nome: 'Teste' });
      db.InscritosSessao.findAll.mockResolvedValue([
        { get: () => ({ sessao_id: 101, user_id: 1, presenca: true }) }
      ]);

      await getSessaoInscritasByUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { sessao_id: 101, user_id: 1, presenca: true }
      ]);
    });

    it('should throw 404 if user not found', async () => {
      const req = { params: { id: 999 } };
      db.Utilizador.findOne.mockResolvedValue(null);

      await getSessaoInscritasByUser(req, {}, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const req = {};
      const res = mockRes();
      const mockUsers = [{ nome: 'User1' }, { nome: 'User2' }];

      db.Utilizador.findAll.mockResolvedValue(mockUsers);

      await getAllUsers(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it('should handle no users', async () => {
      const req = {};
      db.Utilizador.findAll.mockResolvedValue(null);

      await getAllUsers(req, {}, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('checkUser', () => {
    it('should login user with correct credentials', async () => {
      const req = {
        body: {
          tEmail: 'test@email.com',
          passHash: 'plainpass'
        }
      };
      const res = mockRes();

      db.Utilizador.findAll.mockResolvedValue([
        {
          dataValues: {
            user_id: 1,
            perfil: 'ALUNO',
            passwordHash: 'hashed'
          }
        }
      ]);

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('fake-jwt-token');

      await checkUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Aluno logado',
        token: 'fake-jwt-token'
      });
    });

    it('should reject login with incorrect password', async () => {
      const req = {
        body: {
          tEmail: 'wrong@email.com',
          passHash: 'wrongpass'
        }
      };

      db.Utilizador.findAll.mockResolvedValue([
        {
          dataValues: {
            passwordHash: 'hashed'
          }
        }
      ]);

      bcrypt.compare.mockResolvedValue(false);

      await checkUser(req, {}, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('addUser', () => {
    it('should create a user', async () => {
      const req = {
        body: {
          escola_id: 1,
          nome: 'Test User',
          email: 'test@email.com',
          passwordHash: 'plainpass'
        }
      };
      const res = mockRes();

      bcrypt.hash.mockResolvedValue('hashedpass');
      db.Utilizador.create = jest.fn().mockResolvedValue({});

      await addUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Utilizador criado com sucesso!' });
    });
  });

  describe('apagarUser', () => {
    it('should delete a user', async () => {
      const req = { params: { user_id: 1 } };
      const res = mockRes();

      db.Utilizador.destroy = jest.fn().mockResolvedValue(1);

      await apagarUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });
  });

});
