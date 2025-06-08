const {
    getAllAtividades,
    addAtividade,
    alterarEstado,
    apagarAtividade,
    getSessionsByAtivity
} = require('../controllers/atividadeControllers.js');

const db = require('../models/connect');
const { ErrorHandler } = require('../utils/error');

jest.mock('../models/connect');

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

    // ✅ getAllAtividades
    describe('getAllAtividades', () => {
        it('should return atividades', async () => {
            const atividades = [{ atividade_id: 1, nome: 'Atividade Teste' }];
            db.Atividade.findAll.mockResolvedValue(atividades);

            await getAllAtividades(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: atividades });
        });

        it('should call next if no atividades exist', async () => {
            db.Atividade.findAll.mockResolvedValue([]); // empty list

            await getAllAtividades(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
            const err = next.mock.calls[0][0];
            expect(err.message).toBe('Atividade nao existem!');
        });
    });

    // ✅ addAtividade
    describe('addAtividade', () => {
        it('should create an atividade successfully', async () => {
            req.body = {
                nome: "Nova Atividade",
                descricao: "Desc",
                dataInicio: "2025-01-01",
                dataFim: "2025-01-10"
            };

            db.Atividade.create.mockResolvedValue({});

            await addAtividade(req, res, next);

            expect(db.Atividade.create).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ msg: "atividade criada com sucesso" });
        });
    });

    // ✅ apagarAtividade
    describe('apagarAtividade', () => {
        it('should delete atividade successfully', async () => {
            req.body = { atividade_id: 123 };

            db.Atividade.destroy.mockResolvedValue(1); // simulate deletion

            await apagarAtividade(req, res, next);

            expect(db.Atividade.destroy).toHaveBeenCalledWith({
                where: { atividade_id: 123 }
            });
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'Atividade apagada com sucesso'
            });
        });
    });

    // ✅ alterarEstado
    describe('alterarEstado', () => {
        it('should update atividade estado', async () => {
            req.params = { atividade_id: 1 };
            req.body = { estado: 'ativo' };

            const mockAtividade = {
                estado: 'inativo',
                save: jest.fn().mockResolvedValue()
            };

            db.Atividade.findOne.mockResolvedValue(mockAtividade);

            await alterarEstado(req, res, next);

            expect(mockAtividade.estado).toBe('ativo');
            expect(mockAtividade.save).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                msg: 'estado atulizado',
                estado: 'ativo'
            });
        });

        it('should call next if atividade not found', async () => {
            req.params = { atividade_id: 999 };
            req.body = { estado: 'ativo' };

            db.Atividade.findOne.mockResolvedValue(null);

            await alterarEstado(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
            const err = next.mock.calls[0][0];
            expect(err.message).toBe('Nao foi encontrada a atividade desejada!');
        });
    });

    // ✅ getSessionsByAtivity
    describe('getSessionsByAtivity', () => {
        it('should return sessions of an atividade', async () => {
            req.params = { id: 5 };

            const mockSessions = [
                { sessao_id: 1, atividade_id: 5, dataMarcada: '2025-07-01', horaMarcada: '10:00', vagas: 20 }
            ];

            db.Sessao.findAll.mockResolvedValue(mockSessions);

            await getSessionsByAtivity(req, res, next);

            expect(db.Sessao.findAll).toHaveBeenCalledWith({
                attributes: ['sessao_id', 'atividade_id', 'dataMarcada', 'horaMarcada', 'vagas'],
                where: { atividade_id: 5 }
            });

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ data: mockSessions });
        });

        it('should call next if no sessions found', async () => {
            req.params = { id: 8 };

            db.Sessao.findAll.mockResolvedValue([]); // simulate no sessions

            await getSessionsByAtivity(req, res, next);

            expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
            const err = next.mock.calls[0][0];
            expect(err.message).toBe('nao foram encontradas sessões desta Atividade');
        });
    });
});

