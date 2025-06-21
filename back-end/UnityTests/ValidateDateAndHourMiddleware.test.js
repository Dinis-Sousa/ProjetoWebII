const validateDateAndHour = require('../utils/ValidateDateAndHourMiddleware.js');
const db = require('../models/connect');

jest.mock('../models/connect');

describe('validateDateAndHour Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            body: {
                atividade_id: 1,
                dataMarcada: '2025-06-25',
                horaMarcada: '10:00:00'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });

    it('should call next() for valid date and time', async () => {
        db.Atividade.findOne.mockResolvedValue({
            dataInicio: '2025-06-20',
            dataFim: '2025-06-30'
        });

        await validateDateAndHour(req, res, next);

        expect(next).toHaveBeenCalled();
    });

    it('should return 403 if time is before 09:00:00', async () => {
        req.body.horaMarcada = '08:59:59';

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Time must be between 09:00:00 and 18:00:00'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if time is after 18:00:00', async () => {
        req.body.horaMarcada = '18:00:01';

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Time must be between 09:00:00 and 18:00:00'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if activity is not found', async () => {
        db.Atividade.findOne.mockResolvedValue(null);

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Atividade not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if date is outside the range', async () => {
        req.body.dataMarcada = '2025-07-01';
        db.Atividade.findOne.mockResolvedValue({
            dataInicio: '2025-06-20',
            dataFim: '2025-06-30'
        });

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Data marcada está fora do intervalo permitido.'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if Atividade.findOne throws an error', async () => {
        db.Atividade.findOne.mockRejectedValue(new Error('DB error'));

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Erro interno do servidor ao validar datas.'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if horaMarcada is invalid format', async () => {
        req.body.horaMarcada = 'invalid-time';

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Erro interno do servidor ao validar a hora.'
        });
        expect(next).not.toHaveBeenCalled();
    });
});
