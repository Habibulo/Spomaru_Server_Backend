'use strict';

const Result = require('../utils/result');
const serviceContent = require('../service/content');
const util = require('../utils/common');
const errors = require('../constants/errors');
const logger = require('../utils/logger');

/**
  * @api {get} /api/content/info/all 콘텐츠 리스트
  * @apiName ContentInfoAll
  * @apiGroup Content
  * @apiVersion 1.0.0
  *
  * @apiSuccess {Number} code 세부 에러코드 (0은 성공)
  * @apiSuccess {String} message 성공 메세지
  * @apiSuccess {Object} content 콘텐츠 배열
  * @apiSuccess {String} content_id 콘텐츠 ID
  * @apiSuccess {String} file_name 콘텐츠 실행 파일 이름 
  * @apiSuccess {String} download_name 콘텐츠 다운로드 파일 이름
  * @apiSuccess {String} img_name 콘텐츠 이미지 파일 이름
  * @apiSuccess {String} parameter 콘텐츠 실행 파라미터
  * @apiSuccess {Number= 0,1} is_common_ui 공통 UI 사용 유무
  * @apiSuccess {Number= 0,1} is_old_auth 예전에 사용한 콘텐츠 인증 유무 
  * @apiSuccess {Number= 0,1} is_popular_contents spomaru 런쳐 기준, 인기 콘텐츠 유무
  * @apiSuccess {String} title 콘텐츠 타이틀 이름
  * @apiSuccess {String} description 상세 설명
  * @apiSuccess {String} exercise_description 운동 효과
  * @apiSuccess {String} short_description 간단 설명
  * @apiSuccess {Number = 0: easy 1: normal 2: hard} difficulty 플레이 난이도
  * @apiSuccess {Number = "ageall": "전체 이용가","age12": "12세 미만","age15": "15세 미만","age18": "청소년 이용불가","es1": "초등학교 1학년","es2": "초등학교 2학년","es3": "초등학교 3학년","es4": "초등학교 4학년","es5": "초등학교 5학년",
"es6": "초등학교 6학년","ms1": "중학교 1학년","ms2": "중학교 2학년","ms3": "중학교 3학년","hs1": "고등학교 1학년","hs2": "고등학교 2학년","hs3": "고등학교 3학년"} age 이용 연령
  * @apiSuccess {Number} playtime 1회 플레이 타임
  * @apiSuccess {Number} calorie 1회 소모 칼로리
  * @apiSuccess {Number = 0:live,1:hold,2:qa} state 콘텐츠 현재 상태
  * @apiSuccess {string} version 콘텐츠 버전
  * @apiSuccess {Number} player_count 이용 플레이어 수
  * @apiSuccess {String = sports, running, study, training, casual, measurement, spomaru math} category  장르
  * @apiSuccess {String = football, baseball, basketball, archery, golf, parkgolf, teeball, footbaseball, bowling, etcsports, remedy, coplay, soloplay, vsplay, make, number,tiniest,higher} sub_category 서브 장르
  * @apiSuccess {String = football,teeball,parkgolf,golf,bowling,touch,foottouch,foot,motion, axis} sensor_type 콘텐츠 사용 센서 타입
  * @apiSuccess {String = single, double, triple, floor, singlefloor, doublefloor, triplefloor} screen_type 콘텐츠 사용 스크린 타입
  * @apiSuccess {String = whole, upper, lower} body_type 운동 부위
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_2 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_3 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_4 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_5 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_6 능력치 타입
  * @apiSuccess {Number = 0:free,1:cash,2:inapp} payment_type 콘텐츠 과금 타입
  * @apiSuccess {Number} payment_value 콘텐츠 과금 비용
  * 
  *  @apiError {String} code
  *  @apiError {string} message Error message.
 */

exports.getContentList = async (ctx) => {
  try {
    const ret = await serviceContent.contentList();
    const responseData = { content: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
  * @api {post} /api/content/info 콘텐츠 정보
  * @apiName ContentInfo
  * @apiGroup Content
  * @apiVersion 1.0.0
  *
  * @apiQuery {Number} contentId
  *
  * @apiSuccess {Number} code 세부 에러코드 (0은 성공)
  * @apiSuccess {String} message 성공 메세지
  * @apiSuccess {Object} content 콘텐츠 배열
  * @apiSuccess {String} content_id 콘텐츠 ID
  * @apiSuccess {String} file_name 콘텐츠 실행 파일 이름
  * @apiSuccess {String} img_name 콘텐츠 이미지 파일 이름
  * @apiSuccess {String} parameter 콘텐츠 실행 파라미터
  * @apiSuccess {Number= 0,1} is_common_ui 공통 UI 사용 유무
  * @apiSuccess {Number= 0,1} is_old_auth 예전에 사용한 콘텐츠 인증 유무 
  * @apiSuccess {Number= 0,1} is_popular_contents spomaru 런쳐 기준, 인기 콘텐츠 유무
  * @apiSuccess {String} title 콘텐츠 타이틀 이름
  * @apiSuccess {String} description 상세 설명
  * @apiSuccess {String} exercise_description 운동 효과
  * @apiSuccess {String} short_description 간단 설명
  * @apiSuccess {Number = 0: easy 1: normal 2: hard} difficulty 플레이 난이도
  * @apiSuccess {Number = "ageall": "전체 이용가","age12": "12세 미만","age15": "15세 미만","age18": "청소년 이용불가","es1": "초등학교 1학년","es2": "초등학교 2학년","es3": "초등학교 3학년","es4": "초등학교 4학년","es5": "초등학교 5학년",
"es6": "초등학교 6학년","ms1": "중학교 1학년","ms2": "중학교 2학년","ms3": "중학교 3학년","hs1": "고등학교 1학년","hs2": "고등학교 2학년","hs3": "고등학교 3학년"} age 이용 연령
  * @apiSuccess {Number} playtime 1회 플레이 타임
  * @apiSuccess {Number} calorie 1회 소모 칼로리
  * @apiSuccess {Number = 0:live,1:hold,2:qa} state 콘텐츠 현재 상태
  * @apiSuccess {string} version 콘텐츠 버전
  * @apiSuccess {Number} player_count 이용 플레이어 수
  * @apiSuccess {String = sports, running, study, training, casual, measurement, spomaru math} category  장르
  * @apiSuccess {String = football, baseball, basketball, archery, golf, parkgolf, teeball, footbaseball, bowling, etcsports, remedy, coplay, soloplay, vsplay, make, number,tiniest,higher} sub_category 서브 장르
  * @apiSuccess {String = football,teeball,parkgolf,golf,bowling,touch,foottouch,foot,motion, axis} sensor_type 콘텐츠 사용 센서 타입
  * @apiSuccess {String = single, double, triple, floor, singlefloor, doublefloor, triplefloor} screen_type 콘텐츠 사용 스크린 타입
  * @apiSuccess {String = whole, upper, lower} body_type 운동 부위
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_2 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_3 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_4 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_5 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_6 능력치 타입
  * @apiSuccess {Number = 0:free,1:cash,2:inapp} payment_type 콘텐츠 과금 타입
  * @apiSuccess {Number} payment_value 콘텐츠 과금 비용


  *  @apiError {String} code
  *  @apiError {string} message Error message.
 */

exports.getContentInfo = async (ctx) => {
  const contentId = ctx.query.content_id;

  try {
    if (util.isEmpty(contentId)) {
      logger.error(errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const ret = await serviceContent.getContent(contentId);
    const responseData = { content: ret };

    return Result.success(ctx, responseData, '콘텐츠 성공적으로 가져왔습니다.');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/content/category 카테고리별 콘텐츠
 * @apiName ContentListByCat
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiBody {String = sports,running,study,training,casual,measurement, spomaru} category 카테고리
 *
  * @apiSuccess {Number} code 세부 에러코드 (0은 성공)
  * @apiSuccess {String} message 성공 메세지
  * @apiSuccess {Object} content 콘텐츠 배열
  * @apiSuccess {String} content_id 콘텐츠 ID
  * @apiSuccess {String} file_name 콘텐츠 실행 파일 이름
  * @apiSuccess {String} download_name 콘텐츠 다운로드 파일 이름
  * @apiSuccess {String} img_name 콘텐츠 이미지 파일 이름
  * @apiSuccess {String} parameter 콘텐츠 실행 파라미터
  * @apiSuccess {Number= 0,1} is_common_ui 공통 UI 사용 유무
  * @apiSuccess {Number= 0,1} is_old_auth 예전에 사용한 콘텐츠 인증 유무 
  * @apiSuccess {Number= 0,1} is_popular_contents spomaru 런쳐 기준, 인기 콘텐츠 유무
  * @apiSuccess {String} title 콘텐츠 타이틀 이름
  * @apiSuccess {String} description 상세 설명
  * @apiSuccess {String} exercise_description 운동 효과
  * @apiSuccess {String} short_description 간단 설명
  * @apiSuccess {Number = 0: easy 1: normal 2: hard} difficulty 플레이 난이도
  * @apiSuccess {Number = "ageall",age12","age15","age18","es1","es2","es3":,"es4","es5",
"es6": ,"ms1": ,"ms2": ","ms3": ,"hs1": ","hs2": ,"hs3"} age 이용 연령
  * @apiSuccess {Number} playtime 1회 플레이 타임
  * @apiSuccess {Number} calorie 1회 소모 칼로리
  * @apiSuccess {Number = 0:live,1:hold,2:qa} state 콘텐츠 현재 상태
  * @apiSuccess {string} version 콘텐츠 버전
  * @apiSuccess {Number} player_count 이용 플레이어 수
  * @apiSuccess {String = sports, running, study, training, casual, measurement, spomaru math} category  장르
  * @apiSuccess {String = football, baseball, basketball, archery, golf, parkgolf, teeball, footbaseball, bowling, etcsports, remedy, coplay, soloplay, vsplay, make, number,tiniest,higher} sub_category 서브 장르
  * @apiSuccess {String = football,teeball,parkgolf,golf,bowling,touch,foottouch,foot,motion, axis} sensor_type 콘텐츠 사용 센서 타입
  * @apiSuccess {String = single, double, triple, floor, singlefloor, doublefloor, triplefloor} screen_type 콘텐츠 사용 스크린 타입
  * @apiSuccess {String = whole, upper, lower} body_type 운동 부위
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_2 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_3 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_4 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_5 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_6 능력치 타입
  * @apiSuccess {Number = 0:free,1:cash,2:inapp} payment_type 콘텐츠 과금 타입
  * @apiSuccess {Number} payment_value 콘텐츠 과금 비용
  * 
  * 
  * @apiError {String} code
  * @apiError {string} message Error message.
 */

exports.getContentByCategory = async (ctx) => {
  const category = ctx.request.body.category;

  try {
    if (util.isEmpty(category)) {
      logger.error(errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const ret = await serviceContent.getContentByCat(category);
    const responseData = { content: ret };

    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

exports.getContentAdvanced = async (ctx) => {
  const categories = ctx.request.body.categories;
  const sensors = ctx.request.body.sensors;

  try {
    const ret = await serviceContent.getContentAdvanced(categories, sensors);
    return Result.success(ctx, ret);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {get} /api/content/count Content Count 콘텐츠 개수
 * @apiName GetContentCount
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 */

exports.getContentCount = async (ctx) => {
  try {
    const ret = await serviceContent.getContentCount();
    return Result.success(ctx, ret);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /content Add New Content
 * @apiName AddNewContent
 * @apiGroup Content
 * @apiVersion 1.0.0(25. 01. 07. 최신화)
 *
 * @apiDescription Adds a new content entry with detailed information.
 *
 * @apiBody {Object} contentData
  * @apiSuccess {String} file_name 콘텐츠 실행 파일 이름
  * @apiSuccess {String} download_name 콘텐츠 다운로드 파일 이름
  * @apiSuccess {String} download_channel 콘텐츠 다운로드 저장소
  * @apiSuccess {String} img_name 콘텐츠 이미지 파일 이름
  * @apiSuccess {String} parameter 콘텐츠 실행 파라미터
  * @apiSuccess {Number= 0,1} is_common_ui 공통 UI 사용 유무
  * @apiSuccess {Number= 0,1} is_old_auth 예전에 사용한 콘텐츠 인증 유무 
  * @apiSuccess {Number= 0,1} is_popular_contents spomaru 런쳐 기준, 인기 콘텐츠 유무
  * @apiSuccess {String} title 콘텐츠 타이틀 이름
  * @apiSuccess {String} description 상세 설명
  * @apiSuccess {String} exercise_description 운동 효과
  * @apiSuccess {String} short_description 간단 설명
  * @apiSuccess {Number = 0: easy 1: normal 2: hard} difficulty 플레이 난이도
  * @apiSuccess {Number = "ageall",age12","age15","age18","es1","es2","es3":,"es4","es5",
"es6": ,"ms1": ,"ms2": ","ms3": ,"hs1": ","hs2": ,"hs3"} age 이용 연령
  * @apiSuccess {Number} playtime 1회 플레이 타임
  * @apiSuccess {Number} calorie 1회 소모 칼로리
  * @apiSuccess {Number = 0:live,1:hold,2:qa} state 콘텐츠 현재 상태
  * @apiSuccess {string} version 콘텐츠 버전
  * @apiSuccess {Number} player_count 이용 플레이어 수
  * @apiSuccess {String = sports, running, study, training, casual, measurement, spomaru, nuri, math, music, sinior(관리자만), touchpang(관리자만)} category  장르
  * @apiSuccess {String = football, baseball, basketball, archery, golf, parkgolf, teeball, footbaseball, bowling, etcsports, remedy, coplay, soloplay, vsplay, es12, es34, es56, sn, nm, stretching, gymnastics, motion, axis, foot, nurihealth, nuricommunication, nurisocial, nuriart, nurinature, rhythm, xrtraining, wefit, fitness, measurement, make, number, tiniest, higher, dosol, musicequipment, physicalactivity(관리자만), cognitiveactivity(관리자만)} sub_category 서브 장르
  * @apiSuccess {String = football, teeball, parkgolf, golf, bowling, touch, foottouch, foot, motion, axis} sensor_type 콘텐츠 사용 센서 타입
  * @apiSuccess {String = single, double, triple, floor, singlefloor, doublefloor, triplefloor} screen_type 콘텐츠 사용 스크린 타입
  * @apiSuccess {String = whole, upper, lower, cardio} body_type 운동 부위
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_2 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_3 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_4 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_5 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_6 능력치 타입
  * @apiSuccess {Number = 0:free,1:cash,2:inapp} payment_type 콘텐츠 과금 타입
  * @apiSuccess {Number} payment_value 콘텐츠 과금 비용
 *
 *  @apiError {String} code
 *  @apiError {string} message Error message.
 *
 */

exports.addNewContent = async (ctx) => {
  const contentData = ctx.request.body;
  const ret = await serviceContent.addNewContent(contentData);
  const responseData = { content: ret };
  return Result.success(ctx, responseData);
};

/**
 * @api {post} /api/content/updateLogCount 콘텐츠 다운로드/실행 횟수 업데이트
 * @apiName UpdateCount
 * @apiGroup Content
 * @apiVersion 1.0.0
 * 
 * @apiBody {String} content_id
 * @apiBody {Number = 1: 다운로드, 2:실행} type 
 * 
 * @apiSuccess {Number} count
 * 
 * @apiError {String} code
 * @apiError {string} message Error message.

 */

exports.updateCount = async (ctx) => {
  const { content_id, type } = ctx.request.body;
  try {
    const ret = await serviceContent.updateCount(content_id, type);
    const responseData = { count: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/content/logCount 콘텐츠 다운로드/실행 횟수
 * @apiName GetCount
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiBody {String} content_id
 * @apiBody {Number = 1: 다운로드, 2:실행} type
 *
 * @apiSuccess {Object} count
 * @apiSuccess {String} seq
 * @apiSuccess {String} content_id
 * @apiSuccess {Number} download
 * @apiSuccess {Number} exec
 * @apiSuccess {String} updated_at
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.getCount = async (ctx) => {
  const { content_id } = ctx.request.body;

  try {
    const ret = await serviceContent.getCount(content_id);
    const responseData = { count: ret };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {get} /api/content/logCountAll 콘텐츠 다운로드/실행 횟수
 * @apiName GetAllCount
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccess {String} seq
 * @apiSuccess {String} content_id
 * @apiSuccess {Number} download
 * @apiSuccess {Number} exec
 * @apiSuccess {String} updated_at
 *
 *  @apiError {String} code
 *  @apiError {string} message Error message.
 */

exports.getAllCount = async (ctx) => {
  try {
    const ret = await serviceContent.getAllCount();

    return Result.success(ctx, ret);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
/**
 * @api {post} /api/content/updateVersion 콘텐츠 버전 업데이트
 * @apiName UpdateVersion
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiBody {String} content_id
 * @apiBody {String} version
 *
 *  @apiError {String} code
 *  @apiError {string} message Error message.
 */

exports.updateContentVersion = async (ctx) => {
  const { content_id, version } = ctx.request.body;
  try {
    await serviceContent.updateVersion(content_id, version);
    return Result.success(ctx, null, '성공적으로 업데이트되었습니다.');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/content/getVersion 콘텐츠 버전 기록
 * @apiName GetVersion
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiBody {String} content_id
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.getVersionHistory = async (ctx) => {
  const content_id = ctx.request.body.content_id;

  try {
    const ret = await serviceContent.getVersionHistory(content_id);
    return Result.success(ctx, ret);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/content/edit 콘텐츠 수정
 * @apiName EditContent
 * @apiVersion 1.0.0
 *
 * @apiBody {Object} contentData
  * @apiSuccess {String} content_id 콘텐츠 ID
  * @apiSuccess {String} file_name 콘텐츠 실행 파일 이름
  * @apiSuccess {String} download_name 콘텐츠 다운로드 파일 이름
  * @apiSuccess {String} download_channel 콘텐츠 다운로드 저장소
  * @apiSuccess {String} img_name 콘텐츠 이미지 파일 이름
  * @apiSuccess {String} parameter 콘텐츠 실행 파라미터
  * @apiSuccess {Number= 0,1} is_common_ui 공통 UI 사용 유무
  * @apiSuccess {Number= 0,1} is_old_auth 예전에 사용한 콘텐츠 인증 유무
  * @apiSuccess {Number= 0,1} is_popular_contents spomaru 런쳐 기준, 인기 콘텐츠 유무
  * @apiSuccess {String} title 콘텐츠 타이틀 이름
  * @apiSuccess {String} description 상세 설명
  * @apiSuccess {String} exercise_description 운동 효과
  * @apiSuccess {String} short_description 간단 설명
  * @apiSuccess {Number = 0: easy 1: normal 2: hard} difficulty 플레이 난이도
  * @apiSuccess {Number = "ageall",age12","age15","age18","es1","es2","es3":,"es4","es5",
"es6": ,"ms1": ,"ms2": ","ms3": ,"hs1": ","hs2": ,"hs3"} age 이용 연령
  * @apiSuccess {Number} playtime 1회 플레이 타임
  * @apiSuccess {Number} calorie 1회 소모 칼로리
  * @apiSuccess {Number = 0:live,1:hold,2:qa} state 콘텐츠 현재 상태
  * @apiSuccess {string} version 콘텐츠 버전
  * @apiSuccess {Number} player_count 이용 플레이어 수
  * @apiSuccess {String = sports, running, study, training, casual, measurement, spomaru, nuri, math, music, sinior(관리자만), touchpang(관리자만)} category  장르
  * @apiSuccess {String = football, baseball, basketball, archery, golf, parkgolf, teeball, footbaseball, bowling, etcsports, remedy, coplay, soloplay, vsplay, es12, es34, es56, sn, nm, stretching, gymnastics, motion, axis, foot, nurihealth, nuricommunication, nurisocial, nuriart, nurinature, rhythm, xrtraining, wefit, fitness, measurement, make, number, tiniest, higher, dosol, musicequipment, physicalactivity(관리자만), cognitiveactivity(관리자만)} sub_category 서브 장르
  * @apiSuccess {String = football, teeball, parkgolf, golf, bowling, touch, foottouch, foot, motion, axis} sensor_type 콘텐츠 사용 센서 타입
  * @apiSuccess {String = single, double, triple, floor, singlefloor, doublefloor, triplefloor} screen_type 콘텐츠 사용 스크린 타입
  * @apiSuccess {String = whole, upper, lower, cardio} body_type 운동 부위
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_1 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_2 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_3 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_4 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_5 능력치 타입
  * @apiSuccess {String = ustr, lstr, dur, fle, fla, coo} stat_6 능력치 타입
  * @apiSuccess {Number = 0:free,1:cash,2:inapp} payment_type 콘텐츠 과금 타입
  * @apiSuccess {Number} payment_value 콘텐츠 과금 비용
  * 
  * 
  * @apiError {String} code
  * @apiError {string} message Error message.
 */

exports.editContent = async (ctx) => {
  const contentData = ctx.request.body;

  try {
    const ret = await serviceContent.editContent(contentData);
    return Result.success(ctx, ret, '콘텐츠 가져왔습니다.');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/content/startContent 콘텐츠 시작 기록
 * @apiName StartContent
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {String} content_id
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.startContentLog = async (ctx) => {
  const logData = ctx.request.body;

  try {
    const ret = await serviceContent.startContentLog(logData);

    return Result.success(ctx, ret);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/content/endContent 콘텐츠 완료 기록
 * @apiName EndContent
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 * @apiBody {String} content_id
 * @apiBody {Number} score
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.endContentLog = async (ctx) => {
  const logData = ctx.request.body;
  logData.end_date = new Date();

  try {
    const ret = await serviceContent.endContentLog(logData);
    return Result.success(ctx, ret);
  } catch (err) {
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/content/contentExec 콘텐츠 실행
 * @apiName ContentExec
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 *
 * @apiBody {String} type The type of content to execute.
 * @apiBody {String} value The main value to use for the content execution.
 * @apiBody {String} [additionalValue] Optional additional value to refine content execution.
 * @apiBody {Number} [size] The number of content items to return (for pagination).
 * @apiBody {Number} [currentPage] The current page number (for pagination).
 * @apiBody {String} [macAddress] Optional MAC address associated with the request.
 *
 * @apiSuccess {Object[]} contentList List of content matching the execution parameters.
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.getContentByExec = async (ctx) => {
  const type = ctx.request.body.type;
  const value = ctx.request.body.value;
  const additionalValue = ctx.request.body.additionalValue;
  const size = ctx.request.body.size;
  const currentPage = ctx.request.body.currentPage;
  const macAddress = ctx.request.body.macAddress;

  try {
    const ret = await serviceContent.getContentByExec(type, value, additionalValue, size, currentPage, macAddress);

    return Result.success(ctx, ret);
  } catch (err) {
    logger.error(err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/content/fileName Get File Name by Title
 * @apiName GetFileNameByTitle
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiDescription Retrieves the file name and associated parameter based on the provided title.
 *
 * @apiBody {String} title The title of the content for which to retrieve the file name.
 *
 * @apiSuccess {String} file_name The name of the file associated with the provided title.
 * @apiSuccess {String} parameter The parameter associated with the file.
 * @returns
 */

exports.getFileNameByTitle = async (ctx) => {
  const title = ctx.request.body.title;

  try {
    const ret = await serviceContent.getFileNameByTitle(title);
    return Result.success(ctx, { title: ret.file_name, parameter: ret.parameter });
  } catch (err) {
    logger.error(err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {delete} /api/content/delete/:id delete content id
 * @apiName DeleteContent
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

exports.deleteContent = async (ctx) => {
  const contentId = ctx.params.id;
  try {
    const ret = await serviceContent.deleteContent(contentId);
    return Result.success(ctx, ret);
  } catch (err) {
    logger.error(err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {get} /api/content/download/json 콘텐츠 리스트 JSON 다운로드
 * @apiName DownloadContentListJSON
 * @apiGroup Content
 * @apiVersion 1.0.0
 *
 * @apiSuccess {File} json JSON 파일 다운로드
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */
exports.downloadContentListJSON = async (ctx) => {
  try {
    const contentList = await serviceContent.contentList();

    // Set response headers for file download
    ctx.set('Content-Type', 'application/json');
    ctx.set('Content-Disposition', 'attachment; filename=content-list.json');

    // Send JSON response
    ctx.body = JSON.stringify(contentList, null, 2);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
