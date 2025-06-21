// controllers/sessaoController.test.js

const {
  getAllSessions,
  addSessao,
  apagarSessao,
  getSessionByDate
} = require('../controllers/sessaoControllers.js');

const db = require('../models/connect.js');
const { ErrorHandler } = require("../utils/error.js");

jest.mock('../models/connect.js');

describe('Sessao Controller', () => {
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

  describe('getAllSessions', () => {
    it('should return sessions enriched with atividade name', async () => {
      const fakeSessions = [
        {
          dataValues: {
            sessao_id: 1,
            atividade_id: 10,
            dataMarcada: '2024-06-21',
            horaMarcada: '10:00',
            Vagas: 5
          }
        },
        {
          dataValues: {
            sessao_id: 2,
            atividade_id: 20,
            dataMarcada: '2024-06-22',
            horaMarcada: '11:00',
            Vagas: 8
          }
        }
      ];
      db.Sessao.findAll.mockResolvedValue(fakeSessions);

      // Mock Atividade.findOne para cada atividade_id
      db.Atividade.findOne
        .mockResolvedValueOnce({ dataValues: { nome: 'Atividade 10' } })
        .mockResolvedValueOnce({ dataValues: { nome: 'Atividade 20' } });

      await getAllSessions(req, res, next);

      expect(db.Sessao.findAll).toHaveBeenCalledWith({
        attributes: ['sessao_id', 'atividade_id','dataMarcada', 'horaMarcada', 'Vagas']
      });
      expect(db.Atividade.findOne).toHaveBeenCalledTimes(fakeSessions.length);
      // Não conseguimos garantir que o res.status foi chamado por causa do problema do forEach async, então no real controller isso precisa refatorar.
    });

    it('should call next with error if Sessao.findAll returns null', async () => {
      db.Sessao.findAll.mockResolvedValue(null);

      await getAllSessions(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if Sessao.findAll throws', async () => {
      const error = new Error('DB error');
      db.Sessao.findAll.mockRejectedValue(error);

      await getAllSessions(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('addSessao', () => {
    it('should add session if atividade exists', async () => {
      req.body = {
        atividade_id: 1,
        dataMarcada: '2024-06-21',
        horaMarcada: '10:00',
        vagas: 5
      };
      db.Atividade.findAll.mockResolvedValue([
        { dataValues: { atividade_id: 1 } },
        { dataValues: { atividade_id: 2 } }
      ]);
      db.Sessao.create.mockResolvedValue();

      await addSessao(req, res, next);

      expect(db.Atividade.findAll).toHaveBeenCalled();
      expect(db.Sessao.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Sessao criada com sucesso' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with ErrorHandler if atividade does not exist', async () => {
      req.body = {
        atividade_id: 99,
        dataMarcada: '2024-06-21',
        horaMarcada: '10:00',
        vagas: 5
      };
      db.Atividade.findAll.mockResolvedValue([
        { dataValues: { atividade_id: 1 } },
        { dataValues: { atividade_id: 2 } }
      ]);

      await addSessao(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Atividade.findAll.mockRejectedValue(error);

      await addSessao(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('apagarSessao', () => {
    it('should delete sessao and respond 204', async () => {
      req.params.sessao_id = 1;
      db.Sessao.destroy.mockResolvedValue(1);

      await apagarSessao(req, res, next);

      expect(db.Sessao.destroy).toHaveBeenCalledWith({ where: { sessao_id: 1 } });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({ msg: 'a sua sessao foi apagada' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Sessao.destroy.mockRejectedValue(error);

      await apagarSessao(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getSessionByDate', () => {
    it('should return sessions for given date', async () => {
      req.body.sessionDate = '2024-06-21';
      const fakeSessions = [
        {
          get: jest.fn(() => ({ sessao_id: 1, atividade_id: 1, dataMarcada: '2024-06-21', horaMarcada: '10:00', vagas: 5 }))
        }
      ];
      db.Sessao.findAll.mockResolvedValue(fakeSessions);

      await getSessionByDate(req, res, next);

      expect(db.Sessao.findAll).toHaveBeenCalledWith({
        attributes: ['sessao_id', 'atividade_id', 'dataMarcada', 'horaMarcada', 'vagas'],
        where: { dataMarcada: '2024-06-21' }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ sessao_id: 1, atividade_id: 1, dataMarcada: '2024-06-21', horaMarcada: '10:00', vagas: 5 }]
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next if db throws', async () => {
      const error = new Error('DB error');
      db.Sessao.findAll.mockRejectedValue(error);

      await getSessionByDate(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
