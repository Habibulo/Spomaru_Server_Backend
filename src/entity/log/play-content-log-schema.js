'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'PlayContentLog',
  tableName: 'play_content_log',
  comment: '',
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
    content_id: {
      type: 'varchar',
    },
    score: {
      type: 'int',
    },
    start_date: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '시작 시간',
    },
    end_date: {
      type: 'datetime',
      comment: '완료 시간',
    },
  },
});
