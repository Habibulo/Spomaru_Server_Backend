'use strict';

const Result = require('../utils/result');
const redisService = require('../service/redis');
const enums = require('../constants/enums');
const errors = require('../constants/enums');

/**
 *
 * @param {*} ctx
 * @param {*} next
 * @returns
 *
 * checks server status saved in redis db
 */
const checkServerStatus = async (ctx, next) => {
  if (ctx.url.startsWith('/api/admin')) {
    await next();
    return;
  }

  const status = await redisService.getServerStatus();

  if (status.status === enums.SERVER_TYPE.MAINTENANCE) {
    return Result.error(ctx, errors.ERROR_CODE.SERVER_IN_MAINTENANCE, 'SERVER_IN_MAINTENANCE: 서버 점검중입니다');
  }

  await next();
};

module.exports = checkServerStatus;
