'use strict';

const setInfo = require('../entity/data/set-info-schema');
const setContent = require('../entity/data/set-content-schema');
const util = require('../utils/common');
const { dataSource } = require('../utils/database');
const logger = require('../utils/logger');
const redis = require('../utils/redis');
const enums = require('../constants/enums');

//SCHEDULE FUNCTIONS
/**
 *
 * @param {*} player_id
 * @param {*} set_id
 * @returns
 */
exports.setDailySchedule = async (player_id, set_id) => {
  const connectionData = dataSource('data');
  const repo = connectionData.getRepository(setContent);
  const exercises = await repo.find({ where: { set_id: set_id } });

  let status;
  let cursor = '0';
  const connection = await redis.acquireConnection();
  try {
    if (!util.isEmpty(exercises)) {
      const multi = connection.multi();
      let [cursorRes, existingRecords] = await connection.scan(cursor, 'MATCH', `pl_schedule:${player_id}:*`);

      if (!util.isEmpty(existingRecords)) {
        logger.warn('Records already exist for the specified player_id.');
        return;
      }

      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        const key = `pl_schedule:${player_id}:id:${exercise.content_id}`;

        const values = {
          set_id,
          content_id: exercise.content_id,
          is_complete: 0,
        };
        multi.hmset(key, values);

        multi.expireat(key, Math.floor(new Date().setHours(23, 59, 59, 0) / 1000));
      }

      status = await multi.exec();
    }
    return status;
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

/**
 *
 * @param {*} player_id
 * @returns
 */

// get daily schedule
exports.getCurrentSchedule = async (player_id) => {
  const connectionData = dataSource('data');
  const repo = connectionData.getRepository(setInfo);

  const connection = await redis.acquireConnection();
  let content = [];
  let cursor = '0';
  try {
    let [cursorRes, keys] = await connection.scan(cursor, 'MATCH', `pl_schedule:${player_id}:*`);
    if (!util.isEmpty(keys)) {
      for (const record of keys) {
        let result = await connection.hgetall(record);
        content.push(result);
      }

      const current = await repo.findOneBy({ set_id: content[0].set_id });
      return { content, current };
    }
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

/**
 *
 * @param {*} player_id
 * @param {*} content_id
 * @returns
 */

//update daily schedule content
exports.updateCompletionStatus = async (player_id, content_id) => {
  const connection = await redis.acquireConnection();
  try {
    const keyPattern = `pl_schedule:${player_id}:id:*`;
    const cursor = '0';
    let [cursorRes, keys] = await connection.scan(cursor, 'MATCH', keyPattern);

    if (!util.isEmpty(keys)) {
      const multi = connection.multi();

      for (const key of keys) {
        const existingContentId = await connection.hget(key, 'content_id');

        if (existingContentId == content_id) {
          multi.hset(key, 'is_complete', 1);
        }
      }

      return multi.exec();
    } else {
      logger.warn('No schedules found for the specified player_id.');
      return [];
    }
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

/**
 *
 * @param {*} player_id
 * @returns
 */

//stop schedule
exports.stopCurrentSchedule = async (player_id) => {
  const connection = await redis.acquireConnection();
  try {
    const keyPattern = `pl_schedule:${player_id}:*`;
    const cursor = '0';
    let [cursorRes, keys] = await connection.scan(cursor, 'MATCH', keyPattern);

    if (util.isEmpty(keys)) {
      logger.warn('No records found for the specified player_id.');
      return [];
    }

    const multi = connection.multi();
    for (const key of keys) {
      multi.del(key);
    }

    return multi.exec();
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

exports.getAllScheduleData = async () => {
  const connection = await redis.acquireConnection();
  try {
    const allData = {};
    let cursor = '0';

    do {
      const [cursorRes, keys] = await connection.scan(cursor, 'MATCH', 'pl_schedule:*');
      cursor = cursorRes;

      if (keys.length > 0) {
        const multi = connection.multi();
        keys.forEach((key) => multi.hgetall(key));
        const data = await multi.exec();

        keys.forEach((key, index) => {
          const keyWithoutPrefix = key.replace('pl_schedule:', '');
          allData[keyWithoutPrefix] = data[index];
        });
      }
    } while (cursor !== '0');

    return allData;
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

//SERVER SETTINGS FUNCTIONS
exports.setServerInit = async () => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString();
  const connection = await redis.acquireConnection();
  const key = 'server:';
  try {
    const value = await connection.multi().hset(key, 'status', 'NORMAL').hset(key, 'reason', '').hset(key, 'updated_at', formattedDate).hgetall(key).exec();
    return value;
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

exports.getServerStatus = async () => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString();

  const connection = await redis.acquireConnection();
  const key = 'server:';
  try {
    let status = await connection.hgetall(key);

    if (util.isEmpty(status)) {
      status = await connection
        .multi()
        .hset(key, 'status', enums.SERVER_TYPE.NORMAL)
        .hset(key, 'reason', '')
        .hset(key, 'updated_at', formattedDate)
        .hgetall(key)
        .exec();
    }
    return status;
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

/**
 *
 * @param {*} state
 * @returns
 */
exports.setServerState = async (state) => {
  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0] + ' ' + now.toLocaleTimeString();
  const connection = await redis.acquireConnection();
  const key = 'server:';
  let msg = '';

  if (state == 'MAINTENANCE') {
    msg = '서버 점검중입니다. | The server is under maintenance.';
  } else {
    msg = '';
  }

  try {
    const status = await connection.multi().hset(key, 'status', state).hset(key, 'reason', msg).hset(key, 'updated_at', formattedDate).hgetall(key).exec();

    logger.info('[server]: 상태 변경되었습니다');
    return status;
  } catch (err) {
    logger.error(err);
    throw err;
  } finally {
    await redis.releaseConnection(connection);
  }
};

//QR CODE

/**
 *
 * @param {*} id
 * @param {*} code
 * @returns
 */

exports.saveCode = async (id, code) => {
  const connection = await redis.acquireConnection();
  const key = `qr:${code}`;

  try {
    const codeRes = await connection.multi().hset(key, 'id', id).hset(key, 'used', 0).expire(key, 60).exec();
    return codeRes;
  } catch (err) {
    logger.error(`Error saving code : ${err}`);
    throw new Error(`Error saving code `);
  } finally {
    await redis.releaseConnection(connection);
  }
};
/**
 *
 * @param {*} code
 * @returns
 */

exports.getCode = async (code) => {
  const connection = await redis.acquireConnection();
  const key = `qr:${code}`;

  try {
    const record = await connection.hgetall(key);
    if (record) {
      return {
        id: record.id,
        code: code,
        used: parseInt(record.used),
      };
    } else {
      return null;
    }
  } catch (err) {
    logger.error(`Error retrieving record with code ${code}: ${err}`);
    throw new Error(`Error retrieving record with code ${code}`);
  } finally {
    await redis.releaseConnection(connection);
  }
};

/**
 *
 * @param {*} code
 * @returns
 */

exports.checkUsed = async (code) => {
  const connection = await redis.acquireConnection();
  const key = `qr:${code}`;

  try {
    const multi = connection.multi();

    const codeRes = await connection.hget(key, code);
    multi.hset(key, 'used', 1).exec();

    return codeRes;
  } catch (err) {
    logger.error(`Error setting used flag to 1 ${err}`);
    throw new Error(`Error setting used flag to 1`);
  } finally {
    await redis.releaseConnection(connection);
  }
};

/**
 *
 * @param {*} id
 * @returns
 */

exports.deleteCodeRecord = async (id) => {
  const connection = await redis.acquireConnection();
  const keyPattern = `qr:*`;

  try {
    let cursor = '0';
    const [cursorRes, keys] = await connection.scan(cursor, 'MATCH', keyPattern);
    const multi = connection.multi();
    for (const key of keys) {
      multi.del(key);
    }

    return multi.exec();
  } catch (err) {
    logger.error(`Error deleting record with ID ${id}: ${err}`);
    throw new Error(`Error deleting record with ID ${id}`);
  } finally {
    await redis.releaseConnection(connection);
  }
};
