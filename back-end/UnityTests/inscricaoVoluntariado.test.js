const { inscrever, removerInscricao, marcarPresenca, getTheRegistration, listOfUsersBySession } = require('../controllers/inscricaoVoluntariado.controllers.js');
const db = require('../models/connect.js');
const { ErrorHandler } = require('../utils/error.js');

jest.mock('../models/connect');

describe('inscrever', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                user_id: 1,
                sessao_id: 10
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        // Mock Utilizador.findOne
        db.Utilizador.findOne = jest.fn();
        // Mock Sessao.findOne
        db.Sessao.findOne = jest.fn();
        // Mock InscritosSessao.create
        db.InscritosSessao.create = jest.fn();
    });

    it('deve inscrever um utilizador com sucesso', async () => {
        db.Utilizador.findOne.mockResolvedValue({ dataValues: { nome: 'João' } });
        db.Sessao.findOne.mockResolvedValue({
            vagas: 5,
            save: jest.fn()
        });
        db.InscritosSessao.create.mockResolvedValue({});

        await inscrever(req, res, next);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'o user João está inscrito nesta sessao!'
        });
    });

    it('deve retornar erro se o utilizador não existir', async () => {
        db.Utilizador.findOne.mockResolvedValue(null);

        await inscrever(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
        expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('deve retornar erro se não houver vagas disponíveis', async () => {
        db.Utilizador.findOne.mockResolvedValue({ dataValues: { nome: 'João' } });
        db.Sessao.findOne.mockResolvedValue({
            vagas: 0,
            save: jest.fn()
        });

        await inscrever(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
        expect(next.mock.calls[0][0].statusCode).toBe(400);
    });

    it('deve chamar next com erro se houver exceção', async () => {
        db.Utilizador.findOne.mockRejectedValue(new Error('DB Error'));

        await inscrever(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
    describe('removerInscricao', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                user_id: 1,
                sessao_id: 10
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        // Mocks dos métodos usados
        db.InscritosSessao.findOne = jest.fn();
        db.InscritosSessao.destroy = jest.fn();
        db.Sessao.findOne = jest.fn();
    });

    it('deve remover a inscrição e aumentar vagas com sucesso', async () => {
        const mockSessao = {
            vagas: 2,
            save: jest.fn()
        };

        db.InscritosSessao.findOne.mockResolvedValue({}); // Inscrição existe
        db.InscritosSessao.destroy.mockResolvedValue(1); // Remoção bem-sucedida
        db.Sessao.findOne.mockResolvedValue(mockSessao);

        await removerInscricao(req, res, next);

        expect(db.InscritosSessao.destroy).toHaveBeenCalledWith({
            where: {
                sessao_id: 10,
                user_id: 1
            }
        });
        expect(mockSessao.vagas).toBe(3);
        expect(mockSessao.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Inscrição do user removida!'
        });
    });

    it('deve retornar erro se a inscrição não existir', async () => {
        db.InscritosSessao.findOne.mockResolvedValue(null);

        await removerInscricao(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
        expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('deve chamar next em caso de erro inesperado', async () => {
        db.InscritosSessao.findOne.mockRejectedValue(new Error('DB failure'));

        await removerInscricao(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
    });
    describe('marcarPresenca', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                user_id: 1,
                sessao_id: 10
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        db.InscritosSessao.findOne = jest.fn();
    });

    it('deve alternar a presença de false para true', async () => {
        const inscricaoMock = {
            presenca: false,
            save: jest.fn()
        };

        db.InscritosSessao.findOne.mockResolvedValue(inscricaoMock);

        await marcarPresenca(req, res, next);

        expect(inscricaoMock.presenca).toBe(true);
        expect(inscricaoMock.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Presença atualizada",
            presenca: true
        });
    });

    it('deve alternar a presença de true para false', async () => {
        const inscricaoMock = {
            presenca: true,
            save: jest.fn()
        };

        db.InscritosSessao.findOne.mockResolvedValue(inscricaoMock);

        await marcarPresenca(req, res, next);

        expect(inscricaoMock.presenca).toBe(false);
        expect(inscricaoMock.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            msg: "Presença atualizada",
            presenca: false
        });
    });

    it('deve retornar erro se inscrição não for encontrada', async () => {
        db.InscritosSessao.findOne.mockResolvedValue(null);

        await marcarPresenca(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
        expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('deve passar erro ao next em caso de exceção', async () => {
        db.InscritosSessao.findOne.mockRejectedValue(new Error('Erro interno'));

        await marcarPresenca(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
describe('getTheRegistration', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                user_id: 1,
                sessao_id: 10
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        db.InscritosSessao.findOne = jest.fn();
    });

    it('deve retornar a inscrição se existir', async () => {
        const mockInscricao = { user_id: 1, sessao_id: 10, presenca: false };

        db.InscritosSessao.findOne.mockResolvedValue(mockInscricao);

        await getTheRegistration(req, res, next);

        expect(db.InscritosSessao.findOne).toHaveBeenCalledWith({
            where: {
                sessao_id: 10,
                user_id: 1
            }
        });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockInscricao);
    });

    it('deve retornar null se não encontrar inscrição', async () => {
        db.InscritosSessao.findOne.mockResolvedValue(null);

        await getTheRegistration(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(null);
    });

    it('deve passar o erro para o next em caso de exceção', async () => {
        db.InscritosSessao.findOne.mockRejectedValue(new Error('DB error'));

        await getTheRegistration(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
describe('listOfUsersBySession', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            params: {
                sessao_id: 10
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();

        db.InscritosSessao.findAll = jest.fn();
        db.Utilizador.findOne = jest.fn();
    });

    it('deve retornar lista de utilizadores com nome e presença', async () => {
        const inscritosMock = [
            { user_id: 1, presenca: true },
            { user_id: 2, presenca: false }
        ];

        const utilizadoresMock = {
            1: { nome: 'João' },
            2: { nome: 'Maria' }
        };

        db.InscritosSessao.findAll.mockResolvedValue(inscritosMock);
        db.Utilizador.findOne
            .mockImplementation(({ where }) => Promise.resolve(utilizadoresMock[where.user_id]));

        await listOfUsersBySession(req, res, next);

        expect(db.InscritosSessao.findAll).toHaveBeenCalledWith({
            attributes: ['user_id', 'presenca'],
            where: {
                sessao_id: 10
            }
        });

        expect(db.Utilizador.findOne).toHaveBeenCalledTimes(2);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([
            { user_id: 1, nome: 'João', presenca: true },
            { user_id: 2, nome: 'Maria', presenca: false }
        ]);
    });

    it('deve lançar erro 404 se não houver usuários inscritos', async () => {
        db.InscritosSessao.findAll.mockResolvedValue([]);

        await listOfUsersBySession(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(ErrorHandler));
        expect(next.mock.calls[0][0].statusCode).toBe(404);
    });

    it('deve propagar erro ao next se falhar durante a execução', async () => {
        db.InscritosSessao.findAll.mockRejectedValue(new Error('DB error'));

        await listOfUsersBySession(req, res, next);

        expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
});
});
