//서비스 폴더에 있는 js들은 아키텍처의 데이터베이스 작업과 비즈니스 로직을 처리한 뒤, 결과를 컨트롤러로 반환합니다.

'use strict';

const util = require('../utils/common');
const { dataSource } = require('../utils/database');
const adminSchema = require('../entity/log/admin-schema');
const errors = require('../constants/errors');
const logger = require('../utils/logger');
const userAccountSchema = require('../entity/user/user-account-schema');
const { MoreThanOrEqual } = require('typeorm');
const systemInfoSchema = require('../entity/data/system-info-schema');
const scheduleLogSchema = require('../entity/log/schedule-log-schema');
const adminActivitySchema = require('../entity/log/admin-activity-schema');
const playerSchema = require('../entity/user/player-schema');
const xrsporterPaymentSchema = require('../entity/log/xrsporter-payment-schema');
const contentLogsSchema = require('../entity/log/content-logs-schema');
const playContentLogSchema = require('../entity/log/play-content-log-schema');

/**
 *
 */
exports.insertDefAdmin = async () => {
  const id = 'admincodereach';
  const password = 'codereach!@34';
  const name = '관리자';
  const role = 'admin';

  const { hash, salt } = await util.passwordHasher(password);
  const ds = dataSource('log');
  const runner = ds.createQueryRunner();
  await runner.startTransaction();
  try {
    const repo = ds.getRepository(adminSchema);
    let admin = await repo.findOneBy({ id: id });
    if (!admin) {
      admin = await repo.save({
        id: id,
        password: hash,
        name: name,
        role: role,
        salt: salt,
      });
    }
    await runner.commitTransaction();
  } catch (error) {
    logger.error(error);
    await runner.rollbackTransaction();
  } finally {
    await runner.release();
  }
};

/**
 *
 * @param {*} data
 * @returns
 */
exports.authAdmin = async (data) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(adminSchema);
  const admin = await repo.findOneBy({ id: data.id });

  if (util.isEmpty(admin)) {
    logger.error(errors.ERROR_CODE.ADMIN_NOT_FOUND);
    return;
  }

  const { hash, salt } = await util.passwordHasher(data.password, admin.salt);

  if (hash !== admin.password) {
    logger.error(errors.ERROR_CODE.ADMIN_AUTH_FAILED + ' 관리자 인증 실패하였습니다.');
    return;
  }

  return admin;
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
      if (count.signed_at instanceof Date) {
        const hour = count.signed_at.getHours();
        const email = count.email;

        if (email && !uniqueUsers[email]) {
          uniqueUsers[email] = hour;
        }
      }
    });

    const usersByHour = {};
    Object.values(uniqueUsers).forEach((hour) => {
      usersByHour[hour] = (usersByHour[hour] || 0) + 1;
    });

    return usersByHour;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

/**
 *
 * @returns
 */

exports.getStats = async (period = 'all') => {
  const ds = dataSource('user');
  const repoUser = ds.getRepository(userAccountSchema);
  const repoPlayer = ds.getRepository(playerSchema);
  const dsLogs = dataSource('log');
  const repoLauncher = dsLogs.getRepository(xrsporterPaymentSchema);

  let whereCondition = {};

  if (period !== 'all') {
    let startDate = new Date();
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDate());
        break;
      case 'year':
        startDate = new Date(startDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
        break;
    }
    whereCondition = { created_at: MoreThanOrEqual(startDate) };
  }

  const [userCount, playerCount, xrLauncherCount, spomaruLauncherCount, wizdomboxLauncherCount] = await Promise.all([
    period !== 'all' ? repoUser.count({ where: { ...whereCondition } }) : repoUser.count(),
    period !== 'all' ? repoPlayer.count({ where: { ...whereCondition } }) : repoPlayer.count(),
    period !== 'all' ? repoLauncher.count({ where: { ...whereCondition, type: 'xrsporter' } }) : repoLauncher.count({ where: { type: 'xrsporter' } }),
    period !== 'all' ? repoLauncher.count({ where: { ...whereCondition, type: 'spomaru' } }) : repoLauncher.count({ where: { type: 'spomaru' } }),
    period !== 'all' ? repoLauncher.count({ where: { ...whereCondition, type: 'wizdombox' } }) : repoLauncher.count({ where: { type: 'wizdombox' } }),
  ]);

  return {
    users: userCount,
    players: playerCount,
    xrLauncher: xrLauncherCount,
    spomaruLauncher: spomaruLauncherCount,
    wizdomboxLauncher: wizdomboxLauncherCount,
  };
};

/**
 *
 * @param {*} device
 * @param {*} versionCode
 * @returns
 */
exports.isValidVersion = async (device, versionCode) => {
  if (!versionCode) {
    return false;
  }
  const ds = dataSource('data');
  const repo = ds.getRepository(systemInfoSchema);
  let version;
  switch (device) {
    case 'pc':
      version = await repo.find({ select: { launcher_ver: true } });
      return version[0].launcher_ver == versionCode;
    case 'aos':
      version = await repo.find({ select: { aos_ver: true } });
      return version[0].aos_ver == versionCode;
    case 'ios':
      version = await repo.find({ select: { ios_ver: true } });
      return version[0].ios_ver == versionCode;
    case 'spo':
      version = await repo.find({ select: { spomaru_ver: true } });
      return version[0].spomaru_ver == versionCode;
    case 'fitness':
      version = await repo.find({ select: { fitness_ver: true } });
      return version[0].fitness_ver == versionCode;
    default:
      return false;
  }
};

/**
 *
 * @param {*} device
 * @returns
 */
exports.getVersion = async () => {
  const ds = dataSource('data');
  const repo = ds.getRepository(systemInfoSchema);
  let version = await repo.find({ select: { launcher_ver: true } });
  return version[0].launcher_ver;
};

/**
 *
 * @returns
 */

exports.getAllVersions = async () => {
  const ds = dataSource('data');
  const repo = ds.getRepository(systemInfoSchema);
  let versionsInfo = await repo.find();
  return versionsInfo;
};

/**
 *
 * @returns
 */
exports.getScheduleStats = async (period = 'all') => {
  const ds = dataSource('log');
  const repo = ds.getRepository(scheduleLogSchema);

  let whereCondition = {};

  if (period !== 'all') {
    let startDate = new Date();
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, startDate.getDate());
        break;
      case 'year':
        startDate = new Date(startDate.getFullYear() - 1, startDate.getMonth(), startDate.getDate());
        break;
    }
    whereCondition = { created_at: MoreThanOrEqual(startDate) };
  }

  let allSchedule = await repo.count({ where: { ...whereCondition } });
  let completedSchedule = await repo.count({ where: { ...whereCondition, status: 1 } });

  return { allSchedule, completedSchedule };
};

/**
 *
 * @param {*} admin_id
 * @param {*} action
 * @returns
 */
exports.insertActivityLog = async (admin_id, action) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(adminActivitySchema);

  const newLog = {};
  newLog.admin_id = admin_id;
  newLog.action = action;

  await repo.save(newLog);

  return newLog;
};

/**
 *
 * @returns
 */

exports.getActivityLog = async () => {
  const ds = dataSource('log');
  const repo = ds.getRepository(adminActivitySchema);

  const activityLog = await repo.find({
    order: {
      created_at: 'DESC',
    },
  });
  return activityLog;
};

/**
 *
 * @param {*} id
 * @param {*} password
 * @param {*} name
 */
exports.insertNewAdmin = async (id, password, name, role) => {
  const { hash, salt } = await util.passwordHasher(password);
  const ds = dataSource('log');
  const repo = ds.getRepository(adminSchema);
  let admin = await repo.findOneBy({ id: id });
  if (!admin) {
    admin = await repo.save({
      id: id,
      password: hash,
      name: name,
      role: role,
      salt: salt,
    });
  }
};

exports.getContentDownloadStats = async () => {
  const ds = dataSource('log');
  const repo = ds.getRepository(contentLogsSchema);

  const stats = await repo
    .createQueryBuilder('content')
    .select('SUM(content.download)', 'totalDownload')
    .addSelect('SUM(content.exec)', 'totalExec')
    .getRawOne();

  return stats;
};

/**
 *
 * @param {*} playerId
 * @returns
 */

exports.getPlayerExecStats = async (playerId) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(playContentLogSchema);

  const stats = await repo.count({ where: { player_id: playerId } });

  return { playerExec: stats };
};

/**
 *
 * @param {*} playerId
 * @returns
 */

exports.getPlayerContentLog = async (playerId) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(playContentLogSchema);

  const log = await repo.find({ where: { player_id: playerId }, order: { start_date: 'DESC' }, take: 100 });
  return log;
};

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
