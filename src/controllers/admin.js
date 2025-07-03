//컨트롤러는 받은 결과를 클라이언트에게 반환합니다.
//ex ] 클라이언트 메세지를 넘겨주는 역할. 특수한 상황에 따라 문법을 써주면서 true / false 파악가능

'use strict';

const errors = require('../constants/errors');
//에러 관련 모듈 import(constants/errors 참고)
const util = require('../utils/common');
//util 관련 모듈 import(utils/common 참고)
const Result = require('../utils/result');
//result 관련 모듈 import(utils/result 참고)
const serviceAdmin = require('../service/admin');
const serviceRedis = require('../service/redis');
//service 관련 모듈 import(service/.. 참고)
const adminMiddleware = require('../middlewares/admin');
//adminMiddleware 관련 모듈 import(middlewares/admin 참고)
const logger = require('../utils/logger');
//utils 관련 모듈 import(utils/logger 참고)
const fs = require('fs');
//node 모듈 자체의 filesystem 모듈
const path = require('path');
const { stat } = require('fs/promises');

/* controllers에 있는 모든 import는 admins에서만 다루고 생략함 */

/**
 * @api {post} /api/admin/login Admin Login [관리자 로그인]
 * @apiName AdminAuth
 * @apiGroup Admin
 * @apiDescription 관리자 대시보드 로그인
 *
 * @apiBody {String} id Admin ID
 * @apiBody {String} password Password
 *
 * @apiSuccess {Number} code 1000 (ERR_NONE)
 * @apiSuccess {String} message "OK"
 * @apiSuccess {String} accessToken Access Token
 * @apiSuccess {String} refreshToken Refresh Token
 *
 * @apiError {Number} code Error code
 * @apiError {String} message Status message
 */

exports.loginAdmin = async (ctx) => {
  const { id, password } = ctx.request.body;
  /*   
  비동기 함수 선언: async 키워드를 사용하여 비동기 함수를 정의합니다. 이는 이 함수 내에서 await를 사용할 수 있도록 합니다.
  ctx 객체: 이 매개변수는 Koa.js의 컨텍스트 객체로, 요청 및 응답에 대한 정보를 담고 있습니다. ctx.request.body를 통해 클라이언트가 보낸 요청 본문을 가져옵니다.
  */
  if (util.isEmpty(id) || util.isEmpty(password)) {
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
  }
  /* 
  입력 검증: ID나 비밀번호가 비어 있는지 확인합니다. 만약 비어 있다면, 에러 코드를 포함한 실패 응답을 반환합니다.
  Result.error는 에러 응답을 생성하는 유틸리티 함수입니다. 
  */
  const admin = await serviceAdmin.authAdmin({ id, password });
  /* 
  관리자 인증: serviceAdmin.authAdmin 함수를 호출하여 비동기적으로 관리자를 인증합니다. 이 함수는 ID와 비밀번호를 객체 형태로 받아 해당 관리자가 존재하는지 확인합니다.
  await 사용: await 키워드는 Promise가 해결될 때까지 기다리며, 이 경우 인증 결과인 admin 객체를 반환합니다.
  */
  if (!admin) {
    logger.error(errors.ERROR_CODE.ADMIN_AUTH_FAILED + '관리자 인증 실패하였습니다.');
    return Result.error(ctx, errors.ERROR_CODE.ADMIN_AUTH_FAILED, '관리자 인증 실패하였습니다.');
  }
  return Result.success(ctx, { accessToken: adminMiddleware.getAccessToken(admin), refreshToken: adminMiddleware.getRefreshToken(admin) });
  
};


/**
 * @api {post} /api/admin/logs Log Records [로그 기록]
 * @apiName Log Records
 * @apiGroup Admin
 * @apiDescription 운영툴 로그 기록
 *
 * @apiQuery {string} table 테이블 이름 [ signin_log, regist_log, item_log, player_stat_log ]
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {string=OK} message 상태 메세지
 *
 * @apiError (Error) {number} code 에러코드
 * @apiError (Error) {string} message 상태 메세지
 */

exports.getLog = async (ctx) => {
  const table = ctx.query.table;

  if (util.isEmpty(table)) {
    logger.error(errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
  }

  const log = await serviceAdmin.getLog(table);

  return Result.success(ctx, log, table + ' 테이블에서 로그를 성공적으로 가져왔습니다.');
};

/**
 *
 * @api {get} /api/admin/users/today/hourly User By Hour [시간별 오늘의 사용자]
 * @apiName UsersByHour
 * @apiGroup Admin
 * @apiDescription 시간별 오늘의 사용자
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data "시간" : 유저수
 * @apiSuccess {string=OK} message 상태 메세지
 */

exports.getTodaysUsersByHours = async (ctx) => {
  try {
    const usersByHour = await serviceAdmin.todayUsersByHour();
    return Result.success(ctx, usersByHour, '');
  } catch (err) {
    logger.error(err.code + ' ' + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/admin/user-stats User Stats [사용자 통계]
 * @apiName UserStats
 * @apiGroup Admin
 * @apiDescription 사용자 통계
 *
 * @apiQuery {String} period [today, week, month, year]
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 * @apiSuccess {string=OK} message 상태 메세지
 */

exports.getStats = async (ctx) => {
  const period = ctx.query.period;
  try {
    const stats = await serviceAdmin.getStats(period);
    return Result.success(ctx, stats);
  } catch (err) {
    logger.error(err.code + ' ' + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {get} /api/admin/server-status set server status
 * @apiName SetServerState
 * @apiGroup Admin
 * @apiDescription 서버 상태 변경
 *
 * @apiBody {String} state [MAINTENANCE, ""]
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 * @apiSuccess {string=OK} message 상태 메세지
 */

exports.setServerState = async (ctx) => {
  const state = ctx.request.body.state;
  try {
    const res = await serviceRedis.setServerState(state);
    return Result.success(ctx, res, '상태 변경되었습니다');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/setting/version Version Check [버전 체크]
 * @apiName CheckVersion
 * @apiGroup Admin
 *
 * @apiDescription 클라 버전 확인
 *
 * @apiBody {String} device [pc,ios,aos,spo,fitness]
 * @apiBody {String} version
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 */

exports.isValidVersion = async (ctx) => {
  const device = ctx.request.body.device;
  const versionCode = ctx.request.body.version;
  try {
    const res = await serviceAdmin.isValidVersion(device, versionCode);
    res == true ? logger.debug(`[Version ${versionCode}] is a valid version`) : logger.debug(`[Version ${versionCode}] is not a valid version`);
    return Result.success(ctx, res, '');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/setting/versionLauncher Launcher Version [런처 버전]
 * @apiName CheckLauncherVersion
 * @apiGroup Admin
 * @apiDescription 클라 런처 버전 확인
 *
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 */

exports.getLauncherVersion = async (ctx) => {
  try {
    const res = await serviceAdmin.getVersion();
    return Result.success(ctx, res, '버전을 성공적으로 가져왔습니다.');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {get} /api/admin/setting/versions  All Versions [모든 버전]
 * @apiName GetAllVersions
 * @apiGroup Admin
 * @apiDescription 모든 버전 확인
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 */
exports.getAllVersions = async (ctx) => {
  try {
    const res = await serviceAdmin.getAllVersions();
    return Result.success(ctx, res, '');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {get} /api/setting/launcherDownload  Launcher Download [런처 다운로드]
 * @apiName DownloadLauncher
 * @apiGroup Admin
 * @apiDescription 런처 다운로드
 *
 */

exports.downloadLauncher = async (ctx) => {
  try {
    const filePath = '/home/xrsporter.launcher/rootnode/launcher.exe';

    if (fs.existsSync(filePath)) {
      const fileStat = await stat(filePath);
      const fileSize = fileStat.size;
      ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent('launcher.exe')}`);
      ctx.set('Content-Type', 'application/octet-stream');
      ctx.set('Content-Length', fileSize);

      const fileStream = fs.createReadStream(filePath);
      ctx.body = fileStream;
    } else {
      ctx.status = 404;
      ctx.body = 'File not found';
    }
  } catch (error) {
    ctx.status = 500; // Internal Server Error
    ctx.body = 'An error occurred';
    console.error(error);
  }
};

/**
 *
 * @api {get} /api/setting/dowloadProgram  Program Download [프로그램 다운로드]
 * @apiName DownloadProgram
 * @apiGroup Admin
 * @apiDescription 프로그램 다운로드
 *
 */

exports.downloadProgram = async (ctx) => {
  const type = ctx.request.body.type;

  try {
    const basePath = '/home/xrsporter.spomaru/rootnode/sensorPrograms';

    let filePath;

    switch (type) {
      case 1:
        filePath = path.join(basePath, 'vCatchStation3.20.msi');
        break;
      case 2:
        filePath = path.join(basePath, 'CodeReachContentsCertification1.0.msi');
        break;
      case 3:
        filePath = path.join(basePath, 'SOSLabGL1.5.msi');
        break;
      case 4:
        filePath = path.join(basePath, 'CodeReachVision2.2.msi');
        break;
      case 5:
        filePath = path.join(basePath, 'XRGearM1_v1.4.msi');
        break;
      case 6:
        filePath = path.join(basePath, 'CodeReachFootstep1.1.msi');
        break;
      case 7:
        filePath = path.join(basePath, 'VRFloorLRFB1.2.msi');
        break;

      default:
        ctx.status = 400;
        ctx.body = 'Invalid type';
        return;
    }
    if (!fs.existsSync(filePath)) {
      ctx.status = 404;
      ctx.body = 'File not found';
      return;
    }

    ctx.set('Content-disposition', `attachment; filename=${path.basename(filePath)}`);
    ctx.set('Content-type', 'application/octet-stream');

    ctx.body = fs.createReadStream(filePath);
  } catch (error) {
    ctx.status = 500;
    ctx.body = 'An error occurred';
  }
};

/**
 * @api {get} /api/setting/spomaruDownload  Spomaru Download [스포마루 다운로드]
 * @apiName DownloadSpomaru
 * @apiGroup Admin
 * @apiDescription 스포마루 다운로드
 */

exports.downloadSpomaruLauncher = async (ctx) => {
  try {
    const filePath = '/home/xrsporter.spomaru/rootnode/spomaru.zip';

    if (fs.existsSync(filePath)) {
      ctx.set('Content-Disposition', `attachment; filename=${encodeURIComponent('spomaru.zip')}`);
      ctx.set('Content-Type', 'application/octet-stream');

      const fileStream = fs.createReadStream(filePath);
      ctx.body = fileStream;
    } else {
      ctx.status = 404;
      ctx.body = 'File not found';
    }
  } catch (error) {
    ctx.body = 'An error occurred';
    console.error(error);
  }
};

/**
 *
 * @route {get} /api/admin/schedule-stats  Schedule Stats [스케줄 통계]
 * @apiName scheduleStats
 * @apiGroup Admin
 * @apiDescription 스케줄 정보
 *
 * @apiQuery {string} period
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 */

exports.getScheduleStats = async (ctx) => {
  const period = ctx.query.period;
  try {
    const res = await serviceAdmin.getScheduleStats(period);
    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

exports.writeContentLog = async (ctx) => {
  const data = ctx.request.body;

  try {
    const res = await serviceAdmin.writeLog('player_content_log', data);
    return Result.success(ctx, res);
  } catch (err) {
    logger.warn(err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/admin/last-login-date  Last Login Date [최신 로그인 날짜]
 * @apiName writeContentLog
 * @apiGroup Admin
 * @apiDescription 최신 로그인 날짜
 *
 * @apiQuery {String} email
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 * @returns
 */

exports.getLastLoginDate = async (ctx) => {
  const email = ctx.query.email;
  try {
    const res = await serviceAdmin.getLastLoginDate(email);
    return Result.success(ctx, res);
  } catch (err) {
    logger.warn(err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/admin/activity-log  Write Activity Log [활동 로그 작성]
 * @apiName writeActivityLog
 * @apiGroup Admin
 * @apiDescription writeActivityLog
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 * @returns
 */

exports.insertActivityLog = async (ctx) => {
  const admin_id = ctx.request.body.adminId;
  const action = ctx.request.body.action;

  try {
    const res = await serviceAdmin.insertActivityLog(admin_id, action);
    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {get} /api/admin/activity-log  Get Activity Log [활동 로그 가져오기]
 * @apiName getActivityLog
 * @apiGroup Admin
 * @apiDescription getActivityLog
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 * @returns
 */

exports.getActivityLog = async (ctx) => {
  try {
    const res = await serviceAdmin.getActivityLog();

    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/admin/admins  Add Admin [관리자 추가]
 * @apiName addAdmin
 * @apiGroup Admin
 * @apiDescription 관리자 추가
 *
 * @apiSuccess {number=1000} code ERR_NONE
 * @apiSuccess {Object} data
 * @returns
 */

exports.insertNewAdmin = async (ctx) => {
  const id = ctx.request.body.id;
  const password = ctx.request.body.password;
  const name = ctx.request.body.name;
  const role = ctx.request.body.role;
  try {
    const res = await serviceAdmin.insertNewAdmin(id, password, name, role);

    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {get} /api/admin/content-stats  Content Stats [ 콘텐츠 통계]
 
 * @apiName contentStats
 * @apiGroup Admin
 * @apiDescription 콘텐츠 통계
 * 
 * @apiSuccess {String} totalDownload
 * @apiSuccess {String} totalExec
 *
 */
exports.getContentDownloadExecStats = async (ctx) => {
  try {
    const res = await serviceAdmin.getContentDownloadStats();
    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/admin/player/content-stats  Player Content Stats [프레이어 콘텐츠 통계]
 *
 *
 * @apiName playerContentStats
 * @apiGroup Admin
 * @apiDescription 프레이어 콘텐츠 통계
 *
 * @apiQuery {String} playerId
 *
 * @apiSuccess {Number} playerExec
 *
 */
exports.getPlayerExecStats = async (ctx) => {
  const playerId = ctx.query.playerId;
  try {
    const res = await serviceAdmin.getPlayerExecStats(playerId);

    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 *  @api {post} /api/admin/player/content-log  Player Content Log [플레이어 콘텐츠 로그]
 *
 *  @apiName playerContentLog
 *  @apiGroup Admin
 *  @apiDescription 프레이어 콘텐츠 로그
 *
 *  @apiQuery {String} playerId
 *
 *
 *  @apiSuccess {String} seq
 *  @apiSuccess {String} player_id
 *  @apiSuccess {String} content_id
 *  @apiSuccess {Number} score
 *  @apiSuccess {Date} start_date
 *  @apiSuccess {Date} end_date
 */

exports.getPlayerContentLog = async (ctx) => {
  const playerId = ctx.query.playerId;
  try {
    const res = await serviceAdmin.getPlayerContentLog(playerId);
    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};
