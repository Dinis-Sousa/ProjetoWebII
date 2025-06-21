const jwt = require('jsonwebtoken');
const { authenticateTokenA, authenticateTokenC } = require('../utils/auth');

jest.mock('jsonwebtoken');

describe('Auth middlewares', () => {
    let req, res, next;

    beforeEach(() => {
        req = {
            headers: {
                authorization: 'Bearer validtoken'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        next = jest.fn();
    });
    describe('authenticateTokenA', () => {
        it('should call next() if user is ADMIN', () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { perfil: 'ADMIN' });
            });

            authenticateTokenA(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user is not ADMIN', () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { perfil: 'ALUNO' });
            });

            authenticateTokenA(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Acesso negado!' });
        });

        it('should return 401 if no token is provided', () => {
            req.headers.authorization = null;

            authenticateTokenA(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied, token missing!' });
        });

        it('should return 403 if jwt verification fails', () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new Error('Invalid token'), null);
            });

            authenticateTokenA(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Token inválido.' });
        });
    });

    describe('authenticateTokenC', () => {
        it('should call next() if user is not ALUNO', () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { perfil: 'DOCENTE' });
            });

            authenticateTokenC(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        it('should return 403 if user is ALUNO', () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(null, { perfil: 'ALUNO' });
            });

            authenticateTokenC(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Acesso negado!' });
        });

        it('should return 401 if no token is provided', () => {
            req.headers.authorization = undefined;

            authenticateTokenC(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: 'Access denied, token missing!' });
        });

        it('should return 403 if jwt verification fails', () => {
            jwt.verify.mockImplementation((token, secret, callback) => {
                callback(new Error('Invalid token'), null);
            });

            authenticateTokenC(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith({ msg: 'Token inválido.' });
        });
    });
});
