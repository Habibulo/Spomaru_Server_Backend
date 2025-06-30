'use strict';

const { dataSource } = require('../utils/database');
const PlayerStats = require('../entity/user/player-stats-schema');
const playerStatsSchema = require('../entity/log/player-stat-log-schema');
const playerStatLogSchema = require('../entity/log/player-stat-log-schema');
/**
 *
 * @param {*} player_id
 * @returns
 */
exports.setStats = async (player_id) => {
  const connection = dataSource('user');
  const repo = connection.getRepository(PlayerStats);

  const stats = {};
  stats.player_id = player_id;
  stats.ustr = 0;
  stats.lstr = 0;
  stats.dur = 0;
  stats.fle = null;
  stats.fla = 0;
  stats.coo = 0;

  const initStats = await repo.save(stats);

  return initStats;
};

/**
 *
 * @param {*} type
 * @param {*} player_id
 * @param {*} value
 * @returns
 */
exports.setStatByType = async (player_id, ustr, lstr, dur, fle, fla, coo) => {
  const connection = dataSource('user');
  const repo = connection.getRepository(PlayerStats);

  let stats = await repo.findOne({ where: { player_id } });

  if (!stats) {
    stats = {};
    stats.player_id = player_id;

    stats.ustr = 0;
    stats.lstr = 0;
    stats.dur = 0;
    stats.fle = null;
    stats.fla = 0;
    stats.coo = 0;
  }

  if (ustr != null) {
    stats.ustr = ustr;
  }
  if (lstr != null) {
    stats.lstr = lstr;
  }
  if (dur != null) {
    stats.dur = dur;
  }
  if (fle != null) {
    stats.fle = fle;
  }
  if (fla != null) {
    stats.fla = fla;
  }
  if (coo != null) {
    stats.coo = coo;
  }

  const resultStat = await repo.save(stats);

  return resultStat;
};

exports.getStatByType = async (player_id, stat) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(playerStatLogSchema);

  const playerStats = await repo.find({
    where: {
      player_id: player_id,
      stat_type: stat,
    },
    order: {
      received_at: 'DESC',
    },
  });

  return playerStats;
};

/**
 *
 * @param {*} player_id
 * @returns
 */

exports.getAllPlayerStats = async (player_id) => {
  const connection = dataSource('user');
  const repo = connection.getRepository(PlayerStats);
  const playerStats = await repo.findOne({ where: { player_id } });
  return playerStats;
};

/**
 *
 * @param {*} player_id
 * @returns
 */

exports.getPlayerStatsHistory = async (player_id) => {
  const connection = dataSource('log');
  const repo = connection.getRepository(playerStatsSchema);
  const playerHistoryStats = await repo.findBy({ player_id: player_id });
  return playerHistoryStats;
};
