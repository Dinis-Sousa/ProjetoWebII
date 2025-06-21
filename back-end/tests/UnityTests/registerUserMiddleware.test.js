const RegisterMiddleware = require('../../utils/RegisterUserMiddleware.js');
const db = require('../../models/connect');

jest.mock('../../models/connect');

describe('RegisterMiddleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                email: 'teste@gmail.com'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();

        db.Utilizador = {
            findOne: jest.fn()
        };
    });

    it('deve permitir o registo se o email for válido e não existir', async () => {
        db.Utilizador.findOne.mockResolvedValue(null);

        await RegisterMiddleware(req, res, next);

        expect(db.Utilizador.findOne).toHaveBeenCalledWith({
            attributes: ['email'],
            where: { email: 'teste@gmail.com' }
        });
        expect(next).toHaveBeenCalled();
    });

    it('deve rejeitar se o email estiver ausente', async () => {
        req.body.email = '';

        await RegisterMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Tem de utilizar um email!'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve rejeitar se o email não terminar com @gmail.com', async () => {
        req.body.email = 'teste@yahoo.com';

        await RegisterMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Tem de utilizar um email!'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve rejeitar se o utilizador já existir', async () => {
        db.Utilizador.findOne.mockResolvedValue({ email: 'teste@gmail.com' });

        await RegisterMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            msg: 'Já existe uma conta associada a esse email!'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('deve retornar erro 500 em caso de erro interno', async () => {
        db.Utilizador.findOne.mockRejectedValue(new Error('Erro de BD'));

        await RegisterMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Erro interno do servidor ao validar o email inserido.'
        });
        expect(next).not.toHaveBeenCalled();
    });
});
