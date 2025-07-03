'use strict';

const { dataSource } = require('../utils/database');
const ContentInfo = require('../entity/data/content-info-schema');
const ContentLogs = require('../entity/log/content-logs-schema');
const ContentVersion = require('../entity/log/content-version-schema');
const ContentPlay = require('../entity/log/play-content-log-schema');
const { In } = require('typeorm');
const userContentSchema = require('../entity/log/user-content-schema');
const logger = require('../utils/logger');
const licenseContentSchema = require('../entity/log/license-content-schema');
const xrsporterPaymentSchema = require('../entity/log/xrsporter-payment-schema');

/**
 * @returns
 */

exports.contentList = async () => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ContentInfo);
  const contents = await repo.find({
    order: {
      title: 'DESC',
    },
  });

  return contents;
};

/**
 * @param {*} contentId
 * @returns
 */

exports.getContent = async (contentId) => {
  const connection = dataSource('data');

  const repo = connection.getRepository(ContentInfo);

  const content = await repo.findOneBy({ content_id: contentId });

  return content;
};
/**
 *
 * @param {*} category
 * @returns
 */

exports.getContentByCat = async (category) => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ContentInfo);
  const content = await repo.find({ where: { category: category } });
  return content;
};

/**
 *
 * @param {*} categories
 * @param {*} sensors
 * @returns
 */

exports.getContentAdvanced = async (categories, sensors) => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ContentInfo);

  const content = await repo.find({ where: { category: In(categories), sensor_type: In(sensors) } });
  return content;
};
/**
 *
 */

exports.getContentCount = async () => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ContentInfo);
  const allContent = await repo.count();
  const liveContent = await repo.count({ where: { state: '0' } });
  const qaContent = await repo.count({ where: { state: '1' } });
  const holdContent = await repo.count({ where: { state: '2' } });

  return { all: allContent, live: liveContent, qa: qaContent, hold: holdContent };
};

/**
 *
 * @param {*} contentData
 */

exports.addNewContent = async (contentData) => {
  try {
    const connection = dataSource('data');
    const connectionLog = dataSource('log');
    const repo = connection.getRepository(ContentInfo);
    const repoUserContent = connectionLog.getRepository(userContentSchema);
    const repoLicenses = connectionLog.getRepository(xrsporterPaymentSchema);

    const lastContent = await repo.createQueryBuilder('content_info').orderBy('CAST(SUBSTRING(content_info.content_id, 4) AS UNSIGNED)', 'DESC').getOne();

    let lastContentNumber = 0;
    if (lastContent) {
      const lastContentId = lastContent.content_id;
      lastContentNumber = parseInt(lastContentId.match(/\d+/)[0], 10);
    }

    const newContentNumber = lastContentNumber + 1;
    const newContentId = `con${newContentNumber.toString().padStart(4, '0')}`;

    const newContent = {
      content_id: newContentId,
      file_name: contentData.file_name,
      download_name: contentData.download_name,
      //추가(download_channel)
      download_channel: contentData.download_channel,
      img_name: contentData.img_name,
      parameter: contentData.parameter,
      is_common_ui: contentData.is_common_ui,
      is_old_auth: contentData.is_old_auth,
      is_popular_contents: contentData.is_popular_contents,
      title: contentData.title,
      title_eng: contentData.title_eng,
      description: contentData.description,
      description_eng: contentData.description_eng,
      exercise_description: contentData.exercise_description,
      short_description: contentData.short_description,
      short_description_eng: contentData.short_description_eng,
      difficulty: contentData.difficulty,
      age: contentData.age,
      playtime: contentData.playtime,
      calorie: contentData.calorie,
      state: contentData.state,
      version: contentData.version,
      player_count: contentData.player_count,
      category: contentData.category,
      sensor_type: contentData.sensor_type,
      sub_category: contentData.sub_category,
      screen_type: contentData.screen_type,
      body_type: contentData.body_type,
      bodypart_type_1: contentData.bodypart_type_1,
      bodypart_type_2: contentData.bodypart_type_2,
      stat_1: contentData.stat_1,
      stat_2: contentData.stat_2,
      stat_3: contentData.stat_3,
      stat_4: contentData.stat_4,
      stat_5: contentData.stat_5,
      stat_6: contentData.stat_6,
      pay_type: contentData.pay_type,
      pay_value: contentData.pay_value,
    };

    const licenses = await repoLicenses.find();

    const newRows = await Promise.all(
      licenses.map(async (license) => {
        const existingRow = await repoUserContent.findOne({
          where: {
            mac_address: license.mac_address,
            content_id: newContentId,
          },
        });

        if (!existingRow) {
          const newRow = await repoUserContent.create({
            mac_address: license.mac_address,
            content_id: newContentId,
            is_active: 1,
          });
          return newRow;
        }

        return null;
      }),
    );

    await repoUserContent.save(newRows);
    await repo.save(newContent);
  } catch (error) {
    console.error('Error adding new content:', error);
    throw new Error('Failed to add new content. Please try again.');
  }
};

/**
 *
 * @param {*} content_id
 * @param {*} type
 * @returns
 */
exports.updateCount = async (content_id, type) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(ContentLogs);

  try {
    const contentLog = await repo.findOne({ where: { content_id } });

    if (contentLog) {
      if (type === 0) {
        const currentDownloadCount = contentLog.download;
        contentLog.download = currentDownloadCount + 1;
      } else if (type === 1) {
        const currentExecCount = contentLog.exec;
        contentLog.exec = currentExecCount + 1;
      } else {
        console.error('Invalid type. Use 0 for download or 1 for execution.');
        return null;
      }

      await repo.save(contentLog);
      return type === 0 ? contentLog.download : contentLog.exec;
    } else {
      const currentCount = {};
      currentCount.content_id = content_id;
      type === 0 ? (currentCount.download = 1) : (currentCount.exec = 1);
      await repo.save(currentCount);
    }
  } catch (error) {
    console.error('Error updating count:', error);
    throw error;
  }
};

/**
 *
 * @param {*} content_id
 * @returns
 */

exports.getCount = async (content_id) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(ContentLogs);
  const contentLog = await repo.findOne({ where: { content_id } });

  if (contentLog) {
    return contentLog;
  } else {
    console.error(`ContentLogs record with content_id ${content_id} not found.`);
    return null;
  }
};

exports.getAllCount = async () => {
  const connection = dataSource('log');
  const repo = connection.getRepository(ContentLogs);
  const contentLog = await repo.find();

  return contentLog;
};

/**
 *
 * @param {*} content_id
 * @param {*} version
 * @returns
 */

exports.updateVersion = async (content_id, version) => {
  const connection1 = dataSource('data');
  const connection2 = dataSource('log');

  const repo1 = connection1.getRepository(ContentInfo);
  const repo2 = connection2.getRepository(ContentVersion);
  const contentInfo = await repo1.findOne({ where: { content_id } });
  let contentInfosWithSameFileName;
  if (contentInfo) {
    if (contentInfo.download_name == null) {
      contentInfosWithSameFileName = await repo1.find({ where: { file_name: contentInfo.file_name } });
    } else {
      contentInfosWithSameFileName = await repo1.find({ where: { file_name: contentInfo.download_name } });
    }

    if (contentInfosWithSameFileName.length > 1) {
      for (const info of contentInfosWithSameFileName) {
        info.version = version;
        await repo1.save(info);
        const contentVersionHistory = {};
        contentVersionHistory.content_id = info.content_id;
        contentVersionHistory.version = version;
        await repo2.save(contentVersionHistory);
      }
    } else {
      contentInfo.version = version;
      await repo1.save(contentInfo);
      const contentVersionHistory = {};
      contentVersionHistory.content_id = content_id;
      contentVersionHistory.version = version;
      await repo2.save(contentVersionHistory);
    }
    return;
  } else {
    console.error('해당 content_id에 대한 데이터가 없습니다.');
    return null;
  }
};

/**
 *
 * @param {*} content_id
 * @returns
 */

exports.getVersionHistory = async (content_id) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(ContentVersion);
  const contentVersionHistory = await repo.find({ where: { content_id: content_id } });

  return contentVersionHistory;
};

/**
 *
 * @param {*} contentData
 * @returns
 */

exports.editContent = async (contentData) => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ContentInfo);
  const content = await repo.findOne({ where: { content_id: contentData.content_id } });

  if (!content) {
    throw new Error(`Content with ID ${contentData.content_id} not found`);
  }
  content.file_name = contentData.file_name;
  content.download_name = contentData.download_name;
  //추가(download_channel)
  content.download_channel = contentData.download_channel;
  content.img_name = contentData.img_name;
  content.parameter = contentData.parameter;
  content.is_common_ui = contentData.is_common_ui;
  content.is_old_auth = contentData.is_old_auth;
  content.is_popular_contents = contentData.is_popular_contents;
  content.title_eng = contentData.title_eng;
  content.description = contentData.description;
  content.description_eng = contentData.description_eng;
  content.exercise_description = contentData.exercise_description;
  content.short_description = contentData.short_description;
  content.short_description_eng = contentData.short_description_eng;
  content.difficulty = contentData.difficulty;
  content.age = contentData.age;
  content.playtime = contentData.playtime;
  content.calorie = contentData.calorie;
  content.state = contentData.state;
  content.player_count = contentData.player_count;
  content.category = contentData.category;
  content.sensor_type = contentData.sensor_type;
  content.sub_category = contentData.sub_category;
  content.screen_type = contentData.screen_type;
  content.body_type = contentData.body_type;
  content.bodypart_type_1 = contentData.bodypart_type_1;
  content.bodypart_type_2 = contentData.bodypart_type_2;
  content.stat_1 = contentData.stat_1;
  content.stat_2 = contentData.stat_2;
  content.stat_3 = contentData.stat_3;
  content.stat_4 = contentData.stat_4;
  content.stat_5 = contentData.stat_5;
  content.stat_6 = contentData.stat_6;
  content.pay_type = contentData.pay_type;
  content.pay_value = contentData.pay_value;

  await repo.save(content);
  return content;
};

/**
 *
 * @param {*} data
 * @returns
 */
exports.startContentLog = async (data) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(ContentPlay);

  const contentPlayLog = {};
  contentPlayLog.player_id = data.player_id;
  contentPlayLog.content_id = data.content_id;

  await repo.save(contentPlayLog);
  return contentPlayLog;
};

/**
 *
 * @param {*} data
 * @returns
 */

exports.endContentLog = async (data) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(ContentPlay);

  const lastGame = await repo.findOne({ where: { player_id: data.player_id, content_id: data.content_id }, order: { start_date: 'DESC' } });

  if (lastGame) {
    lastGame.end_date = data.end_date;
    lastGame.score = data.score;
  }

  await repo.save(lastGame);
  return lastGame;
};

exports.getContentByExec = async (type, value, additionalValue, size, currentPage, macAddress) => {
  const connectionLog = dataSource('log');
  const connectionData = dataSource('data');

  const repoLog = connectionLog.getRepository(ContentLogs);
  const repoData = connectionData.getRepository(ContentInfo);
  const repoLic = connectionLog.getRepository(userContentSchema);
  const repoContLic = connectionLog.getRepository(licenseContentSchema);

  let queryBuilder = repoData.createQueryBuilder('list');

  queryBuilder = queryBuilder.where("list.state = '0'");

  if (type === 'sensor') {
    queryBuilder = queryBuilder.andWhere('list.sensor_type = :typeValue', { typeValue: value });
  } else {
    queryBuilder = queryBuilder.andWhere('list.category = :typeValue', { typeValue: value });
  }

  if (type !== 'sensor' && Array.isArray(additionalValue) && additionalValue.length > 0) {
    queryBuilder = queryBuilder.orWhere('list.category IN (:...additionalValue)', { additionalValue });
  }

  const contentsList = await queryBuilder.getMany();

  const contentIds = contentsList.map((content) => content.content_id);

  let execContent = [];
  if (contentIds.length > 0) {
    execContent = await repoLog
      .createQueryBuilder('content')
      .where('content.content_id IN (:ids)', { ids: contentIds })
      .orderBy('content.exec', 'DESC')
      .getMany();
  }

  const execMap = execContent.reduce((map, content) => {
    map[content.content_id] = content.exec;
    return map;
  }, {});

  // Sort contentsList based on execMap values directly in-memory
  contentsList.sort((a, b) => {
    const execA = execMap[a.content_id] || 0;
    const execB = execMap[b.content_id] || 0;
    return execB - execA;
  });

  const licensedContent = await repoLic.find({ where: { mac_address: macAddress, is_active: 1 } });
  const allowedContentIds = licensedContent.map((item) => item.content_id);

  const allowedLicenses = await repoContLic.find({ where: { mac_address: macAddress } });
  const allowedSensors = allowedLicenses[0].sensor.split('#');
  const allowedCategories = allowedLicenses[0].category.split('#');

  // Filter contentList based on allowed content_ids
  const filteredContentList = contentsList.filter(
    (item) => allowedContentIds.includes(item.content_id) && allowedSensors.includes(item.sensor_type) && allowedCategories.includes(item.category),
  );
  // Calculate pagination
  const contentsListCount = filteredContentList.length;
  const offset = (currentPage - 1) * size;
  const paginatedContents = filteredContentList.slice(offset, offset + size);

  return { paginatedContents, contentsListCount };
};

exports.getFileNameByTitle = async (title) => {
  const connectionData = dataSource('data');
  const repoContent = connectionData.getRepository(ContentInfo);

  const contentResult = await repoContent.findOneBy({ title: title });
  return contentResult;
};

exports.deleteContent = async (contentId) => {
  const connectionData = dataSource('data');
  const connectionLog = dataSource('log');
  const repoContent = connectionData.getRepository(ContentInfo);
  const repoActiveContent = connectionLog.getRepository(userContentSchema);
  await repoActiveContent.delete({ content_id: contentId });
  const result = await repoContent.delete({ content_id: contentId });
  return result.affected > 0;
};
