'use strict';

const Result = require('../utils/result');
const util = require('../utils/common');
const errors = require('../constants/errors');
const serviceCharacter = require('../service/character');
const logger = require('../utils/logger');

/**
 *
 * @api {post} /api/player/character/create 캐릭터 생성
 * @apiName CreateCharacter
 * @apiGroup Character
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id	플레이어 ID
 * @apiBody {number = 1: MALE, 2:FEMALE} gender 캐릭터 성별
 * @apiBody  {number} face 얼굴
 * @apiBody  {number} skin 피부색
 * @apiBody  {number} hair 헤어
 * @apiBody  {number} haircolor 헤어 컬러
 * @apiBody  {number} top 상의
 * @apiBody  {number} bottom 하의
 * @apiBody  {number} shoes 신발
 * @apiBody  {number} acc 장신구
 *
 * @apiSuccess {String} character_id
 * @apiSuccess {String} player_id
 * @apiSuccess {number = 1: MALE, 2:FEMALE} gender
 * @apiSuccess  {number} face 얼굴
 * @apiSuccess  {number} skin 피부색
 * @apiSuccess  {number} hair 헤어
 * @apiSuccess  {number} haircolor 헤어 컬러
 * @apiSuccess  {number} top 상의
 * @apiSuccess  {number} bottom 하의
 * @apiSuccess  {number} shoes 신발
 * @apiSuccess  {number} acc 장신구
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */
exports.createCharacter = async (ctx) => {
  const { player_id, face, skin, hair, haircolor, top, bottom, shoes, acc } = ctx.request.body;

  const requiredProperties = [player_id, face, skin, hair, haircolor, top, bottom, shoes, acc];
  for (const prop of requiredProperties) {
    if (util.isEmpty(ctx.request.body[prop])) {
      logger.warn(errors.ERROR_CODE.PARAMS_EMPTY + ` ${prop} is empty.`);
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, `${prop} is empty.`);
    }
  }

  try {
    const newCharacter = await serviceCharacter.createCharacter(player_id, face, skin, hair, haircolor, top, bottom, shoes, acc);
    const responseData = { newCharacter: newCharacter };
    return Result.success(ctx, responseData, 'Character created successfully.');
  } catch (err) {
    logger.error('An error occurred while creating the character:', err);
    return Result.error(ctx, err.code, err.message);
  }
};
/**
 *
 * @api {post} /api/player/character 캐릭터 정보
 * @apiName CharacterInfo
 * @apiGroup Character
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id
 *
 * @apiSuccess {String} character_id
 * @apiSuccess {String} player_id
 * @apiSuccess {number = 1: MALE, 2:FEMALE} gender
 * @apiSuccess  {number} [face] 얼굴
 * @apiSuccess  {number} [skin] 피부색
 * @apiSuccess  {number} [hair] 헤어
 * @apiSuccess  {number} [haircolor] 헤어 컬러
 * @apiSuccess  {number} [top] 상의
 * @apiSuccess  {number} [bottom] 하의
 * @apiSuccess  {number} [shoes] 신발
 * @apiSuccess  {number} [acc] 장신구
 *
 * @apiError {String} code
 * @apiError {string} message Error message.
 */

exports.characterInfo = async (ctx) => {
  const player_id = ctx.request.body.player_id;

  try {
    if (util.isEmpty(player_id)) {
      logger.warn(errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const character = await serviceCharacter.getCharacterInfo(player_id);
    const responseData = { character: character };
    return Result.success(ctx, responseData, '캐릭터 정보가 성공적으로 가져왔습니다.');
  } catch (err) {
    logger.error('캐릭터 정보 검색 중 오류가 발생했습니다:', err);
    return Result.error(ctx, err.code, err.message);
  }
};

/**
 *
 * @api {post} /api/player/character/change 캐릭터 코스튬 변경
 * @apiName Character CostumeChange
 * @apiGroup Character
 * @apiVersion 1.0.0
 *
 * @apiBody {String} player_id	플레이어 ID
 * 
 * @apiSuccess {String} character_id 캐릭터 ID
 * @apiSuccess {String} player_id	플레이어 ID
 * @apiSuccess {number = 1: MALE, 2:FEMALE} gender 캐릭터 성별
 * @apiSuccess  {number} [face] 얼굴
 * @apiSuccess  {number} [skin] 피부색
 * @apiSuccess  {number} [hair] 헤어
 * @apiSuccess  {number} [haircolor] 헤어 컬러
 * @apiSuccess  {number} [top] 상의
 * @apiSuccess  {number} [bottom] 하의
 * @apiSuccess  {number} [shoes] 신발
 * @apiSuccess  {number} [acc] 장신구

 * @apiSuccess {number} code
 * @apiSuccess {string} message
 */

exports.characterCostumeChange = async (ctx) => {
  const { player_id, face, skin, hair, haircolor, top, bottom, shoes, acc } = ctx.request.body;

  try {
    if (util.isEmpty(player_id)) {
      logger.warn(errors.ERROR_CODE.PARAMS_EMPTY + ' 패러미터가 비어 있습니다.');
      return Result.error(ctx, errors.ERROR_CODE.PARAMS_EMPTY, '패러미터가 비어 있습니다.');
    }
    const character = await serviceCharacter.costumeChange(player_id, face, skin, hair, haircolor, top, bottom, shoes, acc);
    const responseData = { character: character };

    logger.info('코스튬을 성공적으로 변경되었습니다.');
    return Result.success(ctx, responseData, '코스튬을 성공적으로 변경되었습니다.');
  } catch (err) {
    logger.error(err.code + err.message);
    return Result.error(ctx, err.code, err.message);
  }
};
