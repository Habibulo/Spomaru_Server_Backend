/* eslint-disable no-unused-vars */
'use strict';
const Router = require('@koa/router');

const userController = require('../controllers/user');
const authController = require('../controllers/auth');
const playerController = require('../controllers/player');
const contentController = require('../controllers/content');
const inventoryController = require('../controllers/inventory');
const itemController = require('../controllers/item');
const statsController = require('../controllers/stats');
const characterController = require('../controllers/character');
const imagesController = require('../controllers/image');
const scheduleController = require('../controllers/schedule');
const adminController = require('../controllers/admin');
const licenseController = require('../controllers/license');
const notificationController = require('../controllers/notification');
//const notificationController = require('../controllers/notification');
const router = new Router();

//admin
router.post('/api/admin/login', adminController.loginAdmin);
router.get('/api/admin/logs', adminController.getLog);
router.get('/api/admin/users/today/hourly', adminController.getTodaysUsersByHours);
router.get('/api/admin/user-stats', adminController.getStats);
router.put('/api/admin/server-status', adminController.setServerState);
router.get('/api/admin/schedule-stats', adminController.getScheduleStats);
router.get('/api/admin/setting/version', adminController.getAllVersions);
router.get('/api/admin/last-login-date', adminController.getLastLoginDate);
router.post('/api/admin/activity-log', adminController.insertActivityLog);
router.get('/api/admin/activity-log', adminController.getActivityLog);
router.post('/api/admin/admins', adminController.insertNewAdmin);
router.get('/api/admin/content-stats', adminController.getContentDownloadExecStats);
router.get('/api/admin/player/content-stats', adminController.getPlayerExecStats);
router.get('/api/admin/player/content-log', adminController.getPlayerContentLog);

// Does not fully adhere to REST principles – consider refactoring
//settings
router.post('/api/setting/version', adminController.isValidVersion);
router.get('/api/setting/launcherDownload', adminController.downloadLauncher);
router.get('/api/setting/spomaruDownload', adminController.downloadSpomaruLauncher);
router.post('/api/setting/downloadProgram', adminController.downloadProgram);
router.get('/api/setting/versionLauncher', adminController.getLauncherVersion);

//auth
router.get('/api/auth/qr', authController.generateQr);
router.post('/api/auth/remote-auth', authController.remoteAuth);
router.post('/api/auth/confirm', authController.loginConfirmation);
router.post('/api/auth/cancel', authController.loginCancellation);

//user 유저
router.get('/api/user/info', userController.getSingleUserInfo);
router.get('/api/user/info/all', userController.getUsers);
router.post('/api/user/create', userController.createUser);
router.put('/api/user/state', userController.changeState);
router.put('/api/user/cash', userController.updateCash);

//player
router.post('/api/player/create', playerController.createPlayer);
router.get('/api/player/get', playerController.getPlayer);
router.get('/api/player/players', playerController.getAllPlayersData);
router.put('/api/player/update/nickname', playerController.changeNickname);
router.put('/api/player/update/info', playerController.updatePlayerData);
router.get('/api/player/count', playerController.getPlayerCount);
router.get('/api/player/slot', playerController.getPlayerSlotByUser);

//player stats
router.post('/api/player/stats/init', statsController.setStats);
router.post('/api/player/stats/add', statsController.updateStatByType);
router.get('/api/player/stats/get', statsController.getPlayerStats);
router.post('/api/player/stats/history', statsController.getPlayerStatsHistory);
router.post('/api/player/stats/type', statsController.getPlayerStatByType);

//character
router.post('/api/player/character/create', characterController.createCharacter);
router.post('/api/player/character', characterController.characterInfo);
router.post('/api/player/character/change', characterController.characterCostumeChange);

//inventory
router.post('/api/player/inven/insert', inventoryController.insertItemInven);
router.post('/api/player/inven/get', inventoryController.getInven);
router.post('/api/player/inven/delete', inventoryController.deleteInven);

//content
router.get('/api/content/info', contentController.getContentInfo);
router.get('/api/content/info/all', contentController.getContentList);
router.get('/api/content/download/json', contentController.downloadContentListJSON); // 새로운 JSON 다운로드 라우터
router.post('/api/content/category', contentController.getContentByCategory);
router.post('/api/content/add', contentController.addNewContent);
router.post('/api/content/edit', contentController.editContent);
router.get('/api/content/count', contentController.getContentCount);
router.post('/api/content/logCount', contentController.getCount);
router.put('/api/content/log-count', contentController.updateCount);
router.post('/api/content/updateVersion', contentController.updateContentVersion);
router.post('/api/content/getVersion', contentController.getVersionHistory);
router.get('/api/content/logCountAll', contentController.getAllCount);
router.post('/api/content/start', contentController.startContentLog);
router.post('/api/content/endContent', contentController.endContentLog);
router.post('/api/content/advanced', contentController.getContentAdvanced);
router.post('/api/content/exec', contentController.getContentByExec);
router.post('/api/content/fileName', contentController.getFileNameByTitle);
router.delete('/api/content/delete/:id', contentController.deleteContent);

//schedule -- currently not used
router.get('/api/schedule/info/all', scheduleController.setInfoAll);
router.post('/api/schedule/info', scheduleController.setInfo);
router.post('/api/schedule/start', scheduleController.startSchedule);
router.post('/api/schedule/current', scheduleController.getCurrentSchedule);
router.get('/api/schedule/content/all', scheduleController.setContentAll);
router.post('/api/schedule/update', scheduleController.updateContentCompletion);
router.post('/api/schedule/delete', scheduleController.stopCurrentSchedule);
router.post('/api/schedule/setcontent', scheduleController.getContentBySet);
router.post('/api/schedule/getLog', scheduleController.getUserScheduleLog);
router.post('/api/schedule/getLogByDate', scheduleController.getScheduleLogByDate);

//item
router.get('/api/item', itemController.getOneItem);
router.get('/api/item/type', itemController.getAllItemsByType);
router.get('/api/item/parts', itemController.getCostumeByPart);

//image
router.get('/api/images', imagesController.getImageFiles);

//license
router.post('/api/spomaru/checkPayment', licenseController.checkSpomaruPayment);
router.post('/api/spomaru/getPaymentData', licenseController.getSpomaruPaymentData);
router.post('/api/spomaru/setPaymentData', licenseController.setSpomaruPaymentDetails);
router.post('/api/xrsporter/checkPayment', licenseController.checkXRPayment);
router.post('/api/xrsporter/getPaymentData', licenseController.getXRSporterPaymentData);
router.post('/api/xrsporter/setPaymentData', licenseController.setXRSporterPaymentData);
router.post('/api/license/saveLicenseContent', licenseController.saveLicenseContent);
router.post('/api/license/getLicenseContent', licenseController.getLicenseContent);
router.post('/api/license/initContent', licenseController.initLicenseContent);
router.post('/api/license/initUserContent', licenseController.initUserContent);
router.get('/api/license/getCount', licenseController.getInstalledCount);
router.post('/api/license/changeType', licenseController.changeLauncherType);
router.post('/api/license/getActiveUserContent', licenseController.getActiveUserContent);
router.post('/api/license/changeContentActive', licenseController.changeContentStatus);
router.post('/api/license/launcherType', licenseController.checkLauncherType);
router.delete('/api/license/delete/:id', licenseController.deleteLicense);
router.post('/api/license/syncLicenseContent', licenseController.syncLicenseContent);

// Notification (generic)
router.get('/api/notification/latest', notificationController.getLatest);
router.get('/api/notification/getAll', notificationController.list);
router.get('/api/notification/get/:id', notificationController.getById);
router.post('/api/notification/create', notificationController.create);
router.put('/api/notification/edit/:id', notificationController.update);
router.delete('/api/notification/delete/:id', notificationController.remove);

// Per-user dismiss
router.post('/api/notification/:id/dismiss', notificationController.dismiss);

//test
router.get('/test', async (ctx) => {
  ctx.body = { message: 'Test route is working!' };
});
module.exports = router;
