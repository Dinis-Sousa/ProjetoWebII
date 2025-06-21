const { request, db } = require('../setup');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Mock data for testing
const testUser = {
  escola_id: 1,
  nome: 'Test User',
  email: 'test@example.com',
  passwordHash: 'hashedpassword123',
  perfil: 'ALUNO',
  pontos: 0
};

// Clean up database before and after tests
beforeAll(async () => {
  // Clear users table or create test data
  await db.Utilizador.destroy({ where: {} });
});

afterAll(async () => {
  // Clean up after tests
  await db.Utilizador.destroy({ where: {} });
});

describe('User API Integration Tests', () => {
  let userId;
  let authToken;

  // Test user creation
  test('Should create a new user', async () => {
    const response = await request
      .post('/users')
      .send({
        escola_id: testUser.escola_id,
        nome: testUser.nome,
        email: testUser.email,
        passwordHash: testUser.passwordHash
      });

    expect(response.status).toBe(201);
    expect(response.body.msg).toBe('Utilizador criado com sucesso!');

    // Verify user was created in database
    const createdUser = await db.Utilizador.findOne({ where: { email: testUser.email } });
    expect(createdUser).not.toBeNull();
    userId = createdUser.user_id;
  });

  // Test user authentication
  test('Should authenticate a user and return JWT token', async () => {
    const response = await request
      .post('/users/login')
      .send({
        tEmail: testUser.email,
        passHash: testUser.passwordHash
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body.msg).toBe('Aluno logado');

    authToken = response.body.token;

    // Verify token is valid
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
    expect(decoded).toHaveProperty('user_id');
    expect(decoded).toHaveProperty('perfil');
  });

  // Test get all users
  test('Should get all users', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    const foundUser = response.body.find(user => user.email === testUser.email);
    expect(foundUser).toBeDefined();
  });

  // Test get sessions by user
  test('Should get sessions for a user', async () => {
    const response = await request
      .get(`/users/${userId}/sessions`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test delete user
  test('Should delete a user', async () => {
    const response = await request
      .delete(`/users/${userId}`)
      .set('Authorization', `Bearer ${authToken}`);

    expect(response.status).toBe(204);

    // Verify user was deleted
    const deletedUser = await db.Utilizador.findOne({ where: { user_id: userId } });
    expect(deletedUser).toBeNull();
  });

  // Test authentication with invalid credentials
  test('Should reject invalid credentials', async () => {
    const response = await request
      .post('/users/login')
      .send({
        tEmail: 'nonexistent@example.com',
        passHash: 'wrongpassword'
      });

    expect(response.status).toBe(400);
  });
});
