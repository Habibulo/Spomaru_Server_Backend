//로그들 모음집

/**
 * Module  for handling logging using winston
 */

'use strict';

const winston = require('winston');
const { combine, timestamp, printf, colorize } = winston.format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'silly',
  format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customFormat),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'combined.log' })],
});

const customLevels = {
  levels: {
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    silly: 5,
  },

  colors: {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'blue',
    silly: 'gray',
  },
};

winston.addColors(customLevels.colors);
logger.setLevels(customLevels.levels);

module.exports = logger;
