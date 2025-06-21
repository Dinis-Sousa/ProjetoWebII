// tests/validateDateMiddleware.test.js
const validateDateMiddleware = require('../utils/validateDateMiddleware.js'); // ajuste o caminho

describe('validateDateMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if dataInicio is missing', () => {
    req.body = { dataFim: '2025-06-22' };

    validateDateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing starting date field.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if dataFim is missing', () => {
    req.body = { dataInicio: '2025-06-21' };

    validateDateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing ending date field.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if dataInicio is invalid format', () => {
    req.body = { dataInicio: 'invalid-date', dataFim: '2025-06-22' };

    validateDateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if dataInicio is before today', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yStr = yesterday.toISOString().slice(0, 10);

    req.body = { dataInicio: yStr, dataFim: '2100-01-01' };

    validateDateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'The starting date must be a possible date!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if dataFim is before dataInicio', () => {
    req.body = { dataInicio: '2025-06-22', dataFim: '2025-06-21' };

    validateDateMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Ending date needs to be later than the starting date!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if dates are valid', () => {
    req.body = { dataInicio: '2100-06-21', dataFim: '2100-06-22' };

    validateDateMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
