// tests/authMiddleware.test.js
const jwt = require('jsonwebtoken');
const { authenticateTokenC, authenticateTokenA } = require('../../utils/auth.js');
require('dotenv').config();

describe('Middleware de autenticação', () => {
  const mockRequest = (token, perfil) => ({
    headers: { authorization: token ? `Bearer ${token}` : undefined },
    user: { perfil }
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('authenticateTokenC', () => {
    it('deve retornar 401 se o token estiver ausente', () => {
      const req = mockRequest(null);
      const res = mockResponse();

      authenticateTokenC(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied, token missing!' });
    });

    it('deve retornar 403 se o token for inválido', () => {
      const req = mockRequest('token_invalido');
      const res = mockResponse();

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        callback(new Error('Token inválido'), null);
      });

      authenticateTokenC(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Token inválido.' });
    });

    it('deve retornar 403 se o perfil for ALUNO', () => {
      const req = mockRequest('token_valido', 'ALUNO');
      const res = mockResponse();

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        req.user = { perfil: 'ALUNO' }; // Simula req.user preenchido no middleware
        callback(null, req.user);
      });

      authenticateTokenC(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Acesso negado!' });
    });

    it('deve chamar next se o token for válido e o perfil não for ALUNO', () => {
      const req = mockRequest('token_valido', 'PROFESSOR');
      const res = mockResponse();

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        req.user = { perfil: 'PROFESSOR' };
        callback(null, req.user);
      });

      authenticateTokenC(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('authenticateTokenA', () => {
    it('deve retornar 401 se o token estiver ausente', () => {
      const req = mockRequest(null);
      const res = mockResponse();

      authenticateTokenA(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access denied, token missing!' });
    });

    it('deve retornar 403 se o token for inválido', () => {
      const req = mockRequest('token_invalido');
      const res = mockResponse();

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        callback(new Error('Token inválido'), null);
      });

      authenticateTokenA(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Token inválido.' });
    });

    it('deve retornar 403 se o perfil não for ADMIN', () => {
      const req = mockRequest('token_valido', 'ALUNO');
      const res = mockResponse();

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        req.user = { perfil: 'ALUNO' };
        callback(null, req.user);
      });

      authenticateTokenA(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Acesso negado!' });
    });

    it('deve chamar next se o token for válido e perfil ADMIN', () => {
      const req = mockRequest('token_valido', 'ADMIN');
      const res = mockResponse();

      jest.spyOn(jwt, 'verify').mockImplementation((token, secret, callback) => {
        req.user = { perfil: 'ADMIN' };
        callback(null, req.user);
      });

      authenticateTokenA(req, res, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });
  });
});
