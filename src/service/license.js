'use strict';

const { dataSource } = require('../utils/database');
const spomaruPaymentSchema = require('../entity/log/spomaru-payment-schema');
const xrsporterPaymentSchema = require('../entity/log/xrsporter-payment-schema');
const licenseContentSchema = require('../entity/log/license-content-schema');
const enums = require('../constants/enums');
const { LessThanOrEqual, In } = require('typeorm');
const userContentSchema = require('../entity/log/user-content-schema');
const contentInfoSchema = require('../entity/data/content-info-schema');
const logger = require('../utils/logger');

function formatDate(inputDate) {
  const date = new Date(inputDate);

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;

  //날짜 형식: DD/MM/YYYY HH:mm:ss PM/AM
  const formattedDate = `${day}/${month}/${year} ${formattedHours.toString().padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;

  return formattedDate;
}

/**
 *
 * @param {*} mac
 * @returns
 */
exports.checkSpomaruPayment = async (mac) => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(spomaruPaymentSchema);

    const existingPayment = await repo.findOneBy({ mac_address: mac });
    const currentTime = new Date();
    if (existingPayment) {
      existingPayment.end_date = formatDate(existingPayment.end_date);
      existingPayment.current_date = formatDate(currentTime);
      return existingPayment;
    } else {
      const newPayment = {
        mac_address: mac,
      };

      await repo.save(newPayment);
      const finalResult = await repo.findOneBy({ mac_address: mac });
      finalResult.end_date = formatDate(finalResult.end_date);
      finalResult.current_date = formatDate(currentTime);
      return finalResult;
    }
  } catch (error) {
    console.error('Error in checkSpomaruPayment:', error);
    throw error;
  }
};

/**
 *
 * @param {*} mac
 * @returns
 */
exports.checkXRPayment = async (mac, encrypted) => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(xrsporterPaymentSchema);
    const currentTime = new Date();

    // Try to find existing by mac or encrypted
    const byMac = await repo.findOneBy({ mac_address: mac });
    const byEncrypted = await repo.findOneBy({ mac_address: encrypted });

    // Case 1: Found using old MAC
    if (byMac) {
      if (byMac.mac_address !== encrypted) {
        byMac.mac_address = encrypted;
        await repo.save(byMac);
      }
      byMac.end_date = formatDate(byMac.end_date);
      byMac.current_date = formatDate(currentTime);
      return byMac;
    }

    // Case 2: Already stored using encrypted MAC
    if (byEncrypted) {
      byEncrypted.end_date = formatDate(byEncrypted.end_date);
      byEncrypted.current_date = formatDate(currentTime);
      return byEncrypted;
    }

    // Case 3: Not found - create new with encrypted MAC
    const newPayment = {
      mac_address: encrypted,
    };

    await repo.save(newPayment);
    const finalResult = await repo.findOneBy({ mac_address: encrypted });
    finalResult.end_date = formatDate(finalResult.end_date);
    finalResult.current_date = formatDate(currentTime);
    console.log('New XR Payment Created:', finalResult);
    return finalResult;

  } catch (error) {
    console.error('Error in checkXRPayment:', error);
    throw error;
  }
};

/**
 *
 * @returns
 */

exports.getSpomaruPaymentData = async () => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(spomaruPaymentSchema);

    const paymentData = await repo.find();

    return paymentData;
  } catch (error) {
    console.error('Error in checkSpomaruPayment:', error);
    throw error;
  }
};
/**
 *
 * @returns
 */

exports.getXRSporterPaymentData = async () => {
  try {
    const ds = dataSource('log');
    const repo = ds.getRepository(xrsporterPaymentSchema);

    const paymentData = await repo.find();

    return paymentData;
  } catch (error) {
    console.error('Error in checkXRSporterPayment:', error);
    throw error;
  }
};

exports.setSpomaruPaymentDetails = async (name, mac, end_date) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(spomaruPaymentSchema);

  const existingPaymentData = await repo.findOneBy({ mac_address: mac });

  if (existingPaymentData) {
    existingPaymentData.name = name;
    existingPaymentData.end_date = end_date;

    await repo.save(existingPaymentData);

    return existingPaymentData;
  } else {
    throw new Error('Payment data not found for the given MAC address');
  }
};

exports.setXRSporterPaymentDetails = async (name, mac, type, end_date) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(xrsporterPaymentSchema);

  const existingPaymentData = await repo.findOneBy({ mac_address: mac });

  if (existingPaymentData) {
    existingPaymentData.name = name;
    existingPaymentData.type = type;
    existingPaymentData.end_date = end_date;

    await repo.save(existingPaymentData);

    return existingPaymentData;
  } else {
    throw new Error('Payment data not found for the given MAC address');
  }
};

exports.saveLicenseContent = async (mac, category, sensor, screen) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(licenseContentSchema);

  const existingLicense = await repo.findOneBy({ mac_address: mac });

  if (existingLicense) {
    existingLicense.category = category;
    existingLicense.sensor = sensor;
    existingLicense.screen = screen;
    await repo.save(existingLicense);
    return existingLicense;
  } else {
    const contentLicense = {
      mac_address: mac,
      category,
      sensor,
      screen,
    };

    await repo.save(contentLicense);
    return contentLicense;
  }
};

exports.getLicenseContent = async (mac) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(licenseContentSchema);
  const existingLicense = await repo.findOneBy({ mac_address: mac });

  return existingLicense;
};

exports.initUserContent = async (mac) => {
  const dsContent = dataSource('data');
  const dsLicenseContent = dataSource('log');
  const dsLog = dataSource('log');

  const repoContent = dsContent.getRepository(contentInfoSchema);
  const repoLog = dsLog.getRepository(userContentSchema);

  const contents = await repoContent.find();

  const newRows = await Promise.all(
    contents.map(async (content) => {
      const newRow = repoLog.create({
        mac_address: mac,
        content_id: content.content_id,
        is_active: 1,
      });
      return newRow;
    }),
  );

  logger.warn('new', JSON.stringify(newRows));

  await repoLog.save(newRows);
};

exports.initLicenseContent = async (mac, encrypted) => {
  const dsContent = dataSource('data');
  const dsLog = dataSource('log');

  const repoContent = dsContent.getRepository(contentInfoSchema);
  const repoUserContent = dsLog.getRepository(userContentSchema);
  const repoLicenseContent = dsLog.getRepository(licenseContentSchema);

  const contents = await repoContent.find();

  const macSafe = mac || `unknown-mac-${Date.now()}`;
  const fingerprintSafe = encrypted || `unknown-fp-${Date.now()}`;

  const licenseByMac = await repoLicenseContent.findOneBy({ mac_address: macSafe });
  const licenseByEncrypted = await repoLicenseContent.findOneBy({ mac_address: fingerprintSafe });

  // Case 1: mac exists → update mac to encrypted if different
  if (licenseByMac) {
    if (licenseByMac.mac_address !== fingerprintSafe) {
      licenseByMac.mac_address = fingerprintSafe;
      await repoLicenseContent.save(licenseByMac);
    }
    return licenseByMac;
  }

  // Case 2: encrypted already exists
  if (licenseByEncrypted) {
    return licenseByEncrypted;
  }

  // Case 3: Not found → create new
  const contentLicense = {
    mac_address: fingerprintSafe,
    category: Object.keys(enums.CATEGORY_TYPE).join('#').toLowerCase(),
    sensor: Object.keys(enums.SENSOR_TYPE).join('#').toLowerCase(),
    screen: Object.keys(enums.SCREEN_TYPE).join('#').toLowerCase(),
  };
  await repoLicenseContent.save(contentLicense);

  const newRows = contents.map((content) =>
    repoUserContent.create({
      mac_address: fingerprintSafe,
      content_id: content.content_id,
      is_active: 1,
    })
  );
  await repoUserContent.save(newRows);

  return contentLicense;
};


exports.getActiveUserContent = async (mac) => {
  const dsLog = dataSource('log');
  const dsContent = dataSource('data');

  const repoLog = dsLog.getRepository(userContentSchema);
  const repoContent = dsContent.getRepository(contentInfoSchema);

  const userContent = await repoLog.find({ where: { mac_address: mac, is_active: 1 } });
  // logger.info(`Found ${userContent.length} existing contents for MAC: ${mac}`);


  const contentIds = userContent.map((item) => item.content_id);

  const contentInfo = await repoContent.find({
    where: {
      content_id: In(contentIds),
    },
    select: ['content_id', 'category', 'sub_category', 'sensor_type'],
  });

  const joinedArray = userContent.map((item1) => {
    const matchingItem = contentInfo.find((item2) => item2.content_id === item1.content_id);
    return { ...item1, ...matchingItem };
  });

  return joinedArray;
};

exports.getInstalledCount = async () => {
  const ds = dataSource('log');
  const repo = ds.getRepository(xrsporterPaymentSchema);
  const currentDate = new Date();

  const allLicenseXR = await repo.count({ where: { type: 'xrsporter' } });
  const allLicenseSpomaru = await repo.count({ where: { type: 'spomaru' } });
  const allLicenseWizdombox = await repo.count({ where: { type: 'wizdombox' } });

  const finishedLicenseXR = await repo
    .createQueryBuilder()
    .where({ type: 'xrsporter', end_date: LessThanOrEqual(currentDate) })
    .getCount();

  const finishedLicenseSpomaru = await repo
    .createQueryBuilder()
    .where({ type: 'spomaru', end_date: LessThanOrEqual(currentDate) })
    .getCount();

  const finishedLicenseWizdombox = await repo
    .createQueryBuilder()
    .where({ type: 'wizdombox', end_date: LessThanOrEqual(currentDate) })
    .getCount();

  return {
    allLicenseXR,
    allLicenseSpomaru,
    finishedLicenseXR,
    finishedLicenseSpomaru,
    allLicenseWizdombox,
    finishedLicenseWizdombox,
  };
};

exports.changeLauncherType = async (mac, type) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(xrsporterPaymentSchema);
  const existingLicense = await repo.findOneBy({ mac_address: mac });
  existingLicense.type = type;
  await repo.save(existingLicense);

  return existingLicense;
};

exports.changeContentActiveStatus = async (mac, contentIds) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(userContentSchema);
  const existingContents = await repo.find({ where: { mac_address: mac } });

  for (const contentIdKey in contentIds) {
    const isActive = contentIds[contentIdKey] ? 1 : 0;

    const existingContent = existingContents.find((content) => content.content_id === contentIdKey);

    if (existingContent) {
      if (existingContent.is_active !== isActive) {
        await repo.update(existingContent, { is_active: isActive });
      }
    } else {
      const newContent = await repo.create({
        mac_address: mac,
        content_id: contentIdKey,
        is_active: isActive,
      });
      await repo.save(newContent);
      // logger.info(`Inserted content_id=${contentIdKey}, is_active=${isActive}`);
      // logger.info(`New content inserted:`, newContent);
    }
  }
};

exports.checkLauncherType = async (mac) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(xrsporterPaymentSchema);
  const launcherType = await repo.findOneBy({ mac_address: mac });

  return launcherType.type;
};

exports.deleteLicense = async (seq) => {
  const ds = dataSource('log');
  const repo = ds.getRepository(xrsporterPaymentSchema);
  const result = await repo.delete({ seq: seq });
  return result.affected > 0;
};


exports.syncAllLicenseContent = async () => {
  const dsLog = dataSource('log');
  const licenseRepo = dsLog.getRepository(licenseContentSchema);
  const userContentRepo = dsLog.getRepository(userContentSchema);
  const contentRepo = dataSource('data').getRepository(contentInfoSchema);

  const allLicenses = await licenseRepo.find();
  const allContents = await contentRepo.find();

  for (const license of allLicenses) {
    const mac = license.mac_address;

    // Add missing enum values
    const updatedCategory = enums.CATEGORY_TYPE
      ? Object.keys(enums.CATEGORY_TYPE).join('#').toLowerCase()
      : license.category;
    const updatedSensor = enums.SENSOR_TYPE
      ? Object.keys(enums.SENSOR_TYPE).join('#').toLowerCase()
      : license.sensor;
    const updatedScreen = enums.SCREEN_TYPE
      ? Object.keys(enums.SCREEN_TYPE).join('#').toLowerCase()
      : license.screen;

    license.category = updatedCategory;
    license.sensor = updatedSensor;
    license.screen = updatedScreen;

    await licenseRepo.save(license);

    // Ensure all content_info rows exist in user_content
    const existingUserContents = await userContentRepo.find({ where: { mac_address: mac } });
    const existingContentIds = existingUserContents.map(uc => uc.content_id);

    const missingContents = allContents.filter(
      content => !existingContentIds.includes(content.content_id)
    );

    const newRows = missingContents.map(content =>
      userContentRepo.create({
        mac_address: mac,
        content_id: content.content_id,
        is_active: 1,
      })
    );

    if (newRows.length > 0) {
      await userContentRepo.save(newRows);
      console.log(`✅ Synced ${newRows.length} contents for MAC ${mac}`);
    }
  }

  return { message: 'License content sync complete.' };
};
