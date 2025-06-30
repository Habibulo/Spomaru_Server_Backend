'use strict';

const Result = require('../utils/result');
const serviceUser = require('../service/user');
const seviceAdmin = require('../service/admin');
const logger = require('../utils/logger');

const util = require('../utils/common');
const httpStatus = require('http-status');
const errors = require('../constants/errors');

/**
 * @api {post}  /api/user/info 유저정보
 * @apiName UserInfo
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} email 유저 ID
 *
 * @apiSuccess {Object} user
 * @apiSuccess {Number} seq
 * @apiSuccess {String} email 유저 아이디
 * @apiSuccess {String} login_platform 로그인 플랫폼
 * @apiSuccess {String} platform_id 플랫폼 아이디
 * @apiSuccess {String} auth_key
 * @apiSuccess {String} user_state 사용자 상태 [normal,premium,block,pause,withdraw]
 * @apiSuccess {Number} user_get_cash 총 획득 캐시
 * @apiSuccess {Number} user_use_cash 총 사용 캐시
 *
 * @apiSuccess {Number} user_paid_cash 과금하여 획득한 캐시
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 *
 */

exports.getSingleUserInfo = async (ctx) => {
  const email = ctx.query.email;

  //check body [ email ]
  if (!email) {
    logger.error(errors.ERROR_CODE.PARAMS_EMPTY + '유저 아이디를 입력해주세요');
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '유저 아이디를 입력해주세요');
  }
  if (!util.isEmail(email)) {
    logger.error(errors.ERROR_CODE.INVALID_EMAIL + '유효한 이메일 형식이 아닙니다');
    return Result.error(ctx, errors.ERROR_CODE.INVALID_EMAIL, '유효한 이메일 형식이 아닙니다');
  }

  try {
    const user = await serviceUser.getUserInfo(email);
    const responseData = { user: user };

    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {get} /api/user/info/all 모든 유저 조회
 * @apiName UserInfoAll
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Object} users
 * @apiSuccess {Number} seq
 * @apiSuccess {String} email 유저 아이디
 * @apiSuccess {String} login_platform 로그인 플랫폼
 * @apiSuccess {String} platform_id 플랫폼 아이디
 * @apiSuccess {String} auth_key
 * @apiSuccess {String} user_state 사용자 상태 [normal,premium,block,pause,withdraw]
 * @apiSuccess {Number} user_get_cash 총 획득 캐시
 * @apiSuccess {Number} user_use_cash 총 사용 캐시
 * @apiSuccess {Number} user_paid_cash 과금하여 획득한 캐시
 *
 * @apiSuccess {Number} code 세부 에러코드 (0은 성공)
 * @apiSuccess {String} message 성공 메세지
 */

exports.getUsers = async (ctx) => {
  try {
    const users = await serviceUser.getUsersInfo();
    const responseData = { users };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/user/create 유저 생성
 * @apiName CreateUser
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiBody {String} email
 * @apiBody {String} login_platform
 * @apiBody {String} auth_key
 *
 * @apiSuccess {Object} user
 * @apiSuccess {Number} seq
 * @apiSuccess {String} email 이메일
 * @apiSuccess {String} login_platform 로그인 플랫폼
 * @apiSuccess {String} auth_key
 * @apiSuccess {String = normal,premium,block,pause,withdraw} [user_state] 사용자 상태
 * @apiSuccess {Number} [user_get_cash] 총 획득 캐시
 * @apiSuccess {Number} [user_use_cash] 총 사용 캐시
 * @apiSuccess {Number} [user_paid_cash] 과금하여 획득한 캐시
 * @apiSuccess {String} updated_at 업데이트 날짜
 * @apiSuccess {String} created_at 생성 날짜
 *
 * @apiSuccess {Number} code 세부 에러코드 (0은 성공)
 * @apiSuccess {String} message 성공 메세지
 */

exports.createUser = async (ctx) => {
  const { email, login_platform, auth_key } = ctx.request.body;

  try {
    // Empty parameters handling
    if (util.isEmpty(email) || util.isEmpty(login_platform) || util.isEmpty(auth_key)) {
      logger.warn(errors.ERROR_CODE.PARAMS_EMPTY + '사용자 생성 실패. 파라미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '파라미터가 비어 있습니다.');
    }

    // Validate email format
    if (!util.isEmail(email)) {
      logger.warn(errors.ERROR_CODE.INVALID_EMAIL + '사용자 생성 실패. 유효하지 않은 이메일 형식입니다.');
      return Result.error(ctx, errors.ERROR_CODE.INVALID_EMAIL, '유효하지 않은 이메일 형식입니다.');
    }

    // Create the user
    const newUser = await serviceUser.createUser({ email, login_platform, auth_key });
    const responseData = { user: newUser };

    // Check if user creation was successful
    if (!newUser) {
      logger.error(httpStatus.INTERNAL_SERVER_ERROR + '사용자 생성 실패. 내부 서버 오류입니다.');
      return Result.error(ctx, httpStatus.INTERNAL_SERVER_ERROR, '사용자 추가 실패');
    } else if (newUser === 'EXISTING USER') {
      logger.warn(errors.ERROR_CODE.ALREADY_EXISTS + '사용자 생성 실패. 이미 존재하는 사용자입니다.');
      return Result.error(ctx, errors.ERROR_CODE.ALREADY_EXISTS, '이미 존재하는 사용자입니다.');
    }

    await seviceAdmin.writeLog('regist_log', newUser);

    // Return success response
    return Result.success(ctx, responseData, '사용자가 추가되었습니다.');
  } catch (err) {
    logger.error('사용자 생성 중 오류가 발생했습니다:' + err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * 
 * @api {post} /api/user/changestate 유저 상태 변경
 * @apiName Change User State
 * @apiGroup User
 * @apiVersion 1.0.0

 * @apiBody {string} email
 * @apiBody {string} status [NORMAL, PREMIUM, BLOCK, PAUSE, WITHDRAW]


 * @apiSuccess {Object} user
 * @apiSuccess {Number} seqs
 * @apiSuccess {String} email 유저 아이디
 * @apiSuccess {String} login_platform 로그인 플랫폼
 * @apiSuccess {String} platform_id 플랫폼 아이디
 * @apiSuccess {String} auth_key
 * @apiSuccess {String} user_state 사용자 상태 [normal,premium,block,pause,withdraw]
 * @apiSuccess {Number} user_get_cash 총 획득 캐시
 * @apiSuccess {Number} user_use_cash 총 사용 캐시
 * @apiSuccess {Number} user_paid_cash 과금하여 획득한 캐시
 * @apiSuccess {String} updated_at 업데이트 날짜
 * @apiSuccess {String} created_at 생성 날짜
 * 
 * @apiSuccess {Number} code 세부 에러코드 (0은 성공)
 * @apiSuccess {String} message 성공 메세지
 */

exports.changeState = async (ctx) => {
  const { email, status } = ctx.request.body;

  if (util.isEmpty(email)) {
    logger.warn(errors.ERROR_CODE.PARAMS_EMPTY + '사용자 상태 변경 실패. 유저 ID를 입력해주세요.');
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '유저 ID를 입력해주세요.');
  }
  if (!util.isEmail(email)) {
    logger.warn(errors.ERROR_CODE.INVALID_EMAIL + '사용자 상태 변경 실패. 유효하지 않은 이메일 형식입니다.');
    return Result.error(ctx, errors.ERROR_CODE.INVALID_EMAIL, '유효하지 않은 이메일 형식이 아닙니다.');
  }

  try {
    const user = await serviceUser.changeState(email, status);
    if (!user) {
      logger.warn(errors.ERROR_CODE.NO_DATA + '사용자 상태 변경 실패. 사용자가 존재하지 않거나 잘못된 ID입니다.');
      return Result.error(ctx, errors.ERROR_CODE.NO_DATA, '사용자가 존재하지 않거나 잘못된 ID입니다.');
    }
    return Result.success(ctx, user, '사용자 상태 성공적으로 변경되었습니다.');
  } catch (err) {
    logger.error('사용자 상태 변경 중 오류가 발생했습니다:', err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/user/updateCash 유저 cash 변경
 * @apiName Change User Cash
 * @apiGroup User
 * @apiVersion 1.0.0
 *
 * @apiBody {String} email 유저 아이디
 * @apiBody {String} type cash 타입
 * @apiBody {Number} amount 값
 *
 *
 */

exports.updateCash = async (ctx) => {
  const { email, type, amount } = ctx.request.body;

  try {
    const cash = await serviceUser.updateUserCash(email, type, amount);
    return Result.success(ctx, cash, '성공적으로 변경되었습니다.');
  } catch (err) {
    logger.error('사용자 상태 변경 중 오류가 발생했습니다:', err);
    return Result.error(ctx, err.code, err.message);
  }
};
