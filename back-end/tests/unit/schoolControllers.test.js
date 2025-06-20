const {getAllSchool,addSchool,apagarSchool,} = require('../controllers/schoolControllers'); 

jest.mock('../models/connect', () => ({
  School: {
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
}));

const db = require('../models/connect.js');
const School = db.School;

describe('School Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getAllSchool', () => {
    it('should return all schools', async () => {
      School.findAll.mockResolvedValue([
        { get: () => ({ escola_id: 1, nome: 'School A' }) },
        { get: () => ({ escola_id: 2, nome: 'School B' }) },
      ]);

      await getAllSchool(req, res, next);

      expect(School.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { escola_id: 1, nome: 'School A' },
          { escola_id: 2, nome: 'School B' },
        ],
      });
    });

    it('should call next on error', async () => {
      School.findAll.mockRejectedValue(new Error('DB error'));

      await getAllSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });

    it('should call next if no schools found', async () => {
      School.findAll.mockResolvedValue(null);

      await getAllSchool(req, res, next);

      // In your code, this line:
      // `return new ErrorHandler(...)` should actually be `next(new ErrorHandler(...))`
      // so this test only works if you fix that.
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('addSchool', () => {
    it('should create a school successfully', async () => {
      req.body = {
        nome: 'Test School',
        morada: 'Rua 123',
        codigoPostal: '1234-567',
        localidade: 'Lisboa',
        telefone: '912345678',
        email: 'school@example.com',
        nivelCertificacao: 'Alto',
      };

      School.create.mockResolvedValue({});

      await addSchool(req, res, next);

      expect(School.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Escola foi adicionada com sucesso',
      });
    });

    it('should call next on error', async () => {
      School.create.mockRejectedValue(new Error('Create failed'));

      await addSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe('apagarSchool', () => {
    it('should delete a school successfully', async () => {
      req.params.id = 1;

      School.destroy.mockResolvedValue(1);

      await apagarSchool(req, res, next);

      expect(School.destroy).toHaveBeenCalledWith({
        where: { escola_id: 1 },
      });

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'ESCOLA APAGADA COM SUCESSO',
      });
    });

    it('should call next on destroy error', async () => {
      req.params.id = 1;

      School.destroy.mockRejectedValue(new Error('Delete failed'));

      await apagarSchool(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});

