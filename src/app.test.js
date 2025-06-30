const request = require('supertest');
const app = require('./app');

describe('User Controller', () => {
  describe('POST /api/user/info', () => {
    it('should return user info', async () => {
      const response = await request(app.callback()).post('/api/user/info').send({ email: 'user@example.com' });

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toBeDefined();
      // Add more assertions as needed
    });

    it('should return an error when email is missing', async () => {
      const response = await request(app.callback()).post('/api/user/info').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('PARAMS_EMPTY');
      // Add more assertions as needed
    });

    it('should return an error when email is invalid', async () => {
      const response = await request(app.callback()).post('/api/user/info').send({ email: 'invalid-email' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('INVALID_EMAIL');
      // Add more assertions as needed
    });
  });

  describe('GET /api/user/info/all', () => {
    it('should return all users', async () => {
      const response = await request(app.callback()).get('/api/user/info/all');

      expect(response.statusCode).toBe(200);
      expect(response.body.users).toBeDefined();
    });
  });

  describe('POST /api/user/create', () => {
    it('should create a new user', async () => {
      const response = await request(app.callback())
        .post('/api/user/create')
        .send({ email: 'newuser@example.com', login_platform: 'platform', auth_key: '123456' });

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toBeDefined();
    });

    it('should return an error when required parameters are missing', async () => {
      const response = await request(app.callback()).post('/api/user/create').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('PARAMS_MISSING');
    });
  });

  describe('POST /api/user/block', () => {
    it('should block a user', async () => {
      const response = await request(app.callback()).post('/api/user/block').send({ email: 'user@example.com' });

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toBeDefined();
    });

    it('should return an error when email is missing', async () => {
      const response = await request(app.callback()).post('/api/user/block').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('PARAMS_EMPTY');
    });

    it('should return an error when email is invalid', async () => {
      const response = await request(app.callback()).post('/api/user/block').send({ email: 'invalid-email' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('INVALID_EMAIL');
    });
  });

  describe('POST /api/user/pause', () => {
    it('should pause a user', async () => {
      const response = await request(app.callback()).post('/api/user/pause').send({ email: 'user@example.com' });

      expect(response.statusCode).toBe(200);
      expect(response.body.user).toBeDefined();
    });

    it('should return an error when email is missing', async () => {
      const response = await request(app.callback()).post('/api/user/pause').send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('PARAMS_EMPTY');
    });

    it('should return an error when email is invalid', async () => {
      const response = await request(app.callback()).post('/api/user/pause').send({ email: 'invalid-email' });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('INVALID_EMAIL');
    });
  });
});
