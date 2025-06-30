'use strict';

const Result = require('../utils/result');
const serviceFav = require('../service/favorite');
const errors = require('../constants/errors');
const { ERROR_CODE } = require('../constants/errors');
const logger = require('../utils/logger');

/**
 * @api {post} /api/player/fav/insert 플레이어 즐겨찾기 추가
 * @apiName InsertFavorite
 * @apiGroup PlayerFavorite
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {String} content_id
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object} favourite
 * @apiSuccess {Number} fav_id
 * @apiSuccess {String} player_id
 * @apiSuccess {String} content_id
 */

exports.addToFav = async (ctx) => {
  const { player_id, content_id } = ctx.request.body;
  try {
    const ret = await serviceFav.addPlayerFavorite(player_id, content_id);
    const responseData = { favorite: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    if (err.message === 'This player favorite already exists.') {
      logger.error(err.code + err.message);
      return Result.error(ctx, ERROR_CODE.ALREADY_EXISTS, err.message);
    } else {
      logger.error('400' + err.code + err.message);
      return Result.error(ctx, '400', 'Failed to add favorite');
    }
  }
};

/**
 *
 * @api {post} /api/player/fav/get 플레이어 즐겨찾기 조회
 * @apiName GetFavorite
 * @apiGroup PlayerFavorite
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object} favourite
 * @apiSuccess {Number} fav_id
 * @apiSuccess {String} player_id
 * @apiSuccess {String} content_id
 *
 */

exports.getFav = async (ctx) => {
  const { player_id, filters } = ctx.request.body;

  try {
    const ret = await serviceFav.getPlayerFavorite(player_id, filters);
    const responseData = { favorite: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/player/fav/getOne 플레이어 즐겨찾기 조회 (1)
 * @apiName GetOneFavorite
 * @apiGroup PlayerFavorite
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object} favourite
 * @apiSuccess {Number} fav_id
 * @apiSuccess {String} player_id
 * @apiSuccess {String} content_id
 *
 */

exports.getOneFav = async (ctx) => {
  const { player_id, content_id } = ctx.request.body;

  try {
    const ret = await serviceFav.getOneFavorite(player_id, content_id);
    const responseData = { favorite: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/fav/del 플레이어 즐겨찾기 삭제
 * @apiName DeleteFavorite
 * @apiGroup PlayerFavorite
 * @apiVersion 1.0.0
 *
 * @apiBody {Array} fav_id
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 * @apiSuccess {Object} favourite
 * @apiSuccess {Number} fav_id
 * @apiSuccess {String} player_id
 * @apiSuccess {String} content_id
 */
exports.deleteFav = async (ctx) => {
  const { fav_id } = ctx.request.body;

  try {
    if (!Array.isArray(fav_id) || fav_id.length === 0) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }

    const ret = await serviceFav.deletePlayerFavorites(fav_id);
    const responseData = { favorites: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
