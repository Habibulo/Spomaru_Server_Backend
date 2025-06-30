'use strict';

const Redis = require('ioredis');
const config = require('../../config');
const logger = require('./logger');
const { createPool } = require('generic-pool');

let REDIS_CLIENTS = {};

/**
 * Initialize Redis connection pool.
 */

exports.initialize = async () => {
  const redisOptions = Object.freeze({
    host: config.redis['cr_launcher'].host,
    port: config.redis['cr_launcher'].port,
    password: config.redis['cr_launcher'].password,
    db: config.redis['cr_launcher'].db,
    connectTimeout: 5000,
    disconnectTimeout: 2000,
    enableAutoPipelining: true, //This way the performance improves by 50%~300%
    showFriendlyErrorStack: false,
  });

  const redisPool = createPool(
    {
      create: async () => {
        const connection = new Redis(redisOptions);
        connection.on('error', (err) => logger.error('Redis Error: ' + err));
        connection.select(redisOptions.db);

        return connection;
      },
      destroy: async (redisConnection) => {
        return redisConnection.quit();
      },
    },
    {
      max: 1000,
      min: 0,
      autostart: true,
    },
  );
  REDIS_CLIENTS['cr_launcher'] = redisPool;
};

exports.acquireConnection = async () => {
  return await REDIS_CLIENTS['cr_launcher'].acquire();
};

/**
 * Release a Redis connection back to the pool.
 * @param {Redis} redisConnection The connection to release.
 */

exports.releaseConnection = async (redisConnection) => {
  await REDIS_CLIENTS['cr_launcher'].release(redisConnection);
};
