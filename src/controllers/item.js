'use strict';

const Result = require('../utils/result');
const serviceItem = require('../service/item');
const logger = require('../utils/logger');

/**
 * @api {post} /api/item 아이템 조회
 * @apiGroup Item
 *
 * @apiQuery {number} item_id
 *
 * @apiSuccess {Object} item
 * @apiSuccess {String} item_id
 * @apiSuccess {String} item_type 아이템 타입
 * @apiSuccess {String} item_parts 아이템 부위 타입
 * @apiSuccess {String} item_img 아이템 이미지
 * @apiSuccess {String} item_title 아이템 이름
 * @apiSuccess {String} item_desc 아이템 설명
 * @apiSuccess {String} item_pay_type 아이템 과금 타입
 * @apiSuccess {Number} item_pay_value 아이템 과금 비용
 *
 * @apiSuccess {Object} data
 * @apiSuccess {Number} code
 * @apiSuccess {String} message
 * */

exports.getOneItem = async (ctx) => {
  const item_id = ctx.query.item_id;
  try {
    const item = await serviceItem.getItem(item_id);
    const responseData = { item: item };
    return Result.success(ctx, responseData, '');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/item/type 타입별로 아이템 리스트
 * @apiGroup Item
 *
 * @apiQuery {number = 0: COSTUME, 1: MBLOCK, 2: CONSUME, 3: CASH} type
 *
 * @apiSuccess {Object} item
 * @apiSuccess {String} item_id
 * @apiSuccess {String} parts 아이템 부위 타입
 * @apiSuccess {String} img_name 아이템 이미지
 * @apiSuccess {String} title 아이템 이름
 * @apiSuccess {String} description 아이템 설명
 * @apiSuccess {String} pay_type 아이템 과금 타입
 * @apiSuccess {Number} pay_value 아이템 과금 비용
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} message
 * */

exports.getAllItemsByType = async (ctx) => {
  const type = ctx.query.type;
  try {
    const items = await serviceItem.getItemsByType(type);
    const responseData = { items: items };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/item/parts 부위 타입별로 아이템 리스트
 * @apiGroup Item
 *
 * @apiQuery {String = face,skin,hair,haircolor,top,bottom,shoes,acc} part
 *
 * @apiSuccess {Object} item
 * @apiSuccess {String} item_id
 * @apiSuccess {String} type 아이템 타입
 * @apiSuccess {String} parts 아이템 부위 타입
 * @apiSuccess {String} img_name 아이템 이미지
 * @apiSuccess {String} title 아이템 이름
 * @apiSuccess {String} description 아이템 설명
 * @apiSuccess {String} pay_type 아이템 과금 타입
 * @apiSuccess {Number} pay_value 아이템 과금 비용
 *
 * @apiSuccess {Number} code
 * @apiSuccess {String} message
 **/

exports.getCostumeByPart = async (ctx) => {
  const parts = ctx.query.part;

  try {
    const items = await serviceItem.getCostumeByPart(parts);
    const responseData = { items: items };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
