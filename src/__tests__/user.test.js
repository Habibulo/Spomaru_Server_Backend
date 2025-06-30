const { getSingleUserInfo, getUsers } = require('../controllers/user');
const serviceUser = require('../service/user');

const userMock = {
  seq: '1',
  email: 'example@example.com',
  login_platform: 'email',
  auth_key: 'authKey',
  user_state: 'NORMAL',
  user_get_cash: 100,
  user_use_cash: 50,
  user_paid_cash: 50,
};

jest.mock('../utils/result', () => ({
  success: jest.fn((ctx, data, message) => ({ data, message })),
  error: jest.fn((ctx, code, message) => ({ code, message })),
}));

jest.mock('../service/user', () => ({
  getUserInfo: jest.fn().mockResolvedValue(userMock),
}));

describe('User Controller', () => {
  describe('Get One User Info', () => {
    it('should return one user', async () => {
      const ctx = { request: { body: { email: 'example@example.com' } } };
      serviceUser.getUserInfo.mockResolvedValueOnce(userMock);
      const res = await getSingleUserInfo(ctx);
      console.log('res', res);
      expect(res.data.user).toBe(userMock);
    });

    it('should show 1004 error when email is wrong', async () => {
      const ctx = { request: { body: { email: 'wrongemail' } } };
      serviceUser.getUserInfo.mockRejectedValueOnce({ error: 1004, message: '유효한 이메일 형식이 아닙니다' });
      const res = await getSingleUserInfo(ctx);
      expect(res.code).toBe(1004);
      expect(res.message).toBe('유효한 이메일 형식이 아닙니다');
    });

    it('should show 1002 error when email is empty', async () => {
      const ctx = { request: { body: { email: null } } };
      serviceUser.getUserInfo.mockRejectedValueOnce({ error: 1002, message: '유저 아이디를 입력해주세요' });
      const res = await getSingleUserInfo(ctx);
      expect(res.code).toBe(1002);
      expect(res.message).toBe('유저 아이디를 입력해주세요');
    });
  });

  const usersMock = [
    {
      seq: '1',
      email: 'user1@example.com',
      login_platform: 'email',
      platform_id: '123456',
      auth_key: 'authKey1',
      user_state: 'normal',
      user_get_cash: 100,
      user_use_cash: 50,
      user_paid_cash: 50,
    },
    {
      seq: '2',
      email: 'user2@example.com',
      login_platform: 'email',
      platform_id: '789012',
      auth_key: 'authKey2',
      user_state: 'premium',
      user_get_cash: 200,
      user_use_cash: 100,
      user_paid_cash: 100,
    },
  ];
  describe('Get All Users Info', () => {
    it('should show array of users', async () => {
      const ctx = {};
      serviceUser.getUsersInfo = jest.fn().mockResolvedValueOnce(usersMock);

      const res = await getUsers(ctx);
      expect(res.data.users).toBe(usersMock);
    });
  });
});
