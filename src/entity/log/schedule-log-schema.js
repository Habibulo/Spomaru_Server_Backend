'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ScheduleLog',
  tableName: 'schedule_log',
  comment: '유저 스케쥴 로그',
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
    set_id: {
      type: 'bigint',
      comment: '세트 ID',
    },
    progress: {
      type: 'float',
    },
    status: {
      type: 'tinyint',
    },
    created_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '가입 시간',
    },
  },
  indices: [{ columns: ['seq'] }],
});
