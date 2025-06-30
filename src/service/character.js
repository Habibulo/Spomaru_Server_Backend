'use strict';

const playerCharacter = require('../entity/user/player-character-schema');

const { dataSource } = require('../utils/database');
const logger = require('../utils/logger');

/**
 *
 * @param {*} player_id
 * @param {*} gender
 * @param {*} face
 * @param {*} skin
 * @param {*} hair
 * @param {*} haircolor
 * @param {*} top
 * @param {*} bottom
 * @param {*} shoes
 * @param {*} acc
 * @returns
 */
exports.createCharacter = async (player_id, gender, face, skin, hair, haircolor, top, bottom, shoes, acc) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(playerCharacter);

    const character = {
      player_id: player_id,
      gender: gender,
      face: face,
      skin: skin,
      hair: hair,
      haircolor: haircolor,
      top: top,
      bottom: bottom,
      shoes: shoes,
      acc: acc,
    };
    const newCharacter = await repo.save(character);
    return newCharacter;
  } catch (err) {
    logger.error(`Failed to create new character: ${err}`);
    throw new Error('캐릭터 생성에 실패했습니다.');
  }
};
/**
 *
 * @param {*} player_id
 * @returns
 */
exports.getCharacterInfo = async (player_id) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(playerCharacter);
    const player = await repo.findOneBy({ player_id: player_id });
    return player;
  } catch (err) {
    logger.error(err);
    return;
  }
};

/**
 *
 * @param {*} player_id
 * @param {*} face
 * @param {*} skin
 * @param {*} hair
 * @param {*} haircolor
 * @param {*} top
 * @param {*} bottom
 * @param {*} shoes
 * @param {*} acc
 * @returns
 */

exports.costumeChange = async (player_id, face, skin, hair, haircolor, top, bottom, shoes, acc) => {
  const ds = dataSource('user');
  const repo = ds.getRepository(playerCharacter);
  let character = await repo.findOneBy({ player_id: player_id });

  character.face = face ?? character.face;
  character.skin = skin ?? character.skin;
  character.hair = hair ?? character.hair;
  character.haircolor = haircolor ?? character.haircolor;
  character.top = top ?? character.top;
  character.bottom = bottom ?? character.bottom;
  character.shoes = shoes ?? character.shoes;
  character.acc = acc ?? character.acc;

  await repo.save(character);
  return character;
};

/**
 *
 * @param {*} player_id
 * @param {*} gender
 * @param {*} face
 * @param {*} skin
 * @param {*} hair
 * @param {*} haircolor
 * @param {*} top
 * @param {*} bottom
 * @param {*} shoes
 * @param {*} acc
 * @returns
 */
exports.createCharacter = async (player_id, gender, face, skin, hair, haircolor, top, bottom, shoes, acc) => {
  const ds = dataSource('user');
  const repo = ds.getRepository(playerCharacter);

  const character = {};

  character.player_id = player_id;
  character.gender = gender;
  character.face = face;
  character.skin = skin;
  character.hair = hair;
  character.haircolor = haircolor;
  character.top = top;
  character.bottom = bottom;
  character.shoes = shoes;
  character.acc = acc;

  await repo.save(character);
  return character;
};
