'use strict';

const schedule = require('node-schedule');
const logger = require('../utils/logger');
const seviceAdmin = require('../service/admin');
const { getAllScheduleData } = require('../service/redis');

/**
 * Schedule job to log incomplete schedules daily at 23:50.
 */

//매일 23: 50분 :완료되지 않은 스케줄 로그호 기록한다
const jobScheduleLog = schedule.scheduleJob('jobScheduleLog', '50 23 * * *', async () => {
  try {
    const sched = await getAllScheduleData();
    logger.info('[SCHEDULE LOG ]');

    // change data into format that segregates it by player_id
    const groupedData = Object.entries(sched).reduce((result, value) => {
      const firstPart = value[0].split(':')[0];
      (result[firstPart] || (result[firstPart] = [])).push(value[1]);
      return result;
    }, {});

    await Promise.all(
      Object.entries(groupedData).map(async ([player_id, value1]) => {
        const totalCount = value1.length;
        const isCompleteCount = value1.reduce((count, entry) => count + (entry.is_complete === '1' ? 1 : 0), 0);
        const isCompletePercentage = isCompleteCount / totalCount;

        await seviceAdmin.writeLog('schedule_log', {
          player_id,
          set_id: value1[0][1].set_id,
          progress: isCompletePercentage,
          status: 2, // 2 : time_over
        });
      }),
    );
  } catch (error) {
    logger.error('Logging schedule failed:', error);
  }
});

module.exports = {
  jobScheduleLog,
};
