// controllers/atividadeController.test.js

const {
  getAllAtividades,
  addAtividade,
  alterarEstado,
  apagarAtividade,
  getSessionsByAtivity,
  getAtivityNameById
} = require('../../controllers/atividadeControllers.js');

const db = require('../../models/connect.js');
const { ErrorHandler } = require("../../utils/error.js");

jest.mock('../../models/connect.js');

describe('Atividade Controller', () => {
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

  describe('getAllAtividades', () => {
    it('should return all atividades', async () => {
      db.Atividade.findAll.mockResolvedValue([
        { atividade_id: 1, nome: 'Teste', descricao: 'desc', dataInicio: '2024-01-01', dataFim: '2024-01-02', estado: 'ativo' }
      ]);

      await getAllAtividades(req, res, next);

      expect(db.Atividade.findAll).toHaveBeenCalledWith({
        attributes: ['atividade_id', 'area_id', 'nome', 'descricao', 'dataInicio', 'dataFim', 'estado']
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.any(Array));
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if no atividades found', async () => {
      db.Atividade.findAll.mockResolvedValue([]);

      await getAllAtividades(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Atividade.findAll.mockRejectedValue(error);

      await getAllAtividades(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addAtividade', () => {
    it('should create atividade and respond 201', async () => {
      req.body = {
        nome: 'nova',
        descricao: 'desc',
        area_id: 1,
        dataInicio: '2024-01-01',
        dataFim: '2024-01-02',
        estado: 'ativo'
      };

      db.Atividade.create.mockResolvedValue();

      await addAtividade(req, res, next);

      expect(db.Atividade.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: "atividade criada com sucesso" });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Atividade.create.mockRejectedValue(error);

      await addAtividade(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('alterarEstado', () => {
    it('should update estado and respond 200', async () => {
      req.params.atividade_id = 1;
      req.body = { estado: 'inativo' };

      const fakeAtividade = {
        estado: 'ativo',
        save: jest.fn().mockResolvedValue()
      };

      db.Atividade.findOne.mockResolvedValue(fakeAtividade);

      await alterarEstado(req, res, next);

      expect(db.Atividade.findOne).toHaveBeenCalledWith({ where: { atividade_id: 1 } });
      expect(fakeAtividade.estado).toBe('inativo');
      expect(fakeAtividade.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        msg: "estado atulizado",
        estado: 'inativo'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if atividade not found', async () => {
      req.params.atividade_id = 1;
      req.body = { estado: 'inativo' };

      db.Atividade.findOne.mockResolvedValue(null);

      await alterarEstado(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Atividade.findOne.mockRejectedValue(error);

      await alterarEstado(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('apagarAtividade', () => {
    it('should delete atividade and respond 204', async () => {
      req.params.id = 1;
      db.Atividade.destroy.mockResolvedValue(1);

      await apagarAtividade(req, res, next);

      expect(db.Atividade.destroy).toHaveBeenCalledWith({ where: { atividade_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Atividade apagada com sucesso' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Atividade.destroy.mockRejectedValue(error);

      await apagarAtividade(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSessionsByAtivity', () => {
    it('should return sessions for given atividade_id', async () => {
      req.params.id = 1;
      const fakeSessions = [
        { sessao_id: 1, atividade_id: 1, dataMarcada: '2024-01-01', horaMarcada: '10:00', vagas: 10 }
      ];
      db.Sessao.findAll.mockResolvedValue(fakeSessions);

      await getSessionsByAtivity(req, res, next);

      expect(db.Sessao.findAll).toHaveBeenCalledWith({
        attributes: ['sessao_id', 'atividade_id', 'dataMarcada', 'horaMarcada', 'vagas'],
        where: { atividade_id: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: fakeSessions });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if no sessions found', async () => {
      req.params.id = 1;
      db.Sessao.findAll.mockResolvedValue(null);

      await getSessionsByAtivity(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Sessao.findAll.mockRejectedValue(error);

      await getSessionsByAtivity(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getAtivityNameById', () => {
    it('should return atividade nome by id', async () => {
      req.params.atividade_id = 1;
      const fakeAtividade = { nome: 'Teste Atividade' };

      db.Atividade.findOne.mockResolvedValue(fakeAtividade);

      await getAtivityNameById(req, res, next);

      expect(db.Atividade.findOne).toHaveBeenCalledWith({
        attributes: ['nome'],
        where: { atividade_id: 1 }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeAtividade);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if atividade not found', async () => {
      req.params.atividade_id = 1;

      db.Atividade.findOne.mockResolvedValue(null);

      await getAtivityNameById(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Atividade.findOne.mockRejectedValue(error);

      await getAtivityNameById(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
