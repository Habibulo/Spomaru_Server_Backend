'use strict';
const Result = require('../utils/result');
const serviceSchedule = require('../service/schedule');
const serviceRedis = require('../service/redis');

const util = require('../utils/common');
const errors = require('../constants/errors');
const logger = require('../utils/logger');
//현재는 사용X

/**
 * @api {get} /api/schedule/info/all 세트 정보
 * @apiName SetInfo
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 * @apiSuccess {Object} setInfo
 * @apiSuccess {Number} set_id 세트의 고유 ID
 * @apiSuccess {String = 0: featured, 1: daily, 2: normal } type 세트의 타입
 * @apiSuccess {String} title 이름
 * @apiSuccess {String} img_name 이미지의 이름
 * @apiSuccess {String} description  설명
 * @apiSuccess {String} body_type 부위
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 첫 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_2] 두 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_3] 세 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_4] 네 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_5] 다섯 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_6] 여섯 번째 스탯 타입
 * @apiSuccess {Number} reward  보상 값
 */

exports.setInfoAll = async (ctx) => {
  try {
    const ret = await serviceSchedule.getSetInfoAll();

    const responseData = { setInfo: ret };

    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(JSON.stringify(ctx) + err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 *  @api {get} /api/schedule/content/all 콘텐츠 세트
 *  @apiName ContentSetInfo
 *  @apiGroup Schedule
 *  @apiVersion 1.0.0
 *
 * @apiSuccess {Number} setcontent_id
 * @apiSuccess {Number} set_id
 * @apiSuccess {String} content_id
 */

exports.setContentAll = async (ctx) => {
  try {
    const ret = await serviceSchedule.getSetContentAll();
    const responseData = { setContent: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/info 세트 정보 (1)
 * @apiName SetInfoContent
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {number} set_id
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 * @apiSuccess {Object} setInfo
 * @apiSuccess {Number} set_id 세트의 고유 ID
 * @apiSuccess {String = 0: featured, 1: daily, 2: normal } type 세트의 타입
 * @apiSuccess {String} title 이름
 * @apiSuccess {String} img_name 이미지의 이름
 * @apiSuccess {String} description  설명
 * @apiSuccess {String} body_type 부위
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 첫 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_2] 두 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_3] 세 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_4] 네 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_5] 다섯 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_6] 여섯 번째 스탯 타입
 * @apiSuccess {String} reward  보상 값
 * */

exports.setInfo = async (ctx) => {
  const set_id = ctx.request.body.set_id;
  try {
    if (util.isEmpty(set_id)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const ret = await serviceSchedule.getSetInfo(set_id);
    const responseData = { setInfo: ret };

    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/start 스케쥴 시작
 * @apiName StartSchedule
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {number} set_id
 * @apiBody {String} player_id
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 */

exports.startSchedule = async (ctx) => {
  const { player_id, set_id } = ctx.request.body;

  try {
    if (util.isEmpty(player_id) || util.isEmpty(set_id)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const ret = await serviceRedis.setDailySchedule(player_id, set_id);

    if (!util.isEmpty(ret)) {
      return Result.success(ctx, ret, '시작되었습니다');
    } else {
      return Result.error(ctx, 1009, '이미 전제합니다');
    }
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/current 현재 스케줄
 * @apiName CurrentSchedule
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 * @apiSuccess {Object} setInfo
 * @apiSuccess {Number} set_id 세트의 고유 ID
 * @apiSuccess {String = 0: featured, 1: daily, 2: normal } type 세트의 타입
 * @apiSuccess {String} title 이름
 * @apiSuccess {String} img_name 이미지의 이름
 * @apiSuccess {String} description  설명
 * @apiSuccess {String} body_type 부위
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 첫 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_2] 두 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_3] 세 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_4] 네 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_5] 다섯 번째 스탯 타입
 * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} [stat_6] 여섯 번째 스탯 타입
 * @apiSuccess {String} reward  보상 값
 *
 */
exports.getCurrentSchedule = async (ctx) => {
  const player_id = ctx.request.body.player_id;

  try {
    if (util.isEmpty(player_id)) {
      logger.error('[getCurrentSchedule]' + errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const current = await serviceRedis.getCurrentSchedule(player_id);
    if (util.isEmpty(current)) {
      return Result.error(ctx, errors.ERROR_CODE.NO_SCHEDULE, '스케줄이 존재하지 않습니다');
    }
    return Result.success(ctx, current);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/update 완료 플래그 체크
 * @apiName UpdateContentCompletion
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {String} content_id
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 *
 */
exports.updateContentCompletion = async (ctx) => {
  const { player_id, content_id } = ctx.request.body;

  try {
    if (util.isEmpty(player_id) || util.isEmpty(content_id)) {
      logger.error('[updateContentCompletion]' + errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const updated = await serviceRedis.updateCompletionStatus(player_id, content_id);

    return Result.success(ctx, updated, `업데이트되었습니다. 완료된 콘텐츠 ID:${content_id}`);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/delete 현재 스케줄 삭제
 * @apiName StopCurrentSchedule
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {Number = 0: 그만, 1: 완료} status
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 *
 */
exports.stopCurrentSchedule = async (ctx) => {
  const player_id = ctx.request.body.player_id;
  const status = ctx.request.body.status;

  const schedule = await serviceRedis.getCurrentSchedule(player_id);
  const logInfo = {};
  logInfo.player_id = player_id;
  logInfo.set_id = schedule.content[0].set_id;
  logInfo.progress = schedule.content.filter((item) => item.is_complete == 1).length / schedule.content.length;
  logInfo.status = status;

  try {
    if (util.isEmpty(player_id)) {
      logger.error('[getCurrentSchedule]' + errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const deleted = await serviceRedis.stopCurrentSchedule(player_id);
    return Result.success(ctx, deleted, `삭제되었습니다.`);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/setcontent ID로 세트 콘테츠 조회
 * @apiName SetContentsById
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {String} set_id
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 *
 */

exports.getContentBySet = async (ctx) => {
  const set_id = ctx.request.body.set_id;

  try {
    const contents = await serviceSchedule.getContentsBySet(set_id);
    return Result.success(ctx, contents, '');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/schedule/getLog 로그 기록
 * @apiName GetPlayerScheduleLog
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 *
 */

exports.getUserScheduleLog = async (ctx) => {
  const player_id = ctx.request.body.player_id;

  try {
    const scheduleLog = await serviceSchedule.getUserScheduleLog(player_id);
    return Result.success(ctx, scheduleLog, '');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/schedule/getLogByDate 날짜 별로 로그 기록
 * @apiName GetScheduleLogByDate
 * @apiGroup Schedule
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {Date} current_date  월/일/년
 *
 * @apiSuccess {Number} code 세부 에러코드
 * @apiSuccess {String} message 성공 메세지
 */

exports.getScheduleLogByDate = async (ctx) => {
  const player_id = ctx.request.body.player_id;
  const current_date = ctx.request.body.current_date;

  if (util.isEmpty(player_id) || util.isEmpty(current_date)) {
    logger.error('[getCurrentSchedule]' + errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
  }
  try {
    const scheduleLog = await serviceSchedule.getScheduleLogByDate(player_id, current_date);

    return Result.success(ctx, scheduleLog, '');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};
