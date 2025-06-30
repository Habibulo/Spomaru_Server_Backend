'use strict';

const Result = require('../utils/result');
const servicePlayer = require('../service/player');
const serviceUser = require('../service/user');
const serviceStats = require('../service/stats');
const util = require('../utils/common');
const errors = require('../constants/errors');
const httpStatus = require('http-status');
const logger = require('../utils/logger');

/**
 * @api {post} /api/player/create 플레이어 생성
 * @apiName CreatePlayer
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {number} user_seq 사용자 시퀀스
 * @apiBody {number} slot_num 생성 슬롯 번호
 * @apiBody {String} nickname 플레이어 닉네임
 * @apiBody {number} gender 캐릭터 성별
 * 
 * @apiSuccess {Object} player 플레이어 정보
 * @apiSuccess {String} player_id 플레이어 ID
 * @apiSuccess {Number} user_seq 사용자 시퀀스
 * @apiSuccess {Number} slot_num 생성 슬롯 번호
 * @apiSuccess {String} nickname 플레이어 닉네임
 * 
 * 
 * @apiSuccess {Object} stats 초기 능력치 정보
 * @apiSuccess {Number} ustr 플레이어 근력  
 * @apiSuccess {Number} lstr 플레이어 지력
 * @apiSuccess {Number} dur 플레이어 체력
 * 
 * @apiSuccess {String} fle 플레이어 민첩성
 * @apiSuccess {Number} fla 플레이어 지구력
 * @apiSuccess {Number} coo 플레이어 숙련도
 *
 * 
 * @apiSuccess {Number} code 성공 코드
 * @apiSuccess {String} message 성공 메시지


 */
function generatePlayerId(user) {
  const timestamp = Date.now().toString(36);
  const playerId = 'pl_' + timestamp + user;
  return playerId;
}

exports.createPlayer = async (ctx) => {
  const { user_seq, slot_num, nickname, gender } = ctx.request.body;

  const player_id = generatePlayerId(user_seq);
  try {
    const emptyParams = [];

    if (util.isEmpty(user_seq)) {
      emptyParams.push('user_seq');
    }

    if (util.isEmpty(slot_num)) {
      emptyParams.push('slot_num');
    }

    if (util.isEmpty(nickname)) {
      emptyParams.push('nickname');
    }

    if (util.isEmpty(gender)) {
      emptyParams.push('gender');
    }

    if (emptyParams.length > 0) {
      const errorMessage = `필수 매개변수 ${emptyParams.join(', ')}가 비어 있습니다.`;
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, errorMessage);
    }

    const newPlayer = await servicePlayer.createNewPlayer({ player_id, user_seq, slot_num, nickname, gender });

    if (!newPlayer) {
      return Result.error(ctx, httpStatus.INTERNAL_SERVER_ERROR, '플레이어 추가 실패');
    }

    const initStats = await serviceStats.setStats(player_id);

    const responseData = { player: newPlayer, stats: initStats };
    return Result.success(ctx, responseData, '새 플레이어가 성공적으로 생성되었습니다.');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/update/info 플레이어 데이터 수정
 * @apiName UpdatePlayerData
 * @apiGroup Player
 *
 * @apiBody {String} player_id 플레이어 ID
 * @apiBody {number} gender 플레이어 성별
 * @apiBody {String} nickname
 * @apiBody {Number} age 플레이어 나이
 * @apiBody {Number} weight 플레이어 체중 [kg]
 * @apiBody {Number} height 플레이어 키 [cm]
 * @apiBody {String} post 플레이어 프로필 상태글
 * @apiBody {String} img 플레이어 프로필 이미지
 * @apiBody {Number} heartrate
 * @apiBody {Number} bloodpressure_upper
 * @apiBody {Number} bloodpressure_lower
 * @apiBody {Number} bmi
 * @apiBody {Number} muscle
 * @apiBody {Number} fatrate
 * @apiBody {Number} pants
 * @apiBody {Number} abdomenrate
 *
 * @apiSuccess {Number} code 성공 코드
 * @apiSuccess {String} message 성공 메시지
 * */

exports.updatePlayerData = async (ctx) => {
  const {
    player_id,
    gender,
    nickname,
    age,
    weight,
    height,
    post,
    img,
    heartrate,
    bloodpressure_lower,
    bloodpressure_upper,
    bmi,
    muscle,
    fatrate,
    pants,
    abdomenrate,
  } = ctx.request.body;

  try {
    if (util.isEmpty(player_id)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }

    const responseData = await servicePlayer.updatePlayerData(
      player_id,
      gender,
      nickname,
      age,
      weight,
      height,
      post,
      img,
      heartrate,
      bloodpressure_lower,
      bloodpressure_upper,
      bmi,
      muscle,
      fatrate,
      pants,
      abdomenrate,
    );

    return Result.success(ctx, responseData, '플레이어 정보가 변경되었습니다');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/player/get 플레이어 정보 조회
 * @apiName GetPlayer
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {string} player_id
 *
 * @apiSuccess {Object} player
 * @apiSuccess {String} player_id
 * @apiSuccess {Number} user_seq
 * @apiSuccess {Number} slot_num 생성 슬롯 번호
 * @apiSuccess {String} nickname 닉네임
 * @apiSuccess {Number} gender 성별
 * @apiSuccess {Number} age 나이
 * @apiSuccess {Number} weight 체중
 * @apiSuccess {Number} height 키
 * @apiSuccess {String} post 플레이어 프로필 상태글
 * @apiSuccess {String} img 플레이어 프로필 이미지
 * @apiSuccess {Number} heartrate
 * @apiSuccess {Number} bloodpressure_upper
 * @apiSuccess {Number} bloodpressure_lower
 * @apiSuccess {Number} bmi
 * @apiSuccess {Number} muscle
 * @apiSuccess {Number} fatrate
 * @apiSuccess {Number} pants
 * @apiSuccess {Number} abdomenrate
 *
 * @apiSuccess {Number} code Success code
 * @apiSuccess {String} message Success message
 */

exports.getPlayer = async (ctx) => {
  const player_id = ctx.query.player_id;

  try {
    if (util.isEmpty(player_id)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const player = await servicePlayer.getPlayerInfo(player_id);
    const responseData = { player: player };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/getAll 모든 플레이어 조회
 * @apiName GetPlayerAll
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {string} user_seq
 *
 * @apiSuccess {Object} player
 * @apiSuccess {String} player_id
 * @apiSuccess {Number} user_seq 슬롯 번호
 * @apiSuccess {String} nickname 닉네임
 * @apiSuccess {Number} gender 성별
 * @apiSuccess {Number} age 나이
 * @apiSuccess {Number} weight 체중
 * @apiSuccess {Number} height 키
 * @apiSuccess {String} post 플레이어 프로필 상태글
 * @apiSuccess {String} img 플레이어 프로필 이미지
 * @apiSuccess {Number} heartrate
 * @apiSuccess {Number} bloodpressure_upper
 * @apiSuccess {Number} bloodpressure_lower
 * @apiSuccess {Number} bmi
 * @apiSuccess {Number} muscle
 * @apiSuccess {Number} fatrate
 * @apiSuccess {Number} pants
 * @apiSuccess {Number} abdomenrate
 *
 * @apiSuccess {Number} code Success code
 * @apiSuccess {String} message Success message
 */

exports.getAllPlayersData = async (ctx) => {
  const { user_seq, email } = ctx.query;
  if (!user_seq && !email) {
    return Result.error(ctx, 'INVALID_INPUT', 'User sequence or email is required.');
  }

  try {
    const user = await serviceUser.getUserInfo(email);

    let players;
    if (!user_seq) {
      players = await servicePlayer.getAllPlayers(user[0].seq);
    } else {
      players = await servicePlayer.getAllPlayers(user_seq);
    }

    const responseData = { players };
    return Result.success(ctx, responseData);
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 * @api {post} /api/player/update/nickname 플레이어 닉네임 변경
 * @apiName ChangeNickname
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {string} player_id
 * @apiBody {string} nickname
 *
 * @apiSuccess {Object} player
 * @apiSuccess {Object} player
 * @apiSuccess {String} player_id
 * @apiSuccess {Number} user_seq
 * @apiSuccess {Number} slot_num 생성 슬롯 번호
 * @apiSuccess {String} nickname 닉네임
 * @apiSuccess {Number} gender 성별
 * @apiSuccess {Number} age 나이
 * @apiSuccess {Number} weight 체중
 * @apiSuccess {Number} height 키
 * @apiSuccess {String} post 플레이어 프로필 상태글
 * @apiSuccess {String} img 플레이어 프로필 이미지
 * @apiSuccess {Number} heartrate
 * @apiSuccess {Number} bloodpressure_upper
 * @apiSuccess {Number} bloodpressure_lower
 * @apiSuccess {Number} bmi
 * @apiSuccess {Number} muscle
 * @apiSuccess {Number} fatrate
 * @apiSuccess {Number} pants
 * @apiSuccess {Number} abdomenrate
 *
 * @apiSuccess {Number} code Success code
 * @apiSuccess {String} message Success message
 */

exports.changeNickname = async (ctx) => {
  const { player_id, nickname } = ctx.request.body;

  try {
    if (util.isEmpty(player_id) || util.isEmpty(nickname)) {
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '필수 매개변수가 비어 있습니다.');
    }

    const player = await servicePlayer.changePlayerNickname(player_id, nickname);
    const responseData = { player: player };
    return Result.success(ctx, responseData, '닉네임이 성공적으로 변경되었습니다.');
  } catch (err) {
    return Result.error(ctx, httpStatus.INTERNAL_SERVER_ERROR, '닉네임 변경 실패');
  }
};

/**
 * @api {get} /api/player/getCount 플레이어 수 조회
 * @apiName PlayedCount
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiSuccess {Number} playerCount 플레이어 수
 * @apiSuccess {Number} code Success code
 * @apiSuccess {String} message Success message
 */

exports.getPlayerCount = async (ctx) => {
  try {
    const playerCount = await servicePlayer.getPlayersCount();
    const responseData = { playerCount: playerCount };

    return Result.success(ctx, responseData);
  } catch (err) {
    return Result.error(ctx, err, '실패');
  }
};

/**
 * @api {post} /api/player/getSlot 플레이어 슬롯
 * @apiName PlayedSlot
 * @apiGroup Player
 * @apiVersion 1.0.0
 *
 * @apiBody {String} user_seq
 *
 * @apiSuccess {Number} playerSlot 플레이어 슬롯
 * @apiSuccess {Number} code Success code
 * @apiSuccess {String} message Success message
 */
exports.getPlayerSlotByUser = async (ctx) => {
  const userSeq = ctx.query.user_seq;
  try {
    const playerCount = await servicePlayer.getPlayerSlotByUser(userSeq);
    const responseData = { playerSlot: playerCount };

    return Result.success(ctx, responseData);
  } catch (err) {
    return Result.error(ctx, err, '실패');
  }
};
