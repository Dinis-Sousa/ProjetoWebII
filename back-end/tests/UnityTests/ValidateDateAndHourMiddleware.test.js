const validateDateAndHour = require('../../utils/ValidateDateAndHourMiddleware');
const db = require('../../models/connect.js');

jest.mock('../../models/connect.js');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    return res;
};

describe('validateDateAndHour Middleware', () => {
    let req;
    let res;
    let next;

    beforeEach(() => {
        req = {
            body: {
                atividade_id: 1,
                dataMarcada: '2025-06-25',
                horaMarcada: '10:30:00'
            }
        };
        res = mockRes();
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return 403 if hour is outside 09:00:00 and 18:00:00', async () => {
        req.body.horaMarcada = '08:00:00';
        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Time must be between 09:00:00 and 18:00:00'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if horaMarcada is invalid format', async () => {
        req.body.horaMarcada = 'invalid';
        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Erro interno do servidor ao validar a hora.'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 404 if atividade not found', async () => {
        db.Atividade.findOne.mockResolvedValue(null);
        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Atividade not found'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if dataMarcada is out of range', async () => {
        db.Atividade.findOne.mockResolvedValue({
            dataInicio: '2025-07-01',
            dataFim: '2025-07-10'
        });

        req.body.dataMarcada = '2025-06-25';

        await validateDateAndHour(req, res, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            error: 'Data marcada está fora do intervalo permitido.'
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should call next() if everything is valid', async () => {
        db.Atividade.findOne.mockResolvedValue({
            dataInicio: '2025-06-20',
            dataFim: '2025-06-30'
        });

        req.body.horaMarcada = '10:00:00';
        req.body.dataMarcada = '2025-06-25';

        await validateDateAndHour(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled(); // No error
    });
});
