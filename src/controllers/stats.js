'use strict';

const Result = require('../utils/result');
const serviceStats = require('../service/stats');
const seviceAdmin = require('../service/admin');
const logger = require('../utils/logger');
const util = require('../utils/common');
const errors = require('../constants/errors');

/**
 *
 * @api {post} /api/player/stats/init 플레이어 능력치 초기화
 * @apiName InitializeStats
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object} initData
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id 플레이어 아이디
 *
 */

exports.setStats = async (ctx) => {
  const { player_id: playerId } = ctx.request.body;

  try {
    if (util.isEmpty(playerId)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '플레이어 ID가 비어 있습니다.');
    }

    const ret = await serviceStats.setStats(playerId);
    const responseData = { initData: ret };
    return Result.success(ctx, responseData, '플레이어의 초기화가 완료되었습니다.');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/stats/add 플레이어 능력치 추가
 * @apiName AddStat
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {number} [ustr] 상체 근력 값
 * @apiBody {number} [lstr] 하체 근력 값
 * @apiBody {number} [dur] 심폐지구력 값
 * @apiBody {String} [fle] 유연성 값
 * @apiBody {number} [fla] 평형성 값
 * @apiBody {number} [coo] 협응력 값
 *
 * @apiSuccess {Object} stats
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id 플레이어 아이디
 * @apiSuccess {number} ustr 상체 근력 값
 * @apiSuccess {number} lstr 하체 근력 값
 * @apiSuccess {number} dur 심폐지구력 값
 * @apiSuccess {String} fle 유연성 값
 * @apiSuccess {number} fla 평형성 값
 * @apiSuccess {number} coo 협응력 값
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */

exports.updateStatByType = async (ctx) => {
  const { player_id, ustr, lstr, dur, fle, fla, coo } = ctx.request.body;

  try {
    if (!player_id) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }

    if (!util.isPlayerId(player_id)) {
      return Result.error(ctx, errors.ERROR_CODE.INVALID_PLAYER, '잘못된 플레이어 ID 입니다.');
    }

    const ret = await serviceStats.setStatByType(player_id, ustr, lstr, dur, fle, fla, coo);

    const logData = [];

    if (ustr) {
      logData.push({ player_id, stat_type: 'ustr', stat_value: ustr });
    }

    if (lstr) {
      logData.push({ player_id, stat_type: 'lstr', stat_value: lstr });
    }

    if (dur) {
      logData.push({ player_id, stat_type: 'dur', stat_value: dur });
    }

    if (fle) {
      logData.push({ player_id, stat_type: 'fle', stat_value: fle });
    }

    if (fla) {
      logData.push({ player_id, stat_type: 'fla', stat_value: fla });
    }

    if (coo) {
      logData.push({ player_id, stat_type: 'coo', stat_value: coo });
    }

    // Write logs
    for (const data of logData) {
      await seviceAdmin.writeLog('player_stat_log', data);
    }

    const responseData = { stats: ret };
    return Result.success(ctx, responseData, '업데이트 되었습니다');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/stats/get 플레이어 능력치
 * @apiName GetPlayerStat
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Object} playerStats
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id 플레이어 아이디
 * @apiSuccess {number} ustr 상체 근력 값
 * @apiSuccess {number} lstr 하체 근력 값
 * @apiSuccess {number} dur 심폐지구력 값
 * @apiSuccess {String} fle 유연성 값
 * @apiSuccess {number} fla 평형성 값
 * @apiSuccess {number} coo 협응력 값
 * 
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg

 */
exports.getPlayerStats = async (ctx) => {
  const player_id = ctx.query.player_id;

  try {
    if (util.isEmpty(player_id)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const ret = await serviceStats.getAllPlayerStats(player_id);

    const responseData = { playerStats: ret };

    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/stats/getByType 플레이어 능력치 기록 (stat)
 * @apiName GetPlayerStatByType
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {String} stat
 *
 * @apiSuccess {Object} playerStats
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id 플레이어 아이디
 * @apiSuccess {string} stat_type
 * @apiSuccess {String} stat_value
 * @apiSuccess {Date} received_at
 * 
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg

 */

exports.getPlayerStatByType = async (ctx) => {
  const player_id = ctx.request.body.player_id;
  const stat = ctx.request.body.stat;

  try {
    if (util.isEmpty(player_id) || util.isEmpty(stat)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }

    const ret = await serviceStats.getStatByType(player_id, stat);
    const responseData = { playerStats: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/stats/history 플레이어 능력치 기록
 * @apiName GetPlayerStatHistory
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Object} playerStats
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id 플레이어 아이디
 * @apiSuccess {String} stat_type  능력치 타입
 * @apiSuccess {Number/String} stat_value 능력치 값
 * @apiSuccess {Date} received_at 획득 날짜
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */

exports.getPlayerStatsHistory = async (ctx) => {
  const player_id = ctx.request.body.player_id;
  try {
    if (util.isEmpty(player_id)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }

    const ret = await serviceStats.getPlayerStatsHistory(player_id);

    const responseData = { playerStats: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
