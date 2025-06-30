'use strict';

const { EntitySchema } = require('typeorm');

module.exports = new EntitySchema({
  name: 'ItemLog',
  tableName: 'item_log',
  comment: '아이템 로그',
  columns: {
    seq: {
      primary: true,
      type: 'bigint',
      unsigned: true,
      generated: true,
      comment: '로그 고유번호',
    },
    user_seq: {
      type: 'bigint',
      unsigned: true,
      comment: '유저 고유 번호',
    },
    item_id: { type: 'bigint' },
    item_type: { type: 'varchar' },
    item_count: { type: 'int' },
    logged_at: {
      type: 'datetime',
      default: () => 'CURRENT_TIMESTAMP',
      comment: '가입 시간',
    },
  },
  indices: [{ columns: ['user_seq'] }],
});
