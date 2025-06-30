'use strict';

const logger = require('../utils/logger');
const { dataSource } = require('../utils/database');
/**
 *
 * @param {*} table
 * @param {*} data
 */
exports.writeLog = async (table, data) => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(table);
    const builder = repo.createQueryBuilder();
    await builder.insert().into(table).values([data]).execute();
    logger.debug([`${table} 로그 기록 작성 완료: ${JSON.stringify(data)}`]);
  } catch (err) {
    logger.error(err);
  }
};

/**
 *
 * @param {*} table
 * @returns
 */

exports.getLog = async (table) => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(table);
    const logs = await repo.find();
    return logs.reverse();
  } catch (err) {
    logger.error(err);
  }
};

/**
 * *For Admin Page
 */
exports.todayUsersByHour = async () => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository('signin_log');

    const currentDate = new Date();
    const startTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
    const endTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59);

    const userCounts = await repo.createQueryBuilder().where('signed_at >= :startTime', { startTime }).andWhere('signed_at <= :endTime', { endTime }).getMany();

    const uniqueUsers = {};
    userCounts.forEach((count) => {
      if (count.signed_at && count.signed_at instanceof Date) {
        const hour = count.signed_at.getHours();
        const email = count.email;

        if (email && !uniqueUsers[email]) {
          uniqueUsers[email] = hour;
        }
      }
    });

    const usersByHour = {};
    Object.values(uniqueUsers).forEach((hour) => {
      usersByHour[hour] = usersByHour[hour] ? usersByHour[hour] + 1 : 1;
    });

    return usersByHour;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

/**
 *
 * @param {*} email
 * @returns
 */

//last login date of user ( by email )
exports.getLastLoginDate = async (email) => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository('signin_log');
    const mostRecentLog = await repo.findOne({
      order: { signed_at: 'DESC' },
      where: { email: email },
    });

    if (mostRecentLog) {
      return mostRecentLog.signed_at;
    } else {
      return null;
    }
  } catch (err) {
    logger.error(err);
    return null;
  }
};
