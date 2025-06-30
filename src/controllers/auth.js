/* eslint-disable no-unused-vars */
const qrcode = require('qrcode');
const Result = require('../utils/result');
const authService = require('../service/auth');
const redisService = require('../service/redis');
const seviceAdmin = require('../service/admin');

const logger = require('../utils/logger');

const crypto = require('crypto');

const jwtHelper = require('../utils/jwt-helper');
const { EventEmitter } = require('koa');
const { getUserInfo } = require('../service/user');
const config = require('../../config');
const { isEmpty } = require('../utils/common');
const errors = require('../constants/errors');

const userEmitters = new Map();

let loginConfirmationPromise;
let timeoutPromise;

// 토큰 생성
function generateToken() {
  var token = {
    id: generateUniqueId(),
    code: generateRandomCode(),
    used: false,
  };

  return token;
}

function generateRandomCode() {
  const codeLength = 4;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < codeLength; i++) {
    const randomIndex = crypto.randomInt(0, characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
}

function generateUniqueId() {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base36 string
  const randomString = Math.random().toString(36).substring(2, 8); // Generate a random string

  return timestamp + randomString;
}

/**
 * @api {get} /api/auth/qr QR generation [QR 코드 생성]
 * @apiName QrCode
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiSuccess {string} QR 생성된 QR 코드
 * @apiSuccess {string} code 생성된 토큰 코드.
 */
exports.generateQr = async (ctx) => {
  try {
    const token = generateToken();
    const emitter = new EventEmitter();
    userEmitters.set(token.id, emitter); // Store the emitter for the user ID

    const qrCodeData = await qrcode.toDataURL(token.code);
    await redisService.saveCode(token.id, token.code);

    return Result.success(ctx, { QR: qrCodeData, code: token.code, id: token.id });
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/auth/remoteAuth  Remote Authentication [코드 인증]
 * @apiName RemoteAuth
 * @apiGroup Auth
 * @apiVersion 1.0.0
 *
 * @apiBody {string} code 인증코드
 * @apiBody {string} email 유저 이메일
 *
 * @apiSuccess {string} message Success message.
 * @apiError {string} message Error message.
 */

exports.remoteAuth = async (ctx) => {
  const code = ctx.request.body.code;
  const email = ctx.request.body.email;

  const token = await redisService.getCode(code);

  if (!token || token.used) {
    logger.error(errors.ERROR_CODE.AUTH_FAILED + ' 인증에 실패했습니다.');
    return Result.error(ctx, errors.ERROR_CODE.AUTH_FAILED, '인증에 실패했습니다.');
  }

  await redisService.checkUsed(code);

  const emitter = userEmitters.get(token.id);

  if (emitter) {
    logger.warn('확인 이벤트 발생');
    emitter.emit('email', { eventId: token.id, email }); // Emit the confirmation event
  }

  return Result.success(ctx, '로그인 확인이 전송되었습니다.');
};

/**
 * @api {post} /auth/confirm Login Confirmation [로그인 확정]
 * @apiName LoginConfirmation
 * @apiGroup Auth
 * @apiDescription 로그인 확정
 *
 * @apiBody {String} eventId 로그인 확인 이벤트와 연관된 고유 ID
 *
 * @apiSuccess {String} authToken The JWT authentication token for the user.
 * @apiSuccess {Object[]} user The user information.
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.loginConfirmation = async (ctx) => {
  try {
    const eventId = ctx.request.body.eventId;

    const emitter = new EventEmitter();

    userEmitters.set(eventId, emitter);

    loginConfirmationPromise = new Promise((resolve) => {
      emitter.once('email', (data) => {
        if (data.eventId === eventId) {
          resolve(data.email);
        }
      });
    });

    timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
      }, 60000);
    });

    const data = await Promise.race([loginConfirmationPromise, timeoutPromise]);

    if (!isEmpty(data)) {
      const user = await getUserInfo(data);

      let token;

      // Generate a JWT token
      token = jwtHelper.generateToken(
        {
          seq: user[0].seq,
          email: user[0].email,
          login_platform: user[0].login_platform,
        },
        config.jwt.user.token,
        config.jwt.user.expire_seconds,
      );

      const response = { authToken: token, user: user };

      // Remove the emitter for the current user ID
      userEmitters.delete(eventId);

      //remove qr code record

      await redisService.deleteCodeRecord(eventId);

      const logData = {
        email: user[0].email,
      };

      await seviceAdmin.writeLog('signin_log', logData);
      return Result.success(ctx, response);
    } else {
      await redisService.deleteCodeRecord(eventId);
      logger.error('로그인 확인에 실패했습니다. 인증 실패.');
      return Result.error(ctx, errors.ERROR_CODE.AUTH_FAILED, '인증에 실패했습니다');
    }
  } catch (err) {
    const eventId = ctx.request.body.eventId;
    await authService.deleteCodeRecord(eventId);
    logger.error('로그인 확인 중에 오류가 발생했습니다:', err);
    return Result.error(ctx, err, '인증 실패');
  }
};

/**
 * @api {post} /api/auth/cancel  Login Cancel 로그인 취소
 * @apiName LoginCancellation
 * @apiGroup Auth
 * @apiVersion 1.0.0
 * @apiDescription 로그인 취소
 *
 * @apiBody {String} eventId 로그인 확인 이벤트와 연관된 고유 ID
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */
exports.loginCancellation = async (ctx) => {
  try {
    const eventId = ctx.request.body.eventId;

    if (!userEmitters.has(eventId)) {
      logger.error('로그인 확인 취소에 실패했습니다. 로그인 확인이 진행되지 않습니다.');
      throw new Error('로그인 확인이 진행되지 않습니다.');
    }

    const emitter = userEmitters.get(eventId);

    const eventListener = (data) => {
      if (data.eventId === eventId) {
        clearTimeout(timeoutPromise);
        emitter.removeListener('email', eventListener);
      }
    };

    emitter.removeListener('email', eventListener);
    userEmitters.delete(eventId);
    await redisService.deleteCodeRecord(eventId);

    logger.info('로그인 확인이 성공적으로 취소되었습니다.');
    return Result.success(ctx, '로그인 확인이 성공적으로 취소되었습니다.');
  } catch (err) {
    logger.error('로그인 취소 중에 오류가 발생했습니다:' + err);
    return Result.error(ctx, err, '로그인 취소 실패');
  }
};
