// tests/AddSchoolMiddleware.test.js
const AddSchoolMiddleware = require('../../utils/ValidateAddSchoolMiddleware'); // ajuste caminho

describe('AddSchoolMiddleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 400 if telefone is missing', () => {
    req.body = { email: 'test@test.com', codigoPostal: '1234-567' };

    AddSchoolMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Número de telemóvel inválido!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if telefone is invalid', () => {
    req.body = { telefone: '12345678', email: 'test@test.com', codigoPostal: '1234-567' };

    AddSchoolMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Número de telemóvel inválido!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email is missing', () => {
    req.body = { telefone: '912345678', codigoPostal: '1234-567' };

    AddSchoolMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email inválido!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if email is invalid', () => {
    req.body = { telefone: '912345678', email: 'invalid-email', codigoPostal: '1234-567' };

    AddSchoolMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email inválido!' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if codigoPostal is missing', () => {
    req.body = { telefone: '912345678', email: 'test@test.com' };

    AddSchoolMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Código postal inválido! Use o formato 1234-567.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 400 if codigoPostal is invalid', () => {
    req.body = { telefone: '912345678', email: 'test@test.com', codigoPostal: '1234567' };

    AddSchoolMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Código postal inválido! Use o formato 1234-567.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if all fields are valid', () => {
    req.body = { telefone: '912345678', email: 'test@test.com', codigoPostal: '1234-567' };

    AddSchoolMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
