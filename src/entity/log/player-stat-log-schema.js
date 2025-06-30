'use strict';

const { EntitySchema } = require('typeorm');
const enums = require('../../constants/enums');

module.exports = new EntitySchema({
  name: 'PlayerStatLog',
  tableName: 'player_stat_log',
  comment: '플레이어 능력치 변경 로그',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '로그 고유번호',
    },
    player_id: {
      type: 'varchar',
      comment: '프레이어 ID',
    },
    stat_type: {
      type: 'enum',
      enum: enums.STAT_TYPE,
      comment: '능력치 타입',
    },
    stat_value: {
      type: 'varchar',
      comment: '능력치 취득 값',
    },
    received_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '취득 시간',
    },
  },
});
