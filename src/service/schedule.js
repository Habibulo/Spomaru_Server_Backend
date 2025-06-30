const SetInfo = require('../entity/data/set-info-schema');
const SetContent = require('../entity/data/set-content-schema');
const { dataSource } = require('../utils/database');
const scheduleLogSchema = require('../entity/log/schedule-log-schema');
const { Between } = require('typeorm');
const logger = require('../utils/logger');

/**
 *
 * @returns
 */

exports.getSetInfoAll = async () => {
  const connection = dataSource('data');
  const repo = connection.getRepository(SetInfo);

  const set = await repo.find();

  return set;
};
/**
 *
 * @returns
 */

exports.getSetContentAll = async () => {
  const connection = dataSource('data');
  const repo = connection.getRepository(SetContent);

  const set = await repo.find();
  return set;
};
/**
 *
 * @param {*} set_id
 * @returns
 */

exports.getSetInfo = async (set_id) => {
  const connection = dataSource('data');
  const repo = connection.getRepository(SetInfo);

  const set = await repo.find({ where: { set_id } });
  return set;
};

/**
 *
 * @param {*} set_id
 */
exports.getContentsBySet = async (set_id) => {
  const connection = dataSource('data');
  const repo = connection.getRepository('set_content');

  const contents = await repo.find({ where: { set_id }, select: ['content_id'] });
  const contentIds = contents.map((content) => content.content_id);

  return contentIds;
};

/**
 *
 * @param {*} player_id
 * @returns
 */

exports.getUserScheduleLog = async (player_id) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(scheduleLogSchema);

  const scheduleLog = await repo.find({ where: { player_id } });

  return scheduleLog;
};

/**
 *
 * @param {*} player_id
 * @param {*} current_date
 * @returns
 */
exports.getScheduleLogByDate = async (player_id, current_date) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(scheduleLogSchema);

  //converts date to format that will match database format
  const parsedDate = new Date(`${current_date} UTC`);
  const startDate = new Date(parsedDate.setUTCHours(0, 0, 0, 0)).toISOString();
  const endDate = new Date(parsedDate.setUTCHours(23, 59, 59, 999)).toISOString();

  try {
    const logs = await repo.find({
      where: {
        player_id: player_id,
        progress: 1,
        created_at: Between(startDate, endDate),
      },
    });

    return logs;
  } catch (error) {
    logger.warn('Error in getScheduleLogByDate:', error);
    throw error;
  }
};
