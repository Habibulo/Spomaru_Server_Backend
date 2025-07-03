const errors = require('../constants/errors');
const util = require('../utils/common');
const Result = require('../utils/result');
const serviceLicense = require('../service/license');

/**
 * @api {post} /api/spomaru/checkPayment 스포마루 결제 여부
 * @apiName SpomaruPaymentCheck
 * @apiGroup License
 * @apiDescription 스포마루 결제 상태 확인
 *
 * @apiBody {string} mac 확인할 결제의 MAC 주소입니다.
 *
 * @apiSuccess {number} seq 공유번호
 * @apiSuccess {string} name 기관 이름
 * @apiSuccess {string} mac_address
 * @apiSuccess {date} end_date 결제가 여부
 * @apiSuccess {date} current_date 현제 날짜
 *
 *
 */
exports.checkSpomaruPayment = async (ctx) => {
  const mac = ctx.request.body.mac;

  if (util.isEmpty(mac)) {
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
  }

  const existingPayment = await serviceLicense.checkSpomaruPayment(mac);

  return Result.success(ctx, { end_date: existingPayment });
};

/**
 * @api {post} /api/xrsporter/checkPayment  check XR Payment
 * @apiName XRSporterPaymentCheck
 * @apiGroup License
 * @apiDescription XRSPORTER 결제 상태 확인
 *
 * @apiBody {string} mac 확인할 결제의 MAC 주소입니다.
 *
 * @apiSuccess {number} seq 공유번호
 * @apiSuccess {string} name 기관 이름
 * @apiSuccess {string} mac_address
 * @apiSuccess {date} end_date 결제가 여부
 * @apiSuccess {date} current_date 현제 날짜
 */
exports.checkXRPayment = async (ctx) => {
  const mac = ctx.request.body.mac;
  const encrypted = ctx.request.body.encrypted

  if (util.isEmpty(mac)) {
    return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
  }

  const existingPayment = await serviceLicense.checkXRPayment(mac, encrypted);

  return Result.success(ctx, { end_date: existingPayment });
};

/**
 *
 * @api {post} /api/spomaru/getPaymentData  스포마루 결제 정보
 * @apiName SpomaruPaymentData
 * @apiGroup License
 * @apiDescription 스포마루 결제 리스트
 *
 * @apiSuccess {number} seq 공유번호
 * @apiSuccess {string} name 기관 이름
 * @apiSuccess {string} mac_address
 * @apiSuccess {date} end_date 결제가 여부
 * @apiSuccess {date} current_date 현제 날짜

 */
exports.getSpomaruPaymentData = async (ctx) => {
  const paymentData = await serviceLicense.getSpomaruPaymentData();
  return Result.success(ctx, paymentData);
};

/**
 * @api {post} /api/xrsporter/getPaymentData XRSporter 결제 정보 조회
 * @apiName GetXRSporterPayment
 * @apiGroup License
 * @apiDescription XRSporter 결제 리스트
 *
 * @apiSuccess {number} seq 공유번호
 * @apiSuccess {string} name 기관 이름
 * @apiSuccess {string} mac_address
 * @apiSuccess {date} end_date 결제가 여부
 * @apiSuccess {date} current_date 현제 날짜
 */
exports.getXRSporterPaymentData = async (ctx) => {
  const paymentData = await serviceLicense.getXRSporterPaymentData();
  return Result.success(ctx, paymentData);
};

/**
 *
 * @api {post} /api/spomaru/setPaymentData  스포마루 결제 정보 저장
 * @apiName SaveSpomaruPayment
 * @apiGroup License
 * @apiDescription 스포마루 결제 정보 저장
 *
 * @apiBody {string} mac 확인할 결제의 MAC 주소입니다.
 * @apiBody {string} name
 * @apiBody {date} end_date
 */

exports.setSpomaruPaymentDetails = async (ctx) => {
  const name = ctx.request.body.name;
  const mac = ctx.request.body.mac;
  const end_date = ctx.request.body.end_date;

  const paymentData = await serviceLicense.setSpomaruPaymentDetails(name, mac, end_date);
  return Result.success(ctx, paymentData);
};
/**
 * @api {post} /api/xrsporter/setPaymentData XRSporter 결제 정보 저장
 * @apiName SaveXRSporterPayment
 * @apiGroup License
 * @apiDescription XRSporter 결제 정보 저장
 *
 * @apiBody {string} mac 확인할 결제의 MAC 주소입니다.
 * @apiBody {string} name
 * @apiBody {date} end_date
 *
 */
exports.setXRSporterPaymentData = async (ctx) => {
  const name = ctx.request.body.name;
  const mac = ctx.request.body.mac;
  const type = ctx.request.body.type;
  const end_date = ctx.request.body.end_date;

  const paymentData = await serviceLicense.setXRSporterPaymentDetails(name, mac, type, end_date);
  return Result.success(ctx, paymentData);
};
/**
 * @api {post} /api/license/saveLicenseContent 라이선스 콘텐츠 저장
 * @apiName SaveLicenseContent
 * @apiGroup License
 *
 * @apiBody {String} mac 확인할 결제의 MAC 주소입니다.
 * @apiBody {String} category Category of the license.
 * @apiBody {String} sensor Sensor information.
 * @apiBody {String} screen Screen information.
 *
 *
 */
exports.saveLicenseContent = async (ctx) => {
  const mac = ctx.request.body.mac;
  const category = ctx.request.body.category;
  const sensor = ctx.request.body.sensor;
  const screen = ctx.request.body.screen;

  const licenseContent = await serviceLicense.saveLicenseContent(mac, category, sensor, screen);
  return Result.success(ctx, licenseContent);
};
/**
 * @api {post} /api/license/getLicenseContent 라이선스 콘텐츠 조회
 * @apiName GetLicenseContent
 * @apiGroup License
 *
 * @apiBody {String} mac MAC address of the device.
 *
 */
exports.getLicenseContent = async (ctx) => {
  const mac = ctx.request.body.mac;

  const licenseContent = await serviceLicense.getLicenseContent(mac);
  return Result.success(ctx, licenseContent);
};

/**
 * @api {post} /api/license/initUserContent 콘텐츠 초기화
 * @apiName InitLUserContent
 * @apiGroup License
 *
 * @apiBody {String} mac MAC address of the device.
 */

exports.initUserContent = async (ctx) => {
  const mac = ctx.request.body.mac;
  const encrypted = ctx.request.body.encrypted

  try {
    const userContent = await serviceLicense.initUserContent(mac, encrypted);
    return Result.success(ctx, userContent, '데이터가 성공적으로 추가되었습니다.');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/license/initContent 라이선스 콘텐츠 초기화
 * @apiName InitLicenseContent
 * @apiGroup License
 *
 * @apiBody {String} mac MAC address of the device.
 *
 */
exports.initLicenseContent = async (ctx) => {
  const mac = ctx.request.body.mac;
  const encrypted = ctx.request.body.encrypted

  const licenseContent = await serviceLicense.initLicenseContent(mac, encrypted);

  return Result.success(ctx, licenseContent);
};

exports.getActiveUserContent = async (ctx) => {
  const mac = ctx.request.body.mac;

  try {
    const userContent = await serviceLicense.getActiveUserContent(mac);
    return Result.success(ctx, userContent);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {get} /api/license/getCount 설치 수
 * @apiName getInstalledCount
 * @apiGroup License
 *
 */
exports.getInstalledCount = async (ctx) => {
  const devicesCount = await serviceLicense.getInstalledCount();
  return Result.success(ctx, devicesCount);
};

/**
 * @api {post} /api/license/changeType Change Launcher Type
 * @apiName ChangeLauncherType
 * @apiGroup License
 * @apiVersion 1.0.0
 * 
 * @apiDescription Changes the launcher type based on the provided MAC address.
 * 
 * @apiBody {String} mac The MAC address of the device.
 * @apiBody {String} type The new launcher type to set.
 * 
 * @apiSuccess {Object} response The response object from the service.
 * 
 * 
 * @apiError {String} code Error code.
 * @apiError {String} message Error message.
 * 

 */

exports.changeLauncherType = async (ctx) => {
  const mac = ctx.request.body.mac;
  const type = ctx.request.body.type;

  try {
    const res = await serviceLicense.changeLauncherType(mac, type);
    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/license/changeContentActive Change Content Status
 * @apiName ChangeContentStatus
 * @apiGroup License
 * @apiVersion 1.0.0
 *
 * @apiDescription Changes the active status of content based on the provided MAC address and content IDs.
 *
 * @apiBody {String} mac The MAC address of the device.
 * @apiBody {String[]} contentIds Array of content IDs to change the status for.
 *
 * @apiSuccess {String} message Success message indicating the status change.
 *
 * @apiError {String} code Error code.
 * @apiError {String} message Error message.
 *

 */

exports.changeContentStatus = async (ctx) => {
  const mac = ctx.request.body.mac;
  const contentIds = ctx.request.body.contentIds;

  try {
    await serviceLicense.changeContentActiveStatus(mac, contentIds);
    return Result.success(ctx, '', '변경되었습니다');
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/license/launcherType Check Launcher Type
 * @apiName CheckLauncherType
 * @apiGroup License
 * @apiVersion 1.0.0
 *
 * @apiDescription Checks the current launcher type based on the provided MAC address.
 *
 * @apiBody {String} mac The MAC address of the device.
 *
 * @apiSuccess {String} launcher The current launcher type of the device.
 *
 *
 * @apiError {String} code Error code.
 * @apiError {String} message Error message.
 *
 */

exports.checkLauncherType = async (ctx) => {
  const mac = ctx.request.body.mac;

  try {
    const res = await serviceLicense.checkLauncherType(mac);
    return Result.success(ctx, { launcher: res });
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {delete} /api/license/delete/:id delete license id
 * @apiName DeleteLicense
 * @apiGroup License
 * @apiVersion 1.0.0
 *
 * @apiDescription Add seq-based permission deletion function on server
 *
 * @apiBody {String} ??
 *
 * @apiSuccess {String} ??
 *
 *
 * @apiError {String} code Error code.
 * @apiError {String} message Error message.
 *
 */

exports.deleteLicense = async (ctx) => {
  const seq = ctx.params.id;
  try {
    const res = await serviceLicense.deleteLicense(seq);
    return Result.success(ctx, res);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};
