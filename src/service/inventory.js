'use strict';

const PlayerInven = require('../entity/user/player-inventory-schema');
const { dataSource } = require('../utils/database');
const logger = require('../utils/logger');

/**
 *
 * @param {*} player_id
 * @param {*} item
 * @returns
 */
exports.insertItem = async (player_id, item_id, item_reason) => {
  const inventory = {};
  inventory.player_id = player_id;
  inventory.item_id = item_id;
  inventory.item_reason = item_reason;
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(PlayerInven);
    const inven = await repo.save(inventory);
    return inven;
  } catch (err) {
    logger.error(err);
    return;
  }
};

/**
 *
 * @param {*} player_id
 * @returns
 */
exports.getPlayerInven = async (player_id) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(PlayerInven);
    const inven = await repo.createQueryBuilder('inventory').where('player_id =:player_id', { player_id }).getMany();
    return inven;
  } catch (err) {
    return;
  }
};
/**
 *
 * @param {*} player_id
 * @param {*} item_id
 * @returns
 */

exports.deleteInven = async (player_id, item_id) => {
  try {
    const ds = dataSource('user');
    const repo = ds.getRepository(PlayerInven);
    const inven = await repo.createQueryBuilder().delete().where('player_id=:player_id AND item_id=:item_id', { player_id, item_id }).execute();
    return inven;
  } catch (err) {
    return;
  }
};
