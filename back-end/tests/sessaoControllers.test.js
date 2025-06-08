// sessionsController.test.js

const {
  getAllSessions,
  addSessao,
  apagarSessao,
  getSessionByDate,
} = require('../controllers/sessaoControllers.js'); // Adjust the path

jest.mock('../models/connect.js', () => ({
  Sessao: {
    findAll: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
  },
  Atividade: {
    findOne: jest.fn(),
  },
}));

const db = require('../models/connect.js');
const Sessao = db.Sessao;
const Atividade = db.Atividade;

describe('Session Controller', () => {
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

  describe('getAllSessions', () => {
    it('should return all sessions', async () => {
      Sessao.findAll.mockResolvedValue([
        { get: () => ({ sessao_id: 1, dataMarcada: '2025-06-10' }) },
        { get: () => ({ sessao_id: 2, dataMarcada: '2025-06-11' }) },
      ]);

      await getAllSessions(req, res, next);

      expect(Sessao.findAll).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [
          { sessao_id: 1, dataMarcada: '2025-06-10' },
          { sessao_id: 2, dataMarcada: '2025-06-11' },
        ],
      });
    });

    it('should call next with error if sessions not found', async () => {
      Sessao.findAll.mockResolvedValue(null);
      await getAllSessions(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('addSessao', () => {
    it('should create a session successfully', async () => {
      req.body = {
        nome: 'Yoga',
        dataMarcada: '2025-06-20',
        horaMarcada: '10:00',
        vagas: 20,
      };

      Atividade.findOne.mockResolvedValue({ dataValues: { atividade_id: 5 } });
      Sessao.create.mockResolvedValue({});

      await addSessao(req, res, next);

      expect(Atividade.findOne).toHaveBeenCalledWith({
        attributes: ['atividade_id'],
        where: { nome: 'Yoga' },
      });

      expect(Sessao.create).toHaveBeenCalledWith({
        atividade_id: 5,
        dataMarcada: '2025-06-20',
        horaMarcada: '10:00',
        vagas: 20,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'Sessao criada com sucesso',
      });
    });

    it('should call next if activity not found', async () => {
      req.body = { nome: 'UnknownActivity' };
      Atividade.findOne.mockResolvedValue(null);

      await addSessao(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should call next on Sessao.create error', async () => {
      req.body = {
        nome: 'Yoga',
        dataMarcada: '2025-06-20',
        horaMarcada: '10:00',
        vagas: 20,
      };

      Atividade.findOne.mockResolvedValue({ dataValues: { atividade_id: 1 } });
      Sessao.create.mockRejectedValue(new Error('Failed'));

      await addSessao(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('apagarSessao', () => {
    it('should delete a session', async () => {
      req.params.id = 3;

      Sessao.destroy.mockResolvedValue(1);

      await apagarSessao(req, res, next);

      expect(Sessao.destroy).toHaveBeenCalledWith({
        where: { sessao_id: 3 },
      });

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.json).toHaveBeenCalledWith({
        msg: 'a sua sessao foi apagada',
      });
    });

    it('should call next on destroy error', async () => {
      req.params.id = 3;
      Sessao.destroy.mockRejectedValue(new Error('Deletion error'));

      await apagarSessao(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('getSessionByDate', () => {
    it('should return sessions for given date', async () => {
      req.body.sessionDate = '2025-06-20';

      Sessao.findAll.mockResolvedValue([
        { get: () => ({ sessao_id: 1, dataMarcada: '2025-06-20' }) },
      ]);

      await getSessionByDate(req, res, next);

      expect(Sessao.findAll).toHaveBeenCalledWith({
        attributes: ['sessao_id', 'atividade_id', 'dataMarcada', 'horaMarcada', 'vagas'],
        where: { dataMarcada: '2025-06-20' },
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        data: [{ sessao_id: 1, dataMarcada: '2025-06-20' }],
      });
    });

    it('should call next on DB error', async () => {
      req.body.sessionDate = '2025-06-20';
      Sessao.findAll.mockRejectedValue(new Error('DB error'));

      await getSessionByDate(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
