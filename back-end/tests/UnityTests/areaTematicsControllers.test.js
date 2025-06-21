// tests/areaController.test.js

const {
  getAllAreas,
  getAtivitiesByArea,
  deleteArea,
  addArea,
  getSpecificArea,
} = require('../../controllers/areaTematicsControllers'); // ajuste o caminho se necessário

const db = require('../../models/connect');
const { ErrorHandler } = require('../../utils/error');

jest.mock('../../models/connect');

describe('Area Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllAreas', () => {
    it('should return areas with status 200', async () => {
      const fakeAreas = [
        { area_id: 1, nome: 'Area 1', descricao: 'desc1' },
        { area_id: 2, nome: 'Area 2', descricao: 'desc2' },
      ];
      db.Area.findAll.mockResolvedValue(fakeAreas);

      await getAllAreas(req, res, next);

      expect(db.Area.findAll).toHaveBeenCalledWith({
        attributes: ['area_id', 'nome', 'descricao'],
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeAreas);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if no areas found', async () => {
      db.Area.findAll.mockResolvedValue(null);

      await getAllAreas(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if findAll throws', async () => {
      const error = new Error('DB error');
      db.Area.findAll.mockRejectedValue(error);

      await getAllAreas(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSpecificArea', () => {
    it('should return specific area with status 200', async () => {
      const fakeArea = { area_id: 1, nome: 'Area 1', descricao: 'desc1' };
      req.params.area_id = 1;
      db.Area.findByPk.mockResolvedValue(fakeArea);

      await getSpecificArea(req, res, next);

      expect(db.Area.findByPk).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeArea);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if area not found', async () => {
      req.params.area_id = 999;
      db.Area.findByPk.mockResolvedValue(null);

      await getSpecificArea(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if findByPk throws', async () => {
      const error = new Error('DB error');
      req.params.area_id = 1;
      db.Area.findByPk.mockRejectedValue(error);

      await getSpecificArea(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAtivitiesByArea', () => {
    it('should return atividades with status 200', async () => {
      req.params.id = 1;
      const fakeAtividades = [
        {
          nome: 'Atividade 1',
          get: () => ({ nome: 'Atividade 1' }),
        },
        {
          nome: 'Atividade 2',
          get: () => ({ nome: 'Atividade 2' }),
        },
      ];
      db.Atividade.findAll.mockResolvedValue(fakeAtividades);

      await getAtivitiesByArea(req, res, next);

      expect(db.Atividade.findAll).toHaveBeenCalledWith({
        attributes: ['nome'],
        where: { area_id: 1 },
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: fakeAtividades.map((a) => a.get()),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if no atividades found', async () => {
      req.params.id = 1;
      db.Atividade.findAll.mockResolvedValue(null);

      await getAtivitiesByArea(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if findAll throws', async () => {
      const error = new Error('DB error');
      req.params.id = 1;
      db.Atividade.findAll.mockRejectedValue(error);

      await getAtivitiesByArea(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteArea', () => {
    it('should delete area and respond with 204', async () => {
      req.params.area_id = 1;
      db.Area.destroy.mockResolvedValue(1);

      await deleteArea(req, res, next);

      expect(db.Area.destroy).toHaveBeenCalledWith({ where: { area_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'area eliminada com sucesso',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if destroy throws', async () => {
      const error = new Error('DB error');
      req.params.area_id = 1;
      db.Area.destroy.mockRejectedValue(error);

      await deleteArea(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addArea', () => {
    it('should add a new area and respond with 201', async () => {
      req.body = { nome: 'Nova Area', descricao: 'Descricao da area' };
      db.Area.create.mockResolvedValue();

      await addArea(req, res, next);

      expect(db.Area.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Area criada com sucesso' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if nome is missing', async () => {
      req.body = { descricao: 'desc' };

      await addArea(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
      expect(db.Area.create).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if descricao is missing', async () => {
      req.body = { nome: 'nome' };

      await addArea(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
      expect(db.Area.create).not.toHaveBeenCalled();
    });

    it('should call next if create throws', async () => {
      const error = new Error('DB error');
      req.body = { nome: 'nome', descricao: 'desc' };
      db.Area.create.mockRejectedValue(error);

      await addArea(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
