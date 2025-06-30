'use strict';

const { dataSource } = require('../utils/database');
const PlayerFavorite = require('../entity/user/player-favourite-schema');
const logger = require('../utils/logger');
const ContentsInfo = require('../entity/data/content-info-schema');
const util = require('../utils/common');

/**
 *
 * @param {*} player_id
 * @param {*} content_id
 * @returns
 */

exports.addPlayerFavorite = async (player_id, content_id) => {
  const connection = dataSource('user');
  const repo = connection.getRepository(PlayerFavorite);
  const existingFav = await repo.findOneBy({ player_id, content_id });
  if (existingFav) {
    throw new Error('This player favorite already exists.');
  }
  const newFav = repo.create({ player_id, content_id });
  await repo.save(newFav);
  return newFav;
};

/**
 *
 * @param {*} player_id
 * @returns
 */
exports.getPlayerFavorite = async (player_id, filters) => {
  const { subCategoryType, sensorType } = filters;
  const connection1 = dataSource('user');
  const connection2 = dataSource('data');
  const repo1 = connection1.getRepository(PlayerFavorite);
  const repo2 = connection2.getRepository(ContentsInfo);

  try {
    const favorites = await repo1.find({ where: { player_id } });
    if (util.isEmpty(favorites)) {
      return;
    }
    const favoriteContentIds = favorites.map((favorite) => favorite.content_id);

    const queryParams = [favoriteContentIds];
    let query = 'SELECT * FROM content_info WHERE content_id IN (?)';

    if (subCategoryType.length > 0) {
      query += ' AND sub_category IN (?)';
      queryParams.push(subCategoryType);
    }

    if (sensorType.length > 0) {
      query += ' AND sensor_type IN (?)';
      queryParams.push(sensorType);
    }

    const contentData = await repo2.query(query, queryParams);

    const filteredFavorites = favorites.filter((favorite) => contentData.some((content) => content.content_id == favorite.content_id));

    filteredFavorites.forEach((favorite) => {
      favorite.content = contentData.find((content) => content.content_id == favorite.content_id);
    });

    return filteredFavorites;
  } catch (err) {
    logger.error(err);
    throw new Error('Failed to retrieve player favorites.');
  }
};

/**
 *
 * @param {*} player_id
 * @param {*} content_id
 * @returns
 */

exports.getOneFavorite = async (player_id, content_id) => {
  const connection1 = dataSource('user');
  const connection2 = dataSource('data');
  const repo1 = connection1.getRepository(PlayerFavorite);
  const repo2 = connection2.getRepository(ContentsInfo);

  try {
    const favorites = await repo1.find({ where: { player_id, content_id } });

    const contentData = await repo2.find({ where: { content_id } });

    const filteredFavorites = favorites.filter((favorite) => contentData.some((content) => content.content_id == favorite.content_id));

    filteredFavorites.forEach((favorite) => {
      favorite.content = contentData.find((content) => content.content_id == favorite.content_id);
    });

    return filteredFavorites;
  } catch (err) {
    logger.error(err);
    throw new Error('Failed to retrieve player favorites.');
  }
};

/**
 *
 * @param {*} fav_id
 * @returns
 */
exports.deletePlayerFavorites = async (fav_ids) => {
  try {
    const connection = dataSource('user');
    const repo = connection.getRepository(PlayerFavorite);

    const favorites = await repo.findByIds(fav_ids);

    await repo.remove(favorites);

    return favorites;
  } catch (err) {
    console.error('An error occurred while deleting player favorites:', err);
    throw new Error('An error occurred while deleting player favorites: ' + err);
  }
};
