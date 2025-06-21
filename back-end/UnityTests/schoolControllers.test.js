// controllers/schoolController.test.js

const { getAllSchool, addSchool, apagarSchool } = require('../controllers/schoolControllers.js');
const db = require('../models/connect');
const { ErrorHandler } = require('../utils/error');

jest.mock('../models/connect');

describe('School Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllSchool', () => {
    it('should return all schools with status 200', async () => {
      const fakeSchools = [{ escola_id: 1, nome: 'School A' }, { escola_id: 2, nome: 'School B' }];
      db.School.findAll.mockResolvedValue(fakeSchools);

      await getAllSchool(req, res, next);

      expect(db.School.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeSchools);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if no schools found', async () => {
      db.School.findAll.mockResolvedValue(null);

      await getAllSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if findAll throws', async () => {
      const error = new Error('DB error');
      db.School.findAll.mockRejectedValue(error);

      await getAllSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addSchool', () => {
    it('should add a new school and respond with 201', async () => {
      req.body = {
        nome: 'Escola X',
        morada: 'Rua Y',
        codigoPostal: '12345',
        localidade: 'Cidade Z',
        telefone: '999999999',
        email: 'contato@escola.com',
        nivelCertificacao: 'Nível 1'
      };
      db.School.create.mockResolvedValue();

      await addSchool(req, res, next);

      expect(db.School.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Escola foi adicionada com sucesso' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if create throws', async () => {
      const error = new Error('DB error');
      db.School.create.mockRejectedValue(error);

      await addSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('apagarSchool', () => {
    it('should delete a school and respond with 204', async () => {
      req.params.escola_id = 5;
      db.School.destroy.mockResolvedValue(1);

      await apagarSchool(req, res, next);

      expect(db.School.destroy).toHaveBeenCalledWith({ where: { escola_id: 5 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ msg: 'ESCOLA APAGADA COM SUCESSO' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if destroy throws', async () => {
      const error = new Error('DB error');
      db.School.destroy.mockRejectedValue(error);

      await apagarSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
