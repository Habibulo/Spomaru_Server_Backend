'use strict';

const { dataSource } = require('../utils/database');
const ItemInfo = require('../entity/data/item-info-schema');
const enums = require('../constants/enums');

/**
 *
 */

exports.getItem = async (item_id) => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ItemInfo);
  const item = await repo.findOneBy({ item_id: item_id });
  return item;
};

/**
 *
 * @param {*} type
 */
exports.getItemsByType = async (type) => {
  const item_type = enums.ITEM_TYPE[type];

  const connection = dataSource('data');
  const repo = connection.getRepository(ItemInfo);
  const item = await repo.createQueryBuilder('item').where('item.type =:item_type', { item_type }).getMany();

  return item;
};

/**
 *
 * @param {*} part
 * @returns
 */
exports.getCostumeByPart = async (part) => {
  const connection = dataSource('data');
  const repo = connection.getRepository(ItemInfo);

  try {
    const items = await repo.createQueryBuilder('costume').where('costume.parts = :part', { part }).getMany();

    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
