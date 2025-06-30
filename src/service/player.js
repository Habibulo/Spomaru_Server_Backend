'use strict';

const Player = require('../entity/user/player-schema');
const { dataSource } = require('../utils/database');
const logger = require('../utils/logger');
const playerSchema = require('../entity/user/player-schema');

/**
 * @param {*} player
 * @returns
 */
exports.createNewPlayer = async (player) => {
  try {
    const connection = dataSource('user');
    const playerRepository = connection.getRepository(Player);
    const newPlayer = await playerRepository.save(player);
    return newPlayer;
  } catch (err) {
    logger.error(`Failed to create new player: ${err}`);
    throw new Error('플레이어 생성에 실패했습니다.');
  }
};

/**
 * @param {*} playerId
 * @returns
 */
exports.getPlayerInfo = async (playerId) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(Player);
    const player = await repo.findOneBy({ player_id: playerId });
    return player;
  } catch (err) {
    logger.error(err);
    return;
  }
};

exports.getAllPlayers = async (userSeq) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(Player);
    const players = await repo.find({ where: { user_seq: userSeq } });
    return players;
  } catch (err) {
    logger.error(err);
    return;
  }
};

exports.changePlayerNickname = async (playerId, nickname) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(Player);
    const player = await repo.findOneBy({ player_id: playerId });
    if (!player) {
      return;
    }
    player.nickname = nickname;
    const newNick = await repo.save(player);
    return newNick;
  } catch (err) {
    logger.error(err);
    return;
  }
};

/**
 *
 * @param {*} playerId
 * @param {*} gender
 * @param {*} age
 * @param {*} weight
 * @param {*} height
 * @param {*} post
 * @param {*} img
 * @param {*} heartrate
 * @param {*} bloodpressure_upper
 * @param {*} bloodpressure_lower
 * @param {*} bmi
 * @param {*} muscle
 * @param {*} fatrate
 * @param {*} pants
 * @param {*} abdomenrate
 * @returns
 */
exports.updatePlayerData = async (
  playerId,
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
) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(playerSchema);
    let player = await repo.findOneBy({ player_id: playerId });
    if (!player) {
      throw new Error('플레이어 존재하지 않습니다.');
    }

    player.gender = gender ?? player.gender;
    player.nickname = nickname ?? player.nickname;
    player.age = age ?? player.age;
    player.weight = weight ?? player.weight;
    player.height = height ?? player.height;
    player.post = post ?? player.post;
    player.img = img ?? player.img;
    player.heartrate = heartrate ?? player.heartrate;
    player.bloodpressure_lower = bloodpressure_lower ?? player.bloodpressure_lower;
    player.bloodpressure_upper = bloodpressure_upper ?? player.bloodpressure_upper;
    player.bmi = bmi ?? player.bmi;
    player.muscle = muscle ?? player.muscle;
    player.fatrate = fatrate ?? player.fatrate;
    player.pants = pants ?? player.pants;
    player.abdomenrate = abdomenrate ?? player.abdomenrate;

    await repo.save(player);

    return player;
  } catch (err) {
    logger.error(err);
    return;
  }
};

/**
 *
 * @returns
 */
exports.getPlayersCount = async () => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(playerSchema);
    let playerCount = await repo.count();
    return playerCount;
  } catch (err) {
    logger.error(err);
    return;
  }
};

/**
 *
 * @param {*} userSeq
 * @returns
 */

exports.getPlayerSlotByUser = async (userSeq) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(playerSchema);
    const playerCount = await repo.find({ where: { user_seq: userSeq } });
    return playerCount.length - 1;
  } catch (err) {
    logger.error(err);
    return;
  }
};
