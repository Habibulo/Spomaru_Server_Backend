'use strict';

const Result = require('../utils/result');
const serviceInventory = require('../service/inventory');
const enums = require('../constants/enums');
const logger = require('../utils/logger');
/**
 * @api {post} /player/inven/insert 플레이어 인벤토리 추가
 * @apiName InsertInventory
 * @apiGroup PlayerInventory
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id 플레이어 ID
 * @apiBody {String} item_id 아이템 ID
 * @apiBody {String = REWARD, PAID, ADMIN} item_reason
 *
 * @apiSuccess {Object} item
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id
 * @apiSuccess {Number} item_id
 * @apiSuccess {String = REWARD, PAID, ADMIN} item_reason
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */

exports.insertItemInven = async (ctx) => {
  const player_id = ctx.request.body.player_id;
  const item_id = ctx.request.body.item_id;
  const item_reason = ctx.request.body.item_reason;

  try {
    const newItem = await serviceInventory.insertItem(player_id, item_id, enums.ITEM_REASON_TYPE[item_reason]);
    const responseData = { item: newItem };
    return Result.success(ctx, responseData, '아이템 추가되었습니다');
  } catch (err) {
    logger.error(err.code, err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /player/inven/get 플레이어 인벤토리 추가 조회
 * @apiName GetInventory
 * @apiGroup PlayerInventory
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id 플레이어 ID
 *
 * @apiSuccess {Object} item
 * @apiSuccess {Number} seq
 * @apiSuccess {String} player_id
 * @apiSuccess {String} item_id
 * @apiSuccess {Number = 0:costume 1:mblock 2:consume 3:cash} item_reason
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 *
 */

exports.getInven = async (ctx) => {
  const player_id = ctx.request.body.player_id;

  try {
    const playerInven = await serviceInventory.getPlayerInven(player_id);
    const responseData = { inventory: playerInven };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code, err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /player/inven/delete 플레이어 인벤토리 삭제
 * @apiName DeleteInventory
 * @apiGroup PlayerInventory
 * @apiVersion 1.0.0
 *
 *
 * @apiBody {String} player_id 플레이어 ID
 * @apiBody {String} item_id
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} msg
 */

exports.deleteInven = async (ctx) => {
  const { player_id, item_id } = ctx.request.body;
  try {
    const playerInven = await serviceInventory.deleteInven(player_id, item_id);
    const responseData = { inventory: playerInven };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code, err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
